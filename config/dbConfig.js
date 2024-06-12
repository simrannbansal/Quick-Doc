const mongoose = require("mongoose");
require('dotenv').config();
mongoose.connect(process.env.MONGO_URL);
const connection = mongoose.connection;
connection.on("connected",()=>{
    console.log("Mongoose connection is successful");
});
connection.on("error",(error)=>{
    console.log("Error in MongoDB connection",error);
});
module.exports = mongoose;
