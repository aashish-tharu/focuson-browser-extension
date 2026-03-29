import React, { useState, useEffect } from 'react';
import './NotificationsSettings.css'; 

const NotificationsSettings = () => {
  const [isToggled, setIsToggled] = useState(true);

  useEffect(()=>{
    chrome.storage.local.get(["notificationToggle"],(result)=>{
      const savedState = result.notificationToggle !== undefined ? result.notificationToggle : true;
      setIsToggled(savedState);
    })
  }, []);

const handleToggle = () => {
  const newValue = !isToggled; 
  setIsToggled(newValue); 
  if (typeof window.chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.set({ notificationToggle: newValue }, () => {
      console.log("Notification setting updated to:", newValue);
    });
  }
};

  return (
    <div className="noti-container">
      <div className="noti-text">
        <h2 className="title">Notifications</h2>
        <p className="desc">Get daily summaries from the session module</p>
      </div>

      <label className="toggle-switch">
        <input 
          type="checkbox" 
          checked={isToggled} 
          onChange={handleToggle} 
        />
        <span className="slider"></span>
      </label>
    </div>
  );
};

export default NotificationsSettings;