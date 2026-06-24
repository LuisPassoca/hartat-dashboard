import { useNavigate } from "react-router-dom"

function MovieRow({ movie, setForceReload }) {
    const navigate = useNavigate()

    const displayDescription = 
        movie.description.length > 100 ? 
        movie.description.slice(0, 100) + '...' : 
        movie.description

    const handleEdit = () => {
        navigate(`/editor/movies/${movie.id}`)
    }

    const handleDelete = async () => {
        const confirmed = confirm('Tem certeza que deseja deletar esse filme?')
        if (!confirmed) { return }

        const res = await fetch(`/api/movies/${movie.id}`, {
            method: 'DELETE'
        })

        if (!res.ok) {
            alert('Ocorreu um erro! Tente novamente mais tarde.')
            return
        }

        setForceReload(prev => prev + 1)
    }

    return(
        <div className="movie-container">
            
            <img className="movie-cover" src={`/api/images/${movie.cover_uuid}?preview`} />

            <div className="movie-info">
                <p>
                    <b> Título: </b> 
                    {movie.title}
                </p>

                <p> 
                    <b> Descrição: </b> 
                    {displayDescription} 
                </p>

                <p> 
                    <b> Gênero: </b> 
                    {movie.genre} 
                </p>

                <p> 
                    <b> Classificação: </b> 
                    {movie.age_rating} 
                </p>

                <div className="button-wrapper">
                    <button onClick={handleEdit}> <i className="fa-solid fa-pen-to-square" /> Editar </button>
                    <button onClick={handleDelete}> <i className="fa-solid fa-trash" /> Excluir </button>
                </div>
            </div>
        </div>
    )
}

export default MovieRow