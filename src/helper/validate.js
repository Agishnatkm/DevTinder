

const validator = require("validator");
const User = require("../models/useTemp");

const validateSignup=(req) =>{
    const {firstName,lastName,email,password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Please enter strong password")
    }
}
const validateEditProfileData = async function(req){
    const loggedinUser = req.user;
    const data= req.body;
    const allowed_updates = ["age","gender","skills","photoUrl","about"];
    const isUpdateAllowed = Object.keys(data).every((k)=>allowed_updates.includes(k));
    if(!isUpdateAllowed){
        throw new Error("Update not allowed");
    }
    const user = await User.findByIdAndUpdate( loggedinUser, data,{
        runValidators:true,
    });
    return user;
}
module.exports = {
    validateSignup,
    validateEditProfileData
}