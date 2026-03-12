import React, { useState } from 'react';
import Sidebar from './Sidebar';

import ProfileSettings from './panels/profiles/ProfileSettings';
import DashBoard from './panels/FocusOnDashboard/FocusOnDashboard';
import AppearanceSettings from './panels/AppearanceSettings';
import AboutSettings from './panels/PrivacySettings';
import NotificationsSettings from './panels/NotificationsSettings';

import style from './SettingsLayout.module.css';

const SettingsLayout = () => {
  const [activeTab, setActiveTab] = useState('profiles');

  const PANELS = {
    profiles: <ProfileSettings />,
    DashBoard:  <DashBoard />,
    appearance: <AppearanceSettings />,
    notification: <NotificationsSettings />,
    about:    <AboutSettings />

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