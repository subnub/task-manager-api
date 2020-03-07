const express = require("express");
const path = require("path");
const hbs = require("hbs")

require("./db/mongoose");
// This has the function used to connect to our mongoDB with 
// Mongoose so we can use the Models here. 

const User = require("./models/user");
const Task = require("./models/task");
// Here is our Mongoose models. 

const app = express();

const viewPath = path.join(__dirname, "../templates/views")
const publicPath = path.join(__dirname, "../public");
const particalsPath = path.join(__dirname, "../templates/partials")

app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(particalsPath)


app.use(express.static(publicPath))

const port = process.env.PORT;
// Uses our env file for thte port. 

const userRouter = require("./routers/users");
const taskRouter = require("./routers/tasks");
const htmlTaskRouter = require("./routers/html_task");
// These are our routers, each one handles HTTP request using REST

// Express MiddleWare - Runs between request from server, and router 
// Handler, used for authetication. 
app.use((req, res, next) => {
    // We next to let express know we are finished, or else it will 
    // Hang.

    console.log(req.method, req.path);
    // The req.method variable will return the type of request, for 
    // Example, GET, POST.
    // path is the url, for examples /users

   

    next()
    // Lets express know we finished. 

});


app.use(express.json());
// Allows express to automatically parse JSON data. 

app.use(userRouter, taskRouter, htmlTaskRouter);
// Adds our Routers, which is our HTTP request, its good
// To keep each one seperate. 

module.exports = app;


