var jwt = require('jsonwebtoken');
module.exports= async(payload)=>{
    // generate jwt token
    const token = await jwt.sign({payload},
          process.env.Jwt_secret_key,{expiresIn:'5m'});
return token;
}