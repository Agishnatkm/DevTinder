const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const {validateSignup} = require("../helper/validate");

const User = require("../models/useTemp");
// authRouter.use(authRouter)
authRouter.post("/signup",async(req,res)=>{
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

//login
authRouter.post("/login",async(req,res)=>{
    try{

       const {email,password} = req.body;
       const user = await User.findOne({email:email}) ;
       if(!user?.email){
        throw new Error("Invalid credential");
       }
       const isPasswordValid = await user.validatePassword(password);
       if(isPasswordValid){
        const token = await user.getJWT();
        res.cookie("token",token)
         res.send("user loggined successfully");
       }else{
        throw new Error("Invalid credentials")
       }
       
      
    }catch(err){
        console.log(err)
        res.status(400).send("ERROR : " + err.message);
    }

});

authRouter.post("/logout",async(req,res)=>{
    res.clearCookie("token");
    res.send("Loggedout successfully");
});

module.exports = authRouter;