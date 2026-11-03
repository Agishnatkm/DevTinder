const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
        maxlength:50,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address " + value +" !!");
            }
        },
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
    },
    skills:{
        type:Array,
    },
    photoUrl:{
        type:String,
    },
    about:{
        type:String,
        maxlength:100,
    },
    password:{
        type:String,
        required:true,
        minLength:6,
    }
},{
    timeStamps:true
});

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id},"DEv@tinder#1996",{expiresIn:"1d"});
    return token;
};
userSchema.methods.validatePassword = async function(inputPassword) {
 const user = this;
 const userPassword = user.password;
 const ispasswordValid = await bcrypt.compare(inputPassword,userPassword);
 return ispasswordValid;
};

module.exports = mongoose.model("user",userSchema);