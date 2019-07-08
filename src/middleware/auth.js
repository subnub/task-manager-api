const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async(req,res,next) => {

    try {

        const token = req.header("Authorization")
        .replace("Bearer ", "");

        const decoded = jwt.verify(token, process.env.JSON_KEY);
    
        const user = await User.findOne({_id:decoded._id,
             'tokens.token':token})

        if (!user) {

            throw new Error();
        }

        req.token = token;
        req.user = user
        // We attach the token and the user to request, 
        // We can now access them on any api that uses auth.

        

        console.log("token",token);
    } catch (e) {
        console.log(e);

        res.status(401).send({error:"Please autheticate"});
    }

    next()

}

module.exports = auth;