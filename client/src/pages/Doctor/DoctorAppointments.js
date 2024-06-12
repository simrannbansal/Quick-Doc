import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useDispatch } from 'react-redux';
import {showLoading,hideLoading} from '../../redux/alertsSlice'
import axios from 'axios'
import { Table } from 'antd';
import moment from 'moment';
import toast from 'react-hot-toast';

function DoctorAppointments() {
    const [appointments,setAppointments]=useState([])
    const dispatch= useDispatch();
    const getAppointmentsData=async()=>{
    try{
      dispatch(showLoading());
      const response = await axios.get('/api/doctor/get-appointments-by-doctor-id',{
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      dispatch(hideLoading());
      if(response.data.success){
        setAppointments(response.data.data);
      }
    } catch(error){
      dispatch(hideLoading());
    }
  }
  useEffect(()=>{
    getAppointmentsData()
   },[])
   const changeAppointmentStatus=async(record,status)=>{
    try{
      dispatch(showLoading());
      const response = await axios.post('/api/doctor/change-appointment-status',{appointmentId:record._id, status:status},{
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      dispatch(hideLoading());
      if(response.data.success){
        toast.success(response.data.message);
        getAppointmentsData();
      }
    } catch(error){
      toast.error('Error Changing Doctor Status');
      dispatch(hideLoading());
    }
  }
   const columns=[
    {
      title: 'Appointment Id',
      dataIndex: '_id', 
    },
    {
      title: 'Patient',
      dataIndex: 'name',
      render: (text,record)=>(
        <span className='normal-text'>{record.userInfo.name}</span>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'createdAt',
      render: (text,record)=>(
        <span className='normal-text'>{moment(record.date).format('DD-MM-YYYY')} {moment(record.time).format('HH:mm')}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
        render: (text,record)=>(
          <div className='d-flex'>
            {record.status==="pending" && <div className='d-flex'><h1 className='anchor px-2' onClick={()=>changeAppointmentStatus(record,'approved')}>Approve/</h1> 
            <h1 className='anchor' onClick={()=>changeAppointmentStatus(record,'rejected')}>Rejected</h1></div>}
          </div>
        ),
      },
   ];
  return (
    <Layout>
      <h1 className='page-title'>Appointments</h1>
      <hr/>
      <Table columns={columns} dataSource={appointments}/>
    </Layout>    
  )
}

export default DoctorAppointments
