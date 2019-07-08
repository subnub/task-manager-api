const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
});
// Connects us to our mongoDB database, will automatically create a 
// New collection if there isnt one already, we also need to use an URL 
// Parser for this to work. 