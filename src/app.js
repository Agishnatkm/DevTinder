const  express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/useTemp");
const {validateSignup} = require("./helper/validate");
const bcrypt = require("bcrypt");
app.use(express.json());
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
app.use("/", authRouter);
app.use("/", profileRouter);
// get profile

// get all users

app.get("/allUsers",async(req,res)=>{
    //get all users
   
    try{
         const user = await User.find({});
        res.send(user);
    }catch(err){
        console.log(err);
        res.status(400).send("something went wrong...",err);
    }
});

// find a user with mailid.
app.get("/user",async(req,res)=>{
       
    try{
         const user = await User.findOne({email:req.body.email});
        res.send(user);
    }catch(err){
        console.log(err);
        res.status(400).send("something went wrong...",err);
    }
});

// delete a user

app.delete("/user",async(req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.body.UserId);
        res.send("user deleted successfully");
    }catch(err){
        res.send("error something wet wrong")
    }
});

// update
 app.patch("/user/:UserId",async(req,res)=>{
    const userId = req.params.UserId;
    const data = req.body;
    try{
        const allowed_updates = ["age","gender"];
        const isUpdateAllowed = Object.keys(data).every((k)=>allowed_updates.includes(k));
        console.log(isUpdateAllowed);
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        const user = await User.findByIdAndUpdate( userId, data,{
            runValidators:true,
        });
        if(!user){
            res.send("user not found", userId,data);
        }
        res.send("user updated");
    }catch(err){
        console.log(err.message)
    }
 });

connectDB()
    .then(()=>{
        console.log("DB connection established");
        app.listen(7777,() => {
            console.log("sever is lisening port 7777");
         });
}).catch((err)=>{
    console.log("err",err);
    console.log("DB connection failed");
});

