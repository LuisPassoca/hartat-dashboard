import { useEffect, useState } from "react"
import MovieRow from "./MovieRow"

import './css/MovieList.css'

function MovieList({ page, setTotalPages, search }) {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [forceReload, setForceReload] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)

            const res = await fetch(`/api/movies?search=${search}&page=${page}&limit=30`)

            if (!res.ok) {
                alert("Erro ao carregar filmes! Por favor tente novamente.")
                setLoading(false)
                return
            }

            const data = await res.json()
            setMovies(data.movies)
            setTotalPages(data.pages)
            setLoading(false)
        }

        fetchData()
    }, [page, search, forceReload])

    if (loading) {
        return <p> Carregando... </p>
    }

    if (movies.length == 0) {
       return <p> Nenhum filme encontrado. </p> 
    }

    return(
        <div className="movie-list">
            {
                movies.map(m => (
                    <MovieRow movie={m} key={m.id} setForceReload={setForceReload} />
                ))
            }
        </div>
    )
}

export default MovieList