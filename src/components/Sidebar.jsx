import './Sidebar.css'

function Sidebar() {

    return(
        <>
            <h2> Hartat <br></br> Dashboard </h2>

            <ul>
                <li> <a href='/editor'> Postagens </a> </li>
                <li> Eventos </li>
                <li> Acervo virtual </li>
                <li> Programação </li>
                <li> <a href='/images'> <i className="fa-solid fa-image"></i> Imagens </a></li>
            </ul>
        </>
    )
}

export default Sidebar