var jwt = require('jsonwebtoken');


const verifyToken=async(req,res,next)=>{
    const authheader= req.headers['Authorization'] || req.headers['authorization'];
    
    if(!authheader){
        const error = new Error('token is required')
      
     
        return next(error);
  
    }else{   
        try{
            const token = authheader.split(' ')[1];
            const CurrentUser=jwt.verify(token, process.env.Jwt_secret_key);

            req.CurrentUser=CurrentUser;
            
            next()

  }catch(err){
    const error = new Error()
    error.message='invalid token';
   
    return next(error);

  }}
 
   
    
}
module.exports =verifyToken;