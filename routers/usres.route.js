const express=require('express');

const usercontroller=require('../Controllers/user.controller');
const verifyToken = require('../middleWare/verifyToken');
const userRoles = require('../utils/userRoles');
const allowedTo = require('../utils/allowedTo');
const router= express.Router();

const multer  = require('multer')

const diskstorage = multer.diskStorage({
    // destination مكان تخزين الصور
    destination: function (req, file, cb) {
        // console.log(file,"file");
      cb(null, 'uploads')
    },
    
    filename: function (req, file, cb) {
      const  ext= file.mimetype.split('/')[1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+'.'+ext;
        cb(null, file.fieldname + '-' + uniqueSuffix)
      }
})
const fileFilter=(req,file,cb)=>{
    const  imageType= file.mimetype.split('/')[0];
    if(imageType ==='image'){
        cb(null, true)  
    }else{
        error=new Error('the file must be an image');
        return cb(error,false)
    }
}

const upload = multer({ storage: diskstorage,fileFilter })

router.route('/login')
    .post(usercontroller.login)

router.route('/')
    .get(verifyToken,usercontroller.getallUsers)


router.route('/register')
    .post(upload.single('avatar'),usercontroller.AddUser)

router.route('/:userId')
    .patch(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANGER),usercontroller.getUpdateUser)
    .get(verifyToken,usercontroller.getUserbyid)
    .delete(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANGER),usercontroller.getDeleteUser)


module.exports=router;