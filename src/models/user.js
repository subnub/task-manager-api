const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Task = require("../models/task");

const userSchema = new mongoose.Schema({
// Creates the user model, notice we use Scheme here instead 
// Of it being inside of model function itself, this is because 
// We are going to use middleware below. 

    name : {
        type:String,
        trim: true,
    },  // Trim will automatically take off any spaces. 
    email: {

        type: String,
        required: true, 
        trim: true, 
        unique: true,
        lowercase: true,
        validate(value) {
            // Validate we can use to run custom 
            // Methods to validate our data, the value 
            // Parameter is the data being passed in. 

            if (!validator.isEmail(value)) {
                // Here we use the validator library to check if an 
                // Email is valid. 

                throw new Error("Email is invalid");
                // Throw a new error, if it passed we just let it run through. 
            }
        }
        // Unique: Will check the DB and make sure that value isnt already 
        // Stored in another model, we do this so users cant use multiple accounts
        // With the same email.


    }, 
    password: {
        
        type: String, 
        trim: true, 
        required: true,
        validate(value) {

            if (value.length < 6 || value === "password") {

                throw new Error("Length or value password error");
            }
        }
        
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {

            if (value < 0) {
                throw new Error("Age lower than 0")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
        // This is a list because users can have multiple tokens, 
        // Since they might be signed in on multiple devices at once. 
    }],
    avatar: {
        type: Buffer,
    }
}, {

    timestamps: true,
});

userSchema.virtual("tasks", {

    ref: "Task",
    localField: "_id",
    foreignField: "owner"
    // Sets up virtual data for us to access the complete task list 
    // For a specific user, this is not real data
})

// Hashs PlainText password before saving
userSchema.pre("save", async function(next) {

    const user = this;

    if (user.isModified("password")) {

        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
    // Required to let mongoose know we finished. 
})

userSchema.pre("remove", async function(next) {

    const user = this; 

    await Task.deleteMany({owner: user._id});

    await Task
})

userSchema.statics.findByCreds = async(email, password) => {
    // This is a method we add to the User Object itself, its worth 
    // Noting this is NOT for instances of models (models we created with 'new User')
    // Instead this would be like "const User = require(./user)" and then using 
    // User.findByCreds.

    // We use this to check if the password entered is correct or not. 
    const user = await User.findOne({email});

    if (!user) {

        throw new Error("Unable to login");

    }

    const isMatch = await bcrypt.compare(password, user.password);
    // Checks if a password mathces a hashed password, which we already 
    // Have stored in the DB.

    if (!isMatch) {

        throw new Error("Unable to login");
        // If the password is not a match we throw an 
        // Error. 
    }

    return user;
    // We return the user if it passed. 
}

userSchema.methods.toJSON = function() {

    const user = this; 

    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

// 

userSchema.methods.generateAuthToken = async function() {
    // This is like the opposite of the static one above, this is methods 
    // On instances of the User model (Like 'const user = new User()' and then doing
    // 'user.generateAuthToken()')

    const user = this;
    const token = jwt.sign({_id:user._id.toString()}, "kyle1234");
    // Here we generate a token, using the model ID as the unique identififer.
    // And then using a signkey. 

    user.tokens = user.tokens.concat({token});
    // We concat it so it will remain a list. 
    
    await user.save();
    return token;


} 

const User = mongoose.model("User", userSchema);
// Apply the schema instead of the normal object. 

module.exports = User;
