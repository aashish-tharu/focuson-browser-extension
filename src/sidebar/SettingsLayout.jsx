import React, { useState } from 'react';
import Sidebar from './Sidebar';

// Import your panels
import ProfileSettings from './panels/ProfileSettings';
import Summary from './panels/Summary';
import AppearanceSettings from './panels/AppearanceSettings';
import AboutSettings from './panels/PrivacySettings';
import NotificationsSettings from './panels/NotificationsSettings';

// Styles for the layout
import style from './SettingsLayout.module.css';

const SettingsLayout = () => {
  // 1. State to track the current view
  const [activeTab, setActiveTab] = useState('profiles');

  // 2. The Configuration: Map IDs to Components
  // This makes adding new pages very easy in the future.
  const PANELS = {
    profiles: <ProfileSettings />,
    summary:  <Summary />,
    appearance: <AppearanceSettings />,
    notification: <NotificationsSettings />,
    about:    <AboutSettings />

  };

  return (
    <div className={style.layoutContainer}>
      
      {/* Left Panel: Pass the function to change state */}
      <div className={style.leftPanel}>
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={(id) => setActiveTab(id)} 
        />
      </div>

      {/* Right Panel: Dynamic Rendering */}
      <div className={style.rightPanel}>
        {/* We look up the component in our object. If not found, show a default. */}
        {PANELS[activeTab] || <div>Page not found</div>}
      </div>

    </div>
  );
};

export default SettingsLayout;