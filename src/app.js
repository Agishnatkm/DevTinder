const  express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/useTemp");
const {validateSignup} = require("./helper/validate");
const bcrypt = require("bcrypt");
app.use(express.json());

app.post("/signup",async(req,res)=>{
    try{
    //validate  data 
    
    validateSignup(req);

    //encrypt the password
    
    const {firstName,lastName,email,age,gender,password} = req.body;
    const encryptedPassword = await bcrypt.hash(password,10);
    //creating a new instance of the user model
    const user = new User({
        firstName,
        lastName,
        email,
        age,gender,
        password:encryptedPassword
    });
    
        await user.save();
        res.send("user signup successfull");
    }catch(err){
        console.log(err)
        res.status(400).send("ERROR : ", err.message);
    }
});

//login api
app.post("/login",async(req,res)=>{
    try{

       const {email,password} = req.body;
       const user = await User.findOne({email:email}) ;
       if(!user?.email){
        throw new Error("Invalid credential");
       }
       const isPasswordCorrect = bcrypt.compare(password,user.password);
       if(!isPasswordCorrect){
        throw new Error("Invalid credentials")
       }
       if(isPasswordCorrect && email===user.email){
        res.send("user loggined successfully");
       }
    }catch(err){
        console.log(err)
        res.status(400).send("ERROR : " + err.message);
    }

})
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

