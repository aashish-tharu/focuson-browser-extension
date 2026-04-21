import Settingpage from "./sidebar/Sidebar.jsx";
import SettingsLayout from "./sidebar/SettingsLayout.jsx";
import { BrowserRouter } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';

function App() {

  return (
    <>
      <HashRouter>
        <SettingsLayout />
      </HashRouter>
    </>
  )
}

export default App
