const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const {validateSignup} = require("../helper/validate");

const User = require("../models/useTemp");
// authRouter.use(authRouter)
authRouter.post("/signup", async (req, res) => {
  try {
    console.log("inside signup be - ", req.body)
    // Validation of data
    validateSignup(req);

    const { firstName, lastName, email, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    //   Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    console.log(token);

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
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
         return res.json({
            message:"user loggined successfully",
            data:user,
        });
       }else{
        throw new Error("Invalid credentials")
       }
       
      
    }catch(err){
        return res.status(401).json("ERROR : " + err.message);
    }

});

authRouter.post("/logout",async(req,res)=>{
    res.clearCookie("token");
    res.send("Loggedout successfully");
});

module.exports = authRouter;