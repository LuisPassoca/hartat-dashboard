import { useState } from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'

function Sidebar(props) {
    return(
        <>
            <h2> 
                Hartat <br /> 
                Dashboard 
            </h2>

            <ul>
                <li> 
                    <NavLink to='/posts' className={({isActive}) => isActive && 'selected'}>
                        <i className="fa-solid fa-file-lines" /> 
                        Posts 
                    </NavLink>
                </li>

                <li> 
                    <NavLink to='/editor' className={({isActive}) => isActive && 'selected'}>
                        <i className="fa-solid fa-edit" /> 
                        Editor 
                    </NavLink>
                </li>
                
                <li> 
                    <NavLink to='/images' className={({isActive}) => isActive && 'selected'}>
                        <i className="fa-solid fa-image" /> 
                        Images 
                    </NavLink>
                </li>
            </ul>
        </>
    )
}

export default Sidebar