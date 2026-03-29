import React, { useState } from 'react';
import { useEffect } from 'react';
import style from './Sidebar.module.css';
import Profile from '../assets/user.png';

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
    { id: 'profiles', label: 'Profiles', icon: <IoPersonOutline /> },
    { id: 'DashBoard', label: 'Dashboard', icon: <IoGridOutline /> },
    { id: 'FocusProfile', label: 'Focus Profile', icon: <IoFilterOutline /> },
    { id: 'Accessibility', label: 'Accessibility', icon: <IoAccessibilityOutline /> },
    { id: 'notification', label: 'Notification', icon: <IoNotificationsOutline />},
    { id: 'extension', label: 'About Extension', icon: <IoExtensionPuzzleOutline /> },
  ];

  return (
    <div className={style.container}>
      <h1 className={style.title}>Menu</h1>

      <div className={style.profile_details}>
          <img src={Profile} alt="" className = {style.profile_icon}/>
          <h1>{username}</h1>
      </div>

      <ul className={style.menuList}>
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`${style.menuItem} ${activeTab === item.id ? style.active : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className={style.icon}>{item.icon}</span>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;