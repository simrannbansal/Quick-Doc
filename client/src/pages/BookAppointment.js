import React, { useEffect, useState }from 'react';
import Layout from '../components/Layout';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { showLoading, hideLoading} from "../redux/alertsSlice";
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { Button, Col, DatePicker, Row, TimePicker } from 'antd';
function BookAppointment() {
    const [isAvailable,setIsAvailable] =useState(false);
    const[date,setDate]= useState();
    const [time,setTime] =useState();
    const {user} = useSelector(state=> state.user);
    const params= useParams();
    const [doctor,setDoctor]=useState(null);
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const getDoctorData=async()=>{
        try{
          dispatch(showLoading());
          const response = await axios.post('/api/doctor/get-doctor-info-by-doctor-id',{doctorId: params.doctorId,},{
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },});
            dispatch(hideLoading());
            if(response.data.success){
              setDoctor(response.data.data);
            }
        } catch(error){
          dispatch(hideLoading());
        }
      }
      const bookNow=async()=>{
        try{
          setIsAvailable(false);
          dispatch(showLoading());
          const response = await axios.post('/api/user/book-appointment',{
            doctorId: params.doctorId,
            doctorInfo: doctor,
            userId: user._id,
            userInfo: user,
            date: date,
            time: time,
        },{
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },});
            dispatch(hideLoading());
            if(response.data.success){
              toast.success(response.data.message);
              navigate('/appointments');
            }
        } catch(error){
            toast.error('Error Booking Appointments');
          dispatch(hideLoading());
        }
      }
      const checkAvailability=async()=>{
        try{
          dispatch(showLoading());
          const response = await axios.post('/api/user/check-booking-availability',{
            doctorId: params.doctorId,
            date: date,
            time: time,
        },{
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },});
            dispatch(hideLoading());
            if(response.data.success){
              toast.success(response.data.message);
              setIsAvailable(true);
            } else{
              toast.error(response.data.message);
            }
        } catch(error){
            toast.error('Error Booking Slot For Appointment');
          dispatch(hideLoading());
        }
      }
      useEffect(()=>{
        getDoctorData();
      },[])
      const disabledHours = () => {
        if (!doctor) return [];
        const startHour = dayjs(doctor.timings[0], 'HH:mm').hour();
        const endHour = dayjs(doctor.timings[1], 'HH:mm').hour();
        const hours = [];
        for (let i = 0; i < 24; i++) {
          if (i < startHour || i > endHour) {
            hours.push(i);
          }
        }
        return hours;
      };
    
      const disabledMinutes = (selectedHour) => {
        if (!doctor) return [];
        const startHour = dayjs(doctor.timings[0], 'HH:mm').hour();
        const endHour = dayjs(doctor.timings[1], 'HH:mm').hour();
        const startMinute = dayjs(doctor.timings[0], 'HH:mm').minute();
        const endMinute = dayjs(doctor.timings[1], 'HH:mm').minute();
    
        if (selectedHour === startHour) {
          return Array.from({ length: startMinute }, (_, i) => i);
        }
        if (selectedHour === endHour) {
          return Array.from({ length: 60 - endMinute - 1 }, (_, i) => i + endMinute + 1);
        }
        return [];
      };
        return (
          
          <Layout>
              {doctor && (
                <div>
                <h1 className='page-title'>{doctor.firstName} {doctor.lastName}</h1>
                <hr/>
                <Row gutter={20} className='mt-5' align='middle'>
                  <Col span={8} sm={24} xs={24} lg={8}>
                  <img src='https://img.freepik.com/premium-vector/book-doctor-appointment-card-template_151150-11155.jpg' alt="" width="100%" height='400'/>
                  </Col>
                    <Col span={8} sm={24} xs={24} lg={8}>
                    <h1 className='normal-text'><b>Timings: </b>{doctor.timings[0]}-{doctor.timings[1]}</h1>
                    <div className='d-flex flex-column pt-2'>
                    <DatePicker format='DD:MM:YYYY' onChange={(value)=>{setDate(dayjs(value).format('DD-MM-YYYY')); setIsAvailable(false); }}/>
                    <TimePicker classname='mt-3' format='HH:mm' disabledHours={disabledHours}
                  disabledMinutes={disabledMinutes} onChange={(value)=>{setIsAvailable(false); setTime(dayjs(value).format('HH:mm'));}}/>
                    {!isAvailable && <Button className='full-width-button mt-3' onClick={checkAvailability}>Check Availability</Button>}
                    {isAvailable && (<Button className='full-width-button mt-3' onClick={bookNow}>Book Now</Button>)}
                    </div>
                    </Col>
                </Row>
                </div>
            )}
          </Layout>
  )
}

export default BookAppointment
