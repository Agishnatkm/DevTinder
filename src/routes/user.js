const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/user/requests/pending",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested",
        }).populate("fromUserId",["firstName","lastName","age","gender"]);

        if(connectionRequests.length <= 0){
            return res.status(404).json({
                message:"woohaa there is no pending requests!!"
            })
        }else{
            return res.status(200).json({
                message:"pending request fetched successfully",
                data:connectionRequests
            });
        }
    }catch(err){
        return res.status(404).json({
            message:"ERROR : " + err.message
        });
    }
});

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id,status:"accepted"},
                {toUserId:loggedInUser._id,status:"accepted"},
            ]
        }).populate("fromUserId",["firstName","lastName","age","gender"])
          .populate("toUserId",["firstName","lastName","age","gender"])
        
        if(connections.length <= 0){
            return res.status(404).json({
                message:"sorry, you dont have any connections.."
            })
        }else{
            const data = connections.map((row)=>{
                if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                    return row.toUserId
                }
            }          
                );

            return res.status(200).json({
                message:"connection fetched successfully",
                data:data
            });
        }
    }catch(err){
        return res.status(404).json({
            message:"ERROR : " + err.message
        });
    }
});

module.exports = userRouter;