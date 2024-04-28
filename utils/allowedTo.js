module.exports=(...roles)=>{
    console.log(roles);

    return (req, res ,next)=>{
        console.log(req.CurrentUser.payload.role,"reg");

        if(!roles.includes(req.CurrentUser.payload.role)){
            const error = new Error()
            error.message='this role is not authrized';
            return next(error);
        }
        return next();
    }
   
}