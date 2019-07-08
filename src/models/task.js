const mongoose = require("mongoose");


const Schema = mongoose.Schema({
    // Creates a model with the name Task.
    
        desc: {
            type: String,
            required: true,
        }, 
        // This is the data elements inside of the model, 
        // For example this is desc, which will hold the description, as we can 
        // See it is a String, and it is required. 
    
        completed: {
    
            type: Boolean,
            default: false,
        },
        // Default will automatically make that element whatever the default 
        // Value assigned was if the parameter is not provided. 
    
        owner: {
    
            type:mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
            // We will use this to make sure a task belongs 
            // To a specific user, we will store the objectID, 
            // This is also a reference, which we will use to easily 
            // Get the whole user object. 
        }
    
        
    }, {

        timestamps: true,
    })

const Task = mongoose.model("Task", Schema)

module.exports = Task;
// Exports the class