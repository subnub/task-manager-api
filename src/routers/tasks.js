const express = require("express");
const router = new express.Router;
const Task = require("../models/task");
const auth = require("../middleware/auth");
const User = require("../models/user");


router.post("/tasks", auth, async (req, res) => {
    // Creates new tasks.

    const task = new Task({
        ...req.body,
        owner: req.user._id,
        // Spreads everything in the body, and also adds a owner. 
    })

    try {

        await task.save();
        res.status(201).send(task);
        console.log("created task");

    } catch (e) {

        console.log(e);
        res.status(400).send(e);

    }

});

router.get("/taskstest", async(req, res) => {

    const tasksList = await Task.find({});

    res.send(tasksList);
})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt_asc
// -1 for desc, 1 for asc
router.get("/tasks", auth, async (req, res) => {
    // Returns a list of all tasks. 

    const match = {}
    const sort = {}

    if (req.query.sortBy) {

        const parts = req.query.sortBy.split("_");

        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
   
    }
    
    if (req.query.completed) {

        match.completed = req.query.completed === "true";
    }

    try {
   
        await req.user.populate({
            path:"tasks",
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort,
            },
            match
        }).execPopulate();
        // Here we use the relation we set up in order to 
        // Automatically fetch all of the Tasks associated to a user.

        res.send(req.user.tasks);

    } catch (e) {

        console.log("error",e);
        res.status(500).send(e);

    } 
    

})

router.get("/tasks/number", auth, async(req, res) => {

    try {

        await req.user.populate({path:"tasks"}).execPopulate();

        if (!req.user.tasks) {

            return res.status(404).send();
        }

        res.send({
            task_length: req.user.tasks.length,
        })



    } catch(e) {

        res.status(500).send(e);
    }
    

    console.log(req.user.tasks.length);
})

router.get("/tasks/:id", auth, async (req, res) => {
    // Returns an individual task by looking up with the ID,
    // Which is provided in the URL (notice the :).

    const _id = req.params.id;
    // How we get parameters from the URL.

    try {

        const findSingleTask = await Task.findOne({_id, owner: req.user._id});

        if (!findSingleTask) {

            return res.status(404).send();
        }

        res.send(findSingleTask);
        console.log("Single Task Sent");

    } catch(e) {

        res.status(500).send(e);
    }
    
})


router.patch("/tasks/:id", auth, async (req, res) => {
    // Updates a task by ID

    const id = req.params.id;

    const allowedTypes = ["desc", "completed"];
    const updateKeys = Object.keys(req.body);

    const typePassed = updateKeys.every((update) => {

        return allowedTypes.includes(update);
    })
    // We check to make sure all the JSON elements are allowed to be 
    // Updated. 

    if (!typePassed) {

        return res.status(400).send({error:"invalid type"});
    }

    try {

        const foundTask = await Task.findOne({_id:req.params.id, owner: req.user._id});

        if (!foundTask) {

            return res.status(404).send();
        }

        updateKeys.forEach((key) => {

            foundTask[key] = req.body[key]
        })
        // We update it manually be each element, and then save it
        // We could use the built in method for this, but it is being 
        // Depicated, and skips Mongoose middleware since it uses a 
        // MongoDB call directly. 

        await foundTask.save();

        res.send(foundTask);

        console.log("updated task");

    } catch (e) {

        res.status(400).send(e);
    }
    

})

router.delete("/tasks/:id", auth, async (req, res) => {
    // Deletes a task

    const id = req.params.id;

    try {

        const deletedTask = await Task.findOneAndDelete({_id:id, owner: req.user._id});

        if (!deletedTask) {

            return res.status(404).send();
        }

        res.send(deletedTask);
        console.log("deleted task");

    } catch (e) {

        res.status(500).send(e);
    }
    

})

module.exports = router;