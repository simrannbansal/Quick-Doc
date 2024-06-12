const express= require("express");
const router= express.Router();
const User= require("../models/userModel");
const Doctor=require("../models/doctorModel");
const authmiddleware= require("../middlewares/authmiddleware");

router.get('/get-all-doctors',authmiddleware,async(req,res)=>{
    try{
        const doctors= await Doctor.find({});
        return res.status(200).send({message: "Doctors Fetched Successfully", success:true, data:doctors});
    }catch(error){
        console.log(error);
        res.status(500).send({message: "Error fetching Doctors", success:false,error});
    }
});
router.get('/get-all-users',authmiddleware,async(req,res)=>{
    try{
        const users= await User.find({});
        return res.status(200).send({message: "Users Fetched Successfully", success:true, data:users});
    }catch(error){
        console.log(error);
        res.status(500).send({message: "Error fetching Users", success:false,error});
    }
});
router.post('/change-doctor-account-status',authmiddleware,async(req,res)=>{
    try{
        const {doctorId, status, userId}= req.body;
        const doctor= await Doctor.findByIdAndUpdate(doctorId,{status});
        const user= await User.findOne({_id: doctor.userId});
        const unseenNotifications=user.unseenNotifications
        unseenNotifications.push({
            type: "new-doctor-request-changed",
            message: `Your doctor account has been ${status}`,
            onClickPath: "/notifications",
        })
        user.isDoctor= status==="approved"? true: false;
        await user.save();
        res.status(200).send({message:"Doctor status Updated successfully", success:true, data:doctor})
    }catch(error){
        console.log(error);
        res.status(500).send({message: "Error Updating Status", success:false,error});
    }
});
module.exports= router;