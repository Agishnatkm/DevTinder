const  express = require("express");
const app = express();
app.use("/hello",(req,res)=>{
res.send("hellooob api");
});
app.use((req,res)=>{
    res.send("hello from  first server");
});


app.listen(7777,() => {
    console.log("sever is lisening port 7777");
});