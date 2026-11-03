const express = require("express");
const profileRouter = express.Router();
const  {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../helper/validate");

profileRouter.get("/profile",userAuth, async (req, res) => {
    try {
       const user = req.user;
       
        res.send(user);

    } catch (err) {
        res.status(401).send("ERROR: " + err.message);
    }
});
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
        const user = await validateEditProfileData(req);      
        if(!user){
            res.send("user not found");
        }
        res.send("user updated");
    }catch(err){
        console.log(err.message)
    }
 });
 profileRouter.patch("/updatePassword",userAuth,async(req,res)=>{
    
 });
module.exports = profileRouter;