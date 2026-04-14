import { Outlet, useSearchParams } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import './Dashboard.css'

function Dashboard() {
    return(
        <div className="layout">
            <aside className="sidebar">
                <Sidebar />
            </aside>

            <div className='content'>
                <Outlet />
            </div>
        </div>   
    )
}

export default Dashboard