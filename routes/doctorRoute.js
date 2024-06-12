const express= require("express");
const router= express.Router();
const User= require("../models/userModel");
const Doctor=require("../models/doctorModel");
const authmiddleware= require("../middlewares/authmiddleware");
const Appointment = require("../models/appointmentModel");
router.post('/get-doctor-info-by-user-id',authmiddleware,async(req,res)=>{
    try{
        const doctor= await Doctor.findOne({userId: req.body.userId});
        return res.status(200).send({message: "Doctor Information Fetched Successfully", success:true,data: doctor});
    }catch(error){
        console.log(error);
        res.status(500).send({message: "Error Fetching Doctor Information", success:false,error});
    }
});
router.post('/update-doctor-profile',authmiddleware,async(req,res)=>{
    try{
        const doctor= await Doctor.findOneAndUpdate({userId: req.body.userId},req.body);
        return res.status(200).send({message: "Doctor Information Updated Successfully", success:true,data: doctor});
    }catch(error){
        console.log(error);
        res.status(500).send({message: "Error Updating Doctor Information", success:false,error});
    }
});
router.post('/get-doctor-info-by-doctor-id',authmiddleware,async(req,res)=>{
    try{
        const doctor= await Doctor.findOne({_id: req.body.doctorId});
        return res.status(200).send({message: "Doctor Information Fetched Successfully", success:true,data: doctor});
    }catch(error){
        console.log(error);
        res.status(500).send({message: "Error Fetching Doctor Information", success:false,error});
    }
});
router.get('/get-appointments-by-doctor-id',authmiddleware,async(req,res)=>{
    try{
        const doctor= await Doctor.findOne({userId: req.body.userId});
        const appointments= await Appointment.find({doctorId: doctor._id});
        res.status(200).send({message: "Appointments Fetched Successfully", success:true,data:appointments});
    }catch(error){
        console.log(error);
        res.status(500).send({message: "Error Fetching Appointments", success:false,error});
    }
});
router.post('/change-appointment-status',authmiddleware,async(req,res)=>{
    try{
        const {appointmentId, status}= req.body;
        const appointment= await Appointment.findByIdAndUpdate(appointmentId,{status});
        const user= await User.findOne({_id: appointment.userId});
        const unseenNotifications=user.unseenNotifications
        unseenNotifications.push({
            type: "appointment-status-changed",
            message: `Your Appointment Status has been ${status}`,
            onClickPath: "/appointments",
        })
        await user.save();
        res.status(200).send({message:"Appointment Status Updated successfully", success:true})
    }catch(error){
        console.log(error);
        res.status(500).send({message: "Error Updating Status of Appointment", success:false,error});
    }
});
module.exports= router;