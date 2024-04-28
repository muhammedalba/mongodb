const Users = require("../models/users.model");
const GenerateJwt = require("../utils/Generate.Jwt");
const asyncWrapper = require("../middleWare/asyncWrapper");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');



// get users
const getallUsers = async (req, res) => {
    // http://localhost:4000/api/users  ?limit=2&page=1
    // limit=2&page=1 => query
    const query = req.query;

    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const users = await Users.find({}, { '__v': false }).limit(limit).skip(skip);
  
    res.json({ status: "success", data: { users } });
  };

//AddUser register
  const AddUser =asyncWrapper( async(req, res,next) => {

    const{firstname,lastname,email,password ,role}=req.body;

    const olduser=await Users.findOne({email:email});
    if (olduser) {
      error=new Error('the email is kulanir');
     return next(error); 
    }
    // password hashing
    const hashedoassword =await bcrypt.hash(password,10);
 
    
    const newuser = new Users(
      {
        firstname,
        lastname,
        email,
        password: hashedoassword,
        role,
        avatar:req.file.filename,
      }
    );

    // generate jwt token
    const token = await GenerateJwt({email: newuser.email , id: newuser._id , role:newuser.role})
          newuser.token=token;
  
   await newuser.save();
    res.status(201).json({status:'success',data:newuser});
  });

// getUserbyid
  const getUserbyid =asyncWrapper( 
    async (req, res,next) => {
    // try {
      const user = await Users.findById(req.params.userId);
      if (!user) {
        const error = new Error()
        error.message='not found';
        error.statusCode=404;
        return next(error);
        // return res.status(404).json({ msg: "not found" });
      }
      return res.json({ status: "success", data: { user } });
    // } catch (err) {
    //   return res.status(500).json({ msg: "server in ..." });
    // }
  });

// login
const login = asyncWrapper(async(req,res,next)=>{
  const{email,password}=req.body;
  if (!email && !password) {
    const error = new Error()
    error.message='email our password is impty';
   
    return next(error);
    
  }
  const user=await Users.findOne({email:email})
if(!user){
  const error = new Error()
  error.message='user not found';
  return next(error);
}
const matchedPassword = await bcrypt.compare(password , user.password);
if(user && matchedPassword){
  const token =await GenerateJwt({email:user.email , id:user._id , role:user.role});
  res.json({status:'seccess',data:{token}})
}else{
  const error = new Error()
  error.message='password is stick';
  return next(error);
}

})
  // getUpdateUser
  const getUpdateUser =asyncWrapper (async (req, res) => {
  
    // const updateduser= await Users.findByIdAndUpdate(req.params.userId,{$set:{...req.body}}) ;
    const updateduser = await Users.updateOne(
      { _id: req.params.userId },
      { $set: { ...req.body } }
    );
    return res.json(updateduser);

  //  catch (err) {
  //   return res.status(500).json({ msg: "server in ...", err });
  // }
});

// getDeleteUser
  const getDeleteUser =async (req, res) => {
    try {
        await Users.deleteOne({ _id: req.params.userId });
        return res.json({ status: "success", data: null });
    } catch (err) {
        return res
            .status(500)
            .json({ status: "error", data: null, mesage: err.mesage, code: 400 });
    }
  };


module.exports={
  getDeleteUser,
  getUpdateUser,
  getUserbyid,
  AddUser,
  getallUsers,
  login
}