
const jwt = require("jsonwebtoken");
const User = require("../models/useTemp");

const userAuth = async (req, res, next) => {
    try {
        // Read token from cookies
        const { token } = req.cookies || {};

        if (!token) {
            return res.status(401).json({
                message: "Authentication token missing"
            });
        }

        const decodedObj = jwt.verify(
            token,
            "DEv@tinder#1996"
        );

        const { _id } = decodedObj;

        const user = await User.findById(_id);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = user;
        next();

    } catch (err) {
        return res.status(401).json({
            message: err.message || "Invalid token"
        });
    }
};

module.exports = {
    userAuth
};
