import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useDispatch } from 'react-redux';
import {showLoading,hideLoading} from '../redux/alertsSlice'
import axios from 'axios'
import { Table } from 'antd';
import moment from 'moment';
function Appointments() {
    const [appointments,setAppointments]=useState([])
    const dispatch= useDispatch();
    const getAppointmentsData=async()=>{
    try{
      dispatch(showLoading());
      const response = await axios.get('/api/user/get-appointments-by-user-id',{
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
   const columns=[
    {
      title: 'Appointment Id',
      dataIndex: '_id', 
    },
    {
      title: 'Doctor',
      dataIndex: 'name',
      render: (text,record)=>(
        <span className='normal-text'>{record.doctorInfo.firstName} {record.doctorInfo.lastName}</span>
      ),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      render: (text,record)=>(
        <span className='normal-text'>{record.doctorInfo.phoneNumber} {record.lastName}</span>
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
   ];
  return (
    <Layout>
      <h1 className='page-title'>Appointments</h1>
      <hr/>
      <Table columns={columns} dataSource={appointments}/>
    </Layout>    
  )
}

export default Appointments
