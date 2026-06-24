import { useState } from 'react'
import './css/Sidebar.css'
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
                    <NavLink to='/' className={({isActive}) => isActive ? 'selected' : ''}>
                        <i className="fa-solid fa-file-lines" /> 
                        Meu Site
                    </NavLink>
                </li>

                <li> 
                    <NavLink to='/editor' className={({isActive}) => isActive ? 'selected' : ''}>
                        <i className="fa-solid fa-edit" /> 
                        Criar Conteúdo
                    </NavLink>
                </li>
                
                <li> 
                    <NavLink to='/images' className={({isActive}) => isActive ? 'selected' : ''}>
                        <i className="fa-solid fa-image" /> 
                        Minhas Imagens 
                    </NavLink>
                </li>
            </ul>
        </>
    )
}

export default Sidebar