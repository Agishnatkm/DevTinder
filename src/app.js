const  express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/useTemp");

app.use(express.json());

app.post("/signup",async(req,res)=>{
    //creating a new instance of the user model
    const user = new User(req.body);
    try{
        await user.save();
        res.send("user signup successfull");
    }catch(err){
        res.status(400).send("user signup failed",err);
    }
});
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
})

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

