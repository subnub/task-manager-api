const express = require("express");

const router = new express.Router;

router.get("", async (req, res) => {

    res.render("index", {

    });

})

router.get("/home", async(req, res) => {

    res.render("homepage", {

        title: "All Tasks",

    });
})

router.get("/not-completed", async(req, res) => {

    res.render("notcompleted", {

        title: "Not Completed",
    })
})

router.get("/completed", async(req, res) => {

    res.render("completed", {

        title: "Completed",
    })
})

router.get("/create", async(req, res) => {

    res.render("create",{

        title: "Create Task",
    })

})

router.get("/logout", async(req, res) => {

    res.render("logout", {

    
    })
})
module.exports = router;