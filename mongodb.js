// CRUD create read update delete

const mongoDB = require("mongodb");
const mongoClient = mongoDB.MongoClient;
const ObjectID = mongoDB.ObjectID;

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";


mongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {

    if (error) {
        return console.log("Error",error);
    }

    console.log("Connected To MongoDB...")

    const db = client.db(databaseName);
    
//    const updatePromise = db.collection("users")
//    .updateMany([{_id: new ObjectID("5d1031b0340d2cdf5d1456ff")},{_id: new ObjectID("5d1031b0340d2cdf5d1456ff")}], {

//         $set: {
//             name: "mike",   
//         }
//    }).then((result) => {
   
//     console.log(result)

//    }).catch((error) => {

//     console.log(error);

//    });

// db.collection("users").updateMany({

//     name: "Kyle"

// }, {

//     $set: {
//         name: "Kyle2"
//     }

// }).then((result) => {

//     console.log(result);

// }).catch((error) => {

//     console.log(error);
// })

db.collection("users")
.deleteOne({_id: new ObjectID("5d1031b0340d2cdf5d1456ff")})
.then((result) => {
    console.log(result);
})

 


    
})