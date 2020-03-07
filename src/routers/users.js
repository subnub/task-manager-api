const express = require("express");
const router = new express.Router;
const auth = require("../middleware/auth");
const User = require("../models/user");
const Task = require("../models/task");
const multer = require("multer");
const sharp = require("sharp");
const {sendWelcomeEmail, sendCancelationEmail} = require("../emails/account");



const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {

            return cb(new Error("JPG, JPEG, or PNG, only"));
        }

        cb(undefined, true);
    }
    
})

const testUpload = multer({


})

router.post("/testupload/:id", testUpload.single("download"), async(req, res) => {

    

    const user = await User.findById(req.params.id);


    if (!user) {

        return res.status(404).send();
    }

    try {
        user.avatar = req.file.buffer;

        await user.save()

        res.send();

    } catch(e) {

        console.log(e)
        
        res.status(500).send(e);
    }
    

})

router.get("/testupload/:id", async (req, res) => {

    console.log("get zip");
    try {

        const user = await User.findById("5d1bbad9370199170d1d3d54");

        if (!user) {

            console.log("no user");
            return res.status(404).send();
        }

        // res.download(user.avatar, "test.zip", function(err) {
        //     console.log(err)
        // })
        res.setHeader('Content-Disposition', 'attachment; filename=test.zip');
        res.send(Buffer.from(user.avatar, "binary"))


    } catch (e) {

        console.log(e)
        res.status(500).send(e);
    }
})

router.post("/users",async (req, res) => {

    try {


        const user = new User(req.body);
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
       
         
         res.status(201).send({user, token});
        
         console.log("user created");
    } catch (e) {

        console.log(e);
        res.status(400).send(e);
    }

});

router.get("/users/login-checker", auth, async(req, res) => {

    try {

        res.send();
    } catch(e) {

        res.status(500).send(e);
    }
})

router.post("/users/login", async(req, res) => {

    try{ 
        console.log("user & pass", req.body.email + " " + req.body.password);

        const user = await User.findByCreds(req.body.email, 
            req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});


    } catch (e) {

        res.status(400).send(e);
    }
})

router.post("/users/logout", auth, async(req, res) => {

    console.log("attempting logout")

    try {

        req.user.tokens = req.user.tokens.filter((token) => {

            return token.token !== req.token;
        })

        await req.user.save();

        res.send();
    } catch (e) {
        console.log(e);
        res.status(400).send();

    }
})

router.post("/users/logoutAll", auth, async (req,res) => {

    try {

        req.user.tokens = [];

        await req.user.save();

        res.status(200).send(req.user);
    } catch (e) {

        res.status(500).send(e);
    }

    


})

router.get("/users/me", auth, async (req, res) => {

    // try {

    //     const foundUser = await User.find({});
    //     res.send(foundUser);
    //     console.log("sent user list");
        
    // } catch (e) {

    //     res.status(500).send(e);
    // }

    res.send(req.user);
});

// router.get("/users/:id", async (req, res) => {

//     const _id = req.params.id;

    
//     try {

//         const foundUser = await User.findById(_id);

//         if (!foundUser) {

//             return res.status(404).send();
//         }
//         res.send(foundUser);
//         console.log("single user sent");

//     } catch (e) {

//         res.status(500).send(e);
//     }

// })

router.patch("/users/me", auth,async (req, res) => {

    const updates = Object.keys(req.body);

    const allowedUpdates = ["name", "email", "password", "age"]

    const id = req.user._id;
    // Since we use the auth express middleware, the function 
    // Returns user on the request. 

    const isValidOperation = updates.every((update) => {

        return allowedUpdates.includes(update);
    })

    if (!isValidOperation) {

        return res.status(400).send({error:"invalid type"})
    }
   
    try {

        const user = req.user;

        updates.forEach((update) => {

            user[update] = req.body[update]
        })

        await user.save();

        res.send(user);

        console.log("user updated");

    } catch (e) {

        console.log(e);
        res.status(400).send(e);        
    }


})

router.delete("/users/me", auth, async (req, res) => {

    //const id = req.user._id;
    const userToDelete = req.user;
    // Since we use the auth express middleware, the function 
    // Returns user on the request. 

    try {

        // const deletedUser = await User.findByIdAndDelete(id);

        // if (!deletedUser) {

        //     return res.status(404).send();
        // }

        await req.user.remove();

        sendCancelationEmail(req.user.email, req.user.name); 

        res.send(req.user);
        console.log("deleted user");

    } catch (e) {

        res.status(500).send();
    }

})


router.post("/users/me/avatar", auth, upload.single("avatar"),
async (req, res) => {

    const buffer = 
    await sharp(req.file.buffer)
    .resize({width: 250, height: 250})
    .png().toBuffer();

    req.user.avatar = buffer;    
    await req.user.save();

    res.send();
}, (error, req, res, next) => {

    res.status(400).send({error: error.message})
})

router.delete("/users/me/avatar", auth, async(req, res) => {

    try {
        req.user.avatar = undefined;

        await req.user.save();

        res.send();
    } catch (e) {

        res.status(500).send();
    }
});

router.get("/users/:id/avatar", async(req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {

            throw new Error()
        }

        res.set("Content-Type", "image/png");

        res.send(user.avatar);

    } catch (e) {

        res.status(404).send();
    } 
})




module.exports = router;