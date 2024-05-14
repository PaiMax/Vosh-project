const jwt=require('jsonwebtoken');
const User=require('../model/user');

const authentication=(req,res,next)=>{
    
    const token=req.body.token('Authorization');
    jwt.verify(token,config.auth.SECRET,{algorithm: "HS256", ignoreExpiration: true,}, function (err, decoded) {
        if(err){
            res.send("Invalid authoriazation")
        }
        else{
            req.body.userId = decoded.userId;
            next();
        }
        
        
      });
    





}
module.exports={authentication};