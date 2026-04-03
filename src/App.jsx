import Settingpage from "./sidebar/Sidebar.jsx";
import SettingsLayout from "./sidebar/SettingsLayout.jsx";
import { BrowserRouter } from 'react-router-dom';

function App() {

  return (
    <>
      <BrowserRouter>
        <SettingsLayout />
      </BrowserRouter>
    </>
  )
}

export default App
