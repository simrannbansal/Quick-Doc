import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from "./pages/Login";
import Register from "./pages/Register";
import {Toaster} from "react-hot-toast";
import Home from './pages/Home';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ApplyDoctor from './pages/ApplyDoctor';
import BookAppointment from './pages/BookAppointment';
import Notifications from './pages/Notifications';
import DoctorsList from './pages/Admin/DoctorsList';
import UsersList from './pages/Admin/UsersList';
import Profile from './pages/Doctor/Profile';
import Appointments from './pages/Appointments';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
function App() {
  const {loading} = useSelector(state=>state.alerts);
  return (
    <div>
      <BrowserRouter>
      {loading && (<div className="spinner-parent">
        <div class="spinner-border" role="status">
        </div>
      </div>)}
      <Toaster
      position="top-center"
      reverseOrder={false}
      />
      <Routes>
        <Route path="/login" element={<PublicRoute><Login/></PublicRoute>}/>
        <Route path="/Register" element={<PublicRoute><Register/></PublicRoute>}/>
        <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path="/apply-doctor" element={<ProtectedRoute><ApplyDoctor/></ProtectedRoute>}/>
        <Route path="/notifications" element={<ProtectedRoute><Notifications/></ProtectedRoute>}/>
        <Route path="/admin/usersList" element={<ProtectedRoute><UsersList/></ProtectedRoute>}/>
        <Route path="/admin/doctorsList" element={<ProtectedRoute><DoctorsList/></ProtectedRoute>}/>
        <Route path="/doctor/profile/:doctorId" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        <Route path="/book-appointment/:doctorId" element={<ProtectedRoute><BookAppointment/></ProtectedRoute>}/>
        <Route path="/appointments" element={<ProtectedRoute><Appointments/></ProtectedRoute>}/>
        <Route path="/doctor/appointments" element={<ProtectedRoute><DoctorAppointments/></ProtectedRoute>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
