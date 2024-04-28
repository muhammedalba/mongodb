// use mongoose
const mongoose = require("mongoose");
var cors = require('cors')
const express = require("express");
const app = express();
const userRouter=require('./routers/usres.route');
const path=require("path")
app.use(express.json());
app.use(cors());

app.use('/uploads',express.static(path.join(__dirname,'uploads')))
require("dotenv").config();
// تستخدم لجلب معلومات من ملف ال الذي خزنا بداخله رابط المونجو من اجل الحمايه اسم المكتبه dotenv
//اجعل ال  ا ب ي يعمل على اكثر من بورت عند طلبه من الفرونت ايند

const { 
  AddUser ,
  getallUsers,
  getUserbyid,
  getUpdateUser,
  getDeleteUser
} = require("./Controllers/user.controller");





const url = process.env.mongo_url;
// انشاء اتصال
const client = mongoose
  .connect(url)
  .then(() => {
    console.log("db is connect");
  })
  .catch((err) => console.log(err, "db not connected"));
  app.use('/api/users',userRouter)
// // get users

// app.get("/api/users", getallUsers);

// // add user
// app.post( AddUser);

// // getuser by id

// app.get("/api/users/:userId",getUserbyid);

// // update user
// app.put("/api/users/:userId", getUpdateUser );

// // delete
// app.delete("/api/users/:userId",getDeleteUser);

//  الراوتر التي غير موجودة في الابي اي ارجع ايروور ورساله
// app.all('*',(req,res)=>{
//     res.status(404).json({ status: "error",  mesage:"this resource is not availabe" })
// })
// globel error handel
app.use((err,req,res,next)=>{
    res.status(err.statusCode ||500).json({status:"erooooooor",mesage:err.message})
})









app.listen(process.env.port || 4000, () => {
    console.log("server started");
});
