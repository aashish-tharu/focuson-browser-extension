import React, { useState } from 'react';
import Sidebar from './Sidebar';

import ProfileSettings from './panels/profiles/ProfileSettings';
import DashBoard from './panels/FocusOnDashboard/FocusOnDashboard';
import FocusProfile from './panels/FocusProfile/FocusProfile';
import Accessibility from './panels/Accessibility/Accessibility'
import About from './panels/About/About';
import NotificationsSettings from './panels/Notification/NotificationsSettings';

import style from './SettingsLayout.module.css';

const SettingsLayout = () => {
  const [activeTab, setActiveTab] = useState('profiles');

  const PANELS = {
    profiles: <ProfileSettings />,
    DashBoard:  <DashBoard />,
    FocusProfile: <FocusProfile />,
    Accessibility : <Accessibility />,
    notification: <NotificationsSettings />,
    extension:    <About />

  };

  return (
    <div className={style.layoutContainer}>
      
      <div className={style.leftPanel}>
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={(id) => setActiveTab(id)} 
        />
      </div>

      <div className={style.rightPanel}>
        {PANELS[activeTab] || <div>Page not found</div>}
      </div>

    </div>
  );
};

export default SettingsLayout;