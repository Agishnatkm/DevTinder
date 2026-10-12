const adminAuth = (req,res,next)=>{
    console.log("admin Auth triggered");
    const token="xyz";
    const isAdminAuthenticated = token === "xyz";
    if(!isAdminAuthenticated){
        req.send("Authentication Error");
    }else{
        next();
    }
}
module.exports={
    adminAuth
};

