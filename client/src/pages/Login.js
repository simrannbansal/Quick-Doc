import React from 'react'
import { Form ,Input,Button} from "antd";
import {Link,useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading} from "../redux/alertsSlice";
function Login() {
    const dispatch= useDispatch();
    const navigate=useNavigate();
    const onFinish= async(values)=>{
        
      try {
        
            dispatch(showLoading());
            const response = await axios.post("/api/user/login", values);
            dispatch(hideLoading());
            if (response.data.success)
            {
              toast.success(response.data.message);
              localStorage.setItem("token",response.data.data);
              navigate("/");

            } else {
              toast.error(response.data.message);
            }
          } catch (error) {
            dispatch(hideLoading())
            toast.error("Oops! Something went wrong");
          }
          
        };
  return (
    <div className='authentication'>
        <div className="authentication-form card p-3">
            <h1 className="card-title">"Welcome Back to QuickDocs!"</h1>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item label="Email" name="email">
                    <Input placeholder="Email"/>
                </Form.Item>
                <Form.Item label="Password" name="password">
                    <Input placeholder="Password" type="password"/>
                </Form.Item>
                <Button className="my-2 full-width-button" htmlType="submit">LOGIN</Button>
                <Link to="/Register" className="anchor mt-2">Don't have an account? Register</Link>        
            </Form>
        </div>
    </div>
  )
}

export default Login
