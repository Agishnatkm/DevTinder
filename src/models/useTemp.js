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
        maxlength:50,
        lowercase:true,
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
    },
    password:{
        type:String,
        required:true,
        minLength:6,
    }
},{
    timeStamps:true
});

module.exports = mongoose.model("user",userSchema);