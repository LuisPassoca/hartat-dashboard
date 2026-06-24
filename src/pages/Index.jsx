import { useEffect, useState } from "react"
import Pagination from "../components/Pagination";
import MovieList from "../components/content/MovieList";

import './css/Index.css'

function Index() {
    const [contentType, setContentType] = useState(null);
    const [content, setContent] = useState(null)

    const [totalPages, setTotalPages] = useState(1)
    const [page, setPage] = useState(1)

    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState(search)

    useEffect(() => {
        const debounceTime = 500
        const t = setTimeout(() => {
            setDebouncedSearch(prev => {
                if (prev == search) { return prev }
                return search
            })
        }, debounceTime)

        return () => clearTimeout(t)
    }, [search])

    useEffect(() => {
        setPage(1)
    }, [debouncedSearch])

    function renderContent() {
        switch (contentType) {
            case 'movies':
                return (
                    <MovieList 
                        page={page}
                        setTotalPages={setTotalPages}
                        search={debouncedSearch}
                    />
                )

            default:
                return(
                    <p>Selecione um conteúdo.</p>
                )
        }
    }

    return(
        <div className="index-page">
            <h1> Meu Site </h1>
            
            <div className="top-row">
                <label className="content-selector">
                    Conteúdo:
                    <select onChange={(e) => {setContentType(e.target.value)}}>
                        <option value=""> - </option>
                        <option value='collection'> Acervo </option>
                        <option value='exhibits'> Exposições </option>
                        <option value='movies'> Filmes </option>
                        <option value='blog'> Blog </option>
                        <option value='schedule'> Programação </option>
                    </select>
                </label>

                <div className="search-bar">
                    <input placeholder="Buscar..." onChange={(e) => {setSearch(e.target.value)}} />
                    <i className="fa-solid fa-magnifying-glass" />
                </div>
            </div>
            
            <div className="list-content">
                {renderContent()}
            </div>

            <Pagination 
                page={page}
                totalPages={totalPages}
                onChange={(page) => setPage(page)}
            />

        </div>
    )
}

export default Index