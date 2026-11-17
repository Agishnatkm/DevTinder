const express = require("express");
const profileRouter = express.Router();
const  {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../helper/validate");

profileRouter.get("/profile",userAuth, async (req, res) => {
    try {
       const user = req.user;
        return res.status(200).json({
            message:"Profile fetched successfully",
            data:user
        })

    } catch (err) {
        return res.status(401).json("ERROR: " + err.message);
    }
});

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
        const user = await validateEditProfileData(req);      
        if(!user){
            return res.status(401).json("user not found");
        }
        return res.status(200).json({
            message:"user updated",
            data:user
        });
    }catch(err){
        console.log(err.message)
    }
 });

 profileRouter.patch("/updatePassword",userAuth,async(req,res)=>{
    
 });
module.exports = profileRouter;