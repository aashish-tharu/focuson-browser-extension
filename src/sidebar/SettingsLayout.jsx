import { Link, Routes, Route } from'react-router-dom';
import Layout from './Layout'
import ProfileSettings from './panels/profiles/ProfileSettings';
import DashBoard from './panels/FocusOnDashboard/FocusOnDashboard';
import FocusProfile from './panels/FocusProfile/FocusProfile';
import Accessibility from './panels/Accessibility/Accessibility'
import NotificationsSettings from './panels/Notification/NotificationsSettings';
import About from './panels/About/About';
import style from './SettingsLayout.module.css';

const SettingsLayout = () => {

  return (
    <div className={style.layoutContainer}>
<Routes>
  <Route path="/" element={<Layout />}>
    <Route path="profile" element={<ProfileSettings />} />
    <Route path="dashboard" element={<DashBoard />} />
    <Route path="focusprofile" element={<FocusProfile />} />
    <Route path="accessibility" element={<Accessibility />} />
    <Route path="notification" element={<NotificationsSettings />} />
    <Route path="about" element={<About />} />
  </Route>
</Routes>


    </div>
  );
};

export default SettingsLayout;