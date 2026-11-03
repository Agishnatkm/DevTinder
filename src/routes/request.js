const express = require("express");
const requestRouter = express.Router();
const  {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/useTemp");


requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
try{
    const  fromUserId = req.user._id;
    const { toUserId, status } = req.params;

    const allowedStatus = ["ignore","interested"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({
                    message: "Invalid status"
                });
    }
    const toUser = await User.findById(toUserId);
    if(!toUser){
        return res.status(404).json({
                message: "User not found"
            });
    } 
   if (fromUserId.equals(toUserId)) {
     return res.status(404).json({
        message:"You can't send connection request to yourself!"
     });
    }
    const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
            { fromUserId, toUserId },
            {
                fromUserId: toUserId,
                toUserId: fromUserId
            }
        ]
    });
    if(existingConnectionRequest){
        return res.status(400).json({
                    message: "Connection request already exists!"
                });
    }

    const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
    });
    const data = await connectionRequest.save();
    if(data){
        return res.json({
            message : status + " a connection request",
            data: data

        })
    }
}catch(err){
    return res.status(400).json({
        message: "ERROR: " + err.message
    });
}

});
requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
        const {status,requestId} = req.params;
        const loggedInUser = req.user;
        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(404).json({
                message:"Invalid status",
            });
        }
        console.log("requestId:",requestId,"userId:",loggedInUser._id);

        const connectRequest = await ConnectionRequest.findOne({
            _id:requestId,
            status:"interested",
            toUserId:loggedInUser._id,
        });

        if(!connectRequest){
            return res.status(404).json({
                message:"connection request not found!!"
            });
        }else{
            connectRequest.status = status;
            const data = connectRequest.save();
            return res.status(404).json({
                message:"Request has been " + status,
                data:data,
            });
        }

    }catch(err){
        return res.status(404).json({
            message:"ERROR : " + err.message,
        });
    }
})

module.exports = requestRouter;