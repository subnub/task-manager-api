const jwt = require("jsonwebtoken")
const mongoose = require("mongoose");
const User = require("../../src/models/user");


const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: "Test User", 
    email: "test@test.com", 
    password: "kyle1234",
    tokens: [{
        token: jwt.sign({_id:userOneId}, process.env.JSON_KEY)
    }]
}

const setupDatabase = async() => {

    await User.deleteMany({})
    await new User(userOne).save();
    
}

module.exports = {
    userOneId, 
    userOne, 
    setupDatabase
}