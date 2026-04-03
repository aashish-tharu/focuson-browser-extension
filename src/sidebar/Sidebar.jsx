import React, { useState } from 'react';
import { useEffect } from 'react';
import style from './Sidebar.module.css';
import Profile from '../assets/user.png';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import { 
  IoGridOutline, 
  IoPersonOutline, 
  IoFilterOutline, 
  IoNotificationsOutline, 
  IoAccessibilityOutline, 
  IoExtensionPuzzleOutline,
} from "react-icons/io5";

const Sidebar = ({ activeTab, onTabChange }) => {
  
    const [username, setUsername] = useState('Guest');
    useEffect(()=>{
      if (typeof chrome !== "undefined" && chrome?.storage?.local) {
        chrome.storage.local.get('extenUserName', (result) =>{
          const name = result['extenUserName'] || 'Guest';
          setUsername(name);
        })
      }
    })


  const menuItems = [
    { id: 'profile', label: 'Profiles', icon: <IoPersonOutline /> },
    { id: 'DashBoard', label: 'Dashboard', icon: <IoGridOutline /> },
    { id: 'FocusProfile', label: 'Focus Profile', icon: <IoFilterOutline /> },
    { id: 'Accessibility', label: 'Accessibility', icon: <IoAccessibilityOutline /> },
    { id: 'notification', label: 'Notification', icon: <IoNotificationsOutline />},
    { id: 'about', label: 'About Extension', icon: <IoExtensionPuzzleOutline /> },
  ];

  return (
    <>
      <nav className={style.nav}>
        {menuItems.map((item) => (
          <NavLink 
            key={item.id}
            to={`/${item.id.toLowerCase()}`}
          className={({ isActive }) => 
          isActive ? `${style.menuItem} ${style.active}` : style.menuItem
        }
        >
        <span className={style.icon}>{item.icon}</span>
        {item.label}
        </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;