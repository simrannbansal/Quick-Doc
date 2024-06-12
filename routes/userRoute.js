const express= require("express");
const router= express.Router();
const User= require("../models/userModel");
const Doctor=require("../models/doctorModel");
const bcrypt= require("bcryptjs");
const jwt= require("jsonwebtoken");
const authmiddleware= require("../middlewares/authmiddleware");
const Appointment = require("../models/appointmentModel");
const moment= require("moment");
router.post('/register',async(req,res)=>{
    try{
        const userExists= await User.findOne({email: req.body.email});
        if(userExists)
        {
            return res.status(200).send({message: "User already exists", success:false});
        }
        const password=req.body.password;
        const salt=await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt);
        req.body.password = hashedPassword;
        const newuser= new User(req.body);
        await newuser.save();
        res.status(200).send({message:"User created successfully", success:true});
    }catch(error){
        console.log(error);
        res.status(500).send({message:"Error creating user", success:false,error});
    }
});
router.post('/login',async(req,res)=>{
    try{
        const user= await User.findOne({email: req.body.email});
        if(!user)
        {
            return res.status(200).send({message: "User does not exists", success:false});
        }
        const isMatch= await bcrypt.compare(req.body.password, user.password);
        if(!isMatch)
        {
            return res.status(200).send({message: "Password is incorrect", success:false});
        }else{
            const token= jwt.sign({ id: user._id},process.env.JWT_SECRET,{expiresIn: "1d"})
            res.status(200).send({message: "User Logged In Successfully", success:true,data: token});
        }
    }catch(error){
        console.log(error);
        res.status(500).send({message: "Error Logging IN", success:false,error});
    }
});
router.post('/get-user-info-by-id',authmiddleware,async(req,res)=>{
    try{
        const user= await User.findOne({_id: req.body.userId});
        user.password= undefined;
        if(!user)
        {
            return res.status(200).send({message: "User does not exists", success:false});
        }
        else{
            res.status(200).send({message: "User Information Fetched Successfully", success:true,data:user});
        }
    }catch(error){
        console.log(error);
        res.status(500).send({message: "Error Fetching User Information", success:false,error});
    }
});
router.post('/apply-doctor-account',authmiddleware,async(req,res)=>{
    try{
        const newdoctor= new Doctor({...req.body, status: "pending"});
        await newdoctor.save();
        const adminUser = await User.findOne({isAdmin: true});
        const unseenNotifications=adminUser.unseenNotifications
        unseenNotifications.push({
            type: "new-doctor-request",
            message: `${newdoctor.firstName} ${newdoctor.lastName} has applied for a doctor account`,
            data:{
                doctor: newdoctor._id,
                name: newdoctor.firstName+" "+newdoctor.lastName
            },
            onClickPath: "/admin/doctorsList"
        })
        await User.findByIdAndUpdate(adminUser._id,{unseenNotifications});
        res.status(200).send({message:"Doctor account applied successfully", success:true})
    }catch(error){
        console.log(error);
        res.status(500).send({message:"Error applying doctor account", success:false,error});
    }
});
router.post('/mark-all-notifications-as-read',authmiddleware,async(req,res)=>{
    try{
        const user= await User.findOne({_id: req.body.userId});
        const unseenNotifications= user.unseenNotifications;
        const seenNotifications=user.seenNotifications;
        seenNotifications.push(...unseenNotifications);
        user.unseenNotifications=[];
        user.seenNotifications=seenNotifications;
        const updatedUser= await User.findByIdAndUpdate(user._id,user);
        updatedUser.password=undefined;
        res.status(200).send({message:"All notifications marked as read", data:updatedUser ,success:true})
    }catch(error){
        console.log(error);
        res.status(500).send({message:"Oops! something went wrong", success:false,error});
    }
});
router.post('/delete-all-notifications',authmiddleware,async(req,res)=>{
    try{
        const user= await User.findOne({_id: req.body.userId});
        user.unseenNotifications=[];
        user.seenNotifications=[];
        const updatedUser= await user.save();
        updatedUser.password=undefined;
        res.status(200).send({message:"All notifications deleted Successfully", data:updatedUser ,success:true})
    }catch(error){
        console.log(error);
        res.status(500).send({message:"Oops! something went wrong", success:false,error});
    }
});
router.get('/get-all-approved-doctors',authmiddleware,async(req,res)=>{
    try{
        const doctors= await Doctor.find({status: "approved"});
        return res.status(200).send({message: "Doctors Fetched Successfully", success:true, data:doctors});
    }catch(error){
        console.log(error);
        res.status(500).send({message: "Error fetching Doctors", success:false,error});
    }
});
router.post('/book-appointment',authmiddleware,async(req,res)=>{
    try{
        req.body.status="pending";
        req.body.date=moment(req.body.date, 'DD-MM-YYYY').toISOString();
        req.body.time=moment(req.body.time,'HH:mm').toISOString();
        const newAppointment=new Appointment(req.body)
        newAppointment.date=req.body.date;
        await newAppointment.save();
        const user= await User.findOne({_id: req.body.doctorInfo.userId});
        user.unseenNotifications.push({
            type:'new-appointment-request',
            message:`A new appointment has been made by ${req.body.userInfo.name}`,
            onClickPath: '/doctor/appointments'
        });
       await user.save();
       res.status(200).send({message: "Appointment Booked Successfully", success:true});
    }catch(error){
        console.log(error);
        res.status(500).send({message: "Error In Booking The Appointment ", success:false,error});
    }
});
router.post('/check-booking-availability',authmiddleware,async(req,res)=>{
    try{
        const date=moment(req.body.date, 'DD-MM-YYYY').toISOString();
        const fromTime=moment(req.body.time,'HH:mm').subtract(30,'minutes').toISOString();
        const toTime=moment(req.body.time,'HH:mm').add(30,'minutes').toISOString();
        const doctorId=req.body.doctorId;
        const appointments=await Appointment.find({doctorId,
            date,
            time: {$gte: fromTime, $lte: toTime},
        });
        if (appointments.length>0) {return res.status(200).send({message: "Appointment Slot Not Available", success:false});}
        else { res.status(200).send({message: "Appointment Slot Available", success:true});}
    }catch(error){
        console.log(error);
        res.status(500).send({message: "Error In Booking The Slot For Appointment ", success:false,error});
    }
});
router.get('/get-appointments-by-user-id',authmiddleware,async(req,res)=>{
    try{
        const appointments= await Appointment.find({userId: req.body.userId});
        res.status(200).send({message: "Appointments Fetched Successfully", success:true,data:appointments});
    }catch(error){
        console.log(error);
        res.status(500).send({message: "Error Fetching Appointments", success:false,error});
    }
});
module.exports= router;