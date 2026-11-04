const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/useTemp");

const user_safe_data = "firstName lastName age gender";

userRouter.get("/user/requests/pending", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", ["firstName", "lastName", "age", "gender"]);

        if (connectionRequests.length <= 0) {
            return res.status(404).json({
                message: "woohaa there is no pending requests!!"
            })
        } else {
            return res.status(200).json({
                message: "pending request fetched successfully",
                data: connectionRequests
            });
        }
    } catch (err) {
        return res.status(404).json({
            message: "ERROR : " + err.message
        });
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" },
            ]
        }).populate("fromUserId", user_safe_data)
            .populate("toUserId", user_safe_data)

        if (connections.length <= 0) {
            return res.status(404).json({
                message: "sorry, you dont have any connections.."
            })
        } else {
            const data = connections.map((row) => {
                if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                    return row.toUserId
                }
            }
            );

            return res.status(200).json({
                message: "connection fetched successfully",
                data: data
            });
        }
    } catch (err) {
        return res.status(404).json({
            message: "ERROR : " + err.message
        });
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 25 ? 25 : limit;
        const skip = (page - 1) * limit;
        const connectionsRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionsRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(user_safe_data)
            .skip(skip)
            .limit(limit);

        return res.json({
            message: "Feed fetched successfully",
            data: users
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message
        });
    }
});
module.exports = userRouter;