const mongoose = require("mongoose");

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
        maxlength:25,
        lowercase:true,
    },
    age:{
        type:Number,
        required:true,
    },
    gender:{
        type:String
    }
},{
    timeStamps:true
});

module.exports = mongoose.model("user",userSchema);