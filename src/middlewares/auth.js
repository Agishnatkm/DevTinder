const cookies = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("../models/useTemp");
const adminAuth = (req,res,next)=>{
    console.log("admin Auth triggered");
    const token="xyz";
    const isAdminAuthenticated = token === "xyz";
    if(!isAdminAuthenticated){
        req.send("Authentication Error");
    }else{
        next();
    }
}

const userAuth = async (req,res,next)=>{
    try{
        //read token from the cookies
        const {token} = req.cookies;
        if(!token){
            throw new Error("Invalid tokken")
        }
        const decodedObj = await jwt.verify(token,"DEv@tinder#1996");
        console.log(decodedObj);
        const {_id} = decodedObj;
        const user = await User.findById(_id);
        req.user = user;
        if(!user){
            throw new Error("User not found");
        }else{
            next();
        }
        
    }catch(err){
        res.send("ERROR : "+ err.message,);
    }
    
}
module.exports={
    adminAuth, userAuth
};



