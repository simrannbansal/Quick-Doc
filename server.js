const express = require("express");
const app=express();
const dbConfig = require("./config/dbConfig");
require("dotenv").config();
app.use(express.json())
const userRoute=require("./routes/userRoute");
const adminRoute=require("./routes/adminRoute");
const doctorRoute=require("./routes/doctorRoute");
app.use("/api/user",userRoute);
app.use("/api/admin",adminRoute);
app.use("/api/doctor",doctorRoute);
const port= process.env.PORT || 5000;

const path = require("path");
__dirname = path.resolve();


// render deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port,()=>{
    console.log(`Node Server started at port ${port}`);
});

