const jwt=require("jsonwebtoken");
const register=require("../model/schema");
const auth=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        const verify=jwt.verify(token,process.env.SECRET_KEY);
        const user=await register.findOne({_id:verify._id});
        req.token=token;
        req.user=user;
        console.log(user);
        next();
    }
    catch(err){
        res.status(500).send(err);
    }
};

module.exports=auth;