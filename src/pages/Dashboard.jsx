import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import './Dashboard.css'

function Dashboard() {
    return(
        <div id="main-container">
            <Sidebar />

            <div id='page-container'>
                <Outlet />
            </div>
        </div>   
    )
}

export default Dashboard