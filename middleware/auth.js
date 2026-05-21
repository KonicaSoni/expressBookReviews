const jwt=require("jsonwebtoken");

const verifyToken=(req,res,next)=>{

const token=req.headers.authorization;

if(!token){

return res.status(401).json({
message:"Token missing"
});

}

try{

const decoded=jwt.verify(token,"access");

req.user=decoded;

next();

}

catch(error){

res.status(403).json({
message:"Invalid token"
});

}

};

module.exports=verifyToken;