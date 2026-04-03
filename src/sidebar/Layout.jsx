import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import style from './SettingsLayout.module.css';

function Layout() {
  return (
    <div className={style.layoutContainer} style = {{gap: 0}}>
      <div className={style.leftPanel}>
        <Sidebar />
      </div>
      <div className={style.rightPanel}>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout