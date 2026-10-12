const  express = require("express");
const {adminAuth} = require("./middlewares/auth");
const app = express();

app.use("/admin",adminAuth);


app.get("/admin",
    (req,res,next)=>{
        console.log("hello from  1 user");
        next()
    },
    (req,res,next)=>{
        res.send("hello from  2nd user");
        next()
    },
    (req,res,next)=>{
        res.send("hello from  3rd user");
    },
    (req,res,next)=>{
        res.send("hello from  4th user");
    },
);


app.listen(7777,() => {
    console.log("sever is lisening port 7777");
});