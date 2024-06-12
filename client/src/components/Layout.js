import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import '../layout.css';
import { useDispatch, useSelector } from 'react-redux';
import { Badge } from 'antd';
import { setUser } from '../redux/userSlice';

function Layout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const userMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-5-line'
        },
        {
            name: 'Appointments',
            path: '/appointments',
            icon: 'ri-contract-line'
        },
        {
            name: 'Apply Doctor',
            path: '/apply-doctor',
            icon: 'ri-hospital-line'
        },
    ];

    const adminMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-5-line'
        },
        {
            name: "Users",
            path: "/admin/usersList",
            icon: 'ri-folder-user-line',
        },
        {
            name: "Doctors",
            path: "/admin/doctorsList",
            icon: 'ri-nurse-line',
        },
    ];

    const doctorMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-5-line'
        },
        {
            name: 'Appointments',
            path: '/doctor/appointments',
            icon: 'ri-contract-line'
        },
        {
            name: 'Profile',
            path: `/doctor/profile/${user?._id}`,
            icon: 'ri-shield-user-line',
        },
    ];

    const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;
    const role = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "User";

    return (
        <div className='main'>
            <div className="d-flex layout">
                <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                    <div className='sidebar-header'>
                        {!collapsed ? <h2 style={{ color: 'white' }}>Quick-Docs</h2> : <h1 style={{ color: 'white' }}>QD</h1>}
                        <h1 className='role'>{role}</h1>
                    </div>
                    <div className='menu'>
                        {menuToBeRendered.map((menu) => {
                            const isActive = location.pathname === menu.path;
                            return (
                                <Link to={menu.path} key={menu.name} className={`d-flex menu-item ${isActive ? 'active-menu-item' : 'passive-menu-item'}`}>
                                    <i className={menu.icon}></i>
                                    {!collapsed && <span>{menu.name}</span>}
                                </Link>
                            );
                        })}
                        <div className={`d-flex menu-item`} onClick={() => {
                            localStorage.removeItem("token");
                            dispatch(setUser(null));
                            navigate('/login');
                        }}>
                            <i className='ri-logout-box-r-line'></i>
                            {!collapsed && <span>Logout</span>}
                        </div>
                    </div>
                </div>
                <div className='content'>
                    <div className='header'>
                        {collapsed ? (
                            <i className="ri-sidebar-unfold-line header-action-icon" onClick={() => setCollapsed(false)}></i>
                        ) : (
                            <i className="ri-sidebar-fold-line header-action-icon" onClick={() => setCollapsed(true)}></i>
                        )}
                        <div className="d-flex align-items-center px-4">
                            <Badge count={user?.unseenNotifications.length} onClick={() => navigate('/notifications')}>
                                <i className="ri-notification-3-line header-action-icon px-3 mr-2"></i>
                            </Badge>
                            <div className="anchor mx-3"><b>{user?.name}</b></div>
                        </div>
                    </div>
                    <div className='body'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;
