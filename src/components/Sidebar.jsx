import './Sidebar.css'

function Sidebar() {

    return(
        <>
            <h2> Hartat <br></br> Dashboard </h2>

            <ul>
                <li> <a href='/editor'> <i class="fa-solid fa-file-lines"></i> Postagens </a> </li>
                <li> <a href='/images'> <i className="fa-solid fa-image"></i> Imagens </a></li>
            </ul>
        </>
    )
}

export default Sidebar