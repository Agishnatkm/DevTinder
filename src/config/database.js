const mongoose = require("mongoose");

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://agishnatkm_db_user:X5Ed22f8VDYrJ302@namasteagi.our5gzn.mongodb.net/devTinder");

};
module.exports=connectDB;
    