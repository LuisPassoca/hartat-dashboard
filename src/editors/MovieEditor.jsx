import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ImageManager from '../components/ImageManager'

import './css/MovieEditor.css'
function MovieEditor({ editMode }) {
    const { id } = useParams()
    const [loadedData, setLoadedData] = useState({})
    const navigate = useNavigate()

    //Handle loading data for editing
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/movies/${id}`)
                const { data } = await res.json()

                setLoadedData(data)

                setBanner({
                    name: data.banner_name,
                    extension: data.banner_extension,
                    uuid: data.banner_uuid,
                    url: `/api/images/${data.banner_uuid}`
                })

                setCover({
                    name: data.cover_name,
                    extension: data.cover_extension,
                    uuid: data.cover_uuid,
                    url: `/api/images/${data.cover_uuid}`
                })
            } catch (err) {
                console.log(err)
                alert('Não foi possível encontrar o filme!')
                navigate('/')
            }
        }

        if (editMode) { fetchData() }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = Object.fromEntries(new FormData(e.currentTarget))

        if (
            !formData.title.trim() ||
            !formData.description.trim() ||
            !formData.genre.trim() ||
            !banner ||
            !cover
        ) {
            alert("Por favor, preencha todos os campos!")
            return
        }
    
        const data = {...formData, banner: banner.uuid, cover: cover.uuid}
        const res = await fetch(`/api/movies${editMode ? `/${id}` : ''}`, {
            method: editMode ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!res.ok) {
            alert('Ocorreu um erro! Por favor, tente novamente mais tarde.')
            return
        }

        alert('Filme salvo com sucesso!')
        navigate('/')
    }

    const [pickTarget, setPickTarget] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [banner, setBanner] = useState(null)
    const [cover, setCover] = useState(null)

    const handleBanner = () => {
        setPickTarget('banner')
        setShowModal(true)
    }

    const handleCover = () => {
        setPickTarget('cover')
        setShowModal(true)
    }

    const handlePick = (images) => {
        if (pickTarget == 'banner') { setBanner(images[0]) }
        if (pickTarget == 'cover') { setCover(images[0]) }
    }

    return(
        <div className="movie-editor">
            <h1> { editMode ? 'Editar Filme' : 'Adicionar Filme' } </h1>

            <div className="banner-wrapper">
                <h2> Banner: </h2>

                {banner && <img className='banner-image' src={banner.url} />}

                <div className="banner-options">
                    {!banner && <button onClick={handleBanner}> Selecionar </button>}
                    {banner && <button onClick={() => setBanner(null)}> Remover </button>}
                    <p> {banner?.name + banner?.extension || 'Nenhuma imagem selecionada.'} </p>
                </div>
            </div>

            <div className="cover-info-wrapper">
                <div className="cover-wrapper">
                    <h2> Capa: </h2>

                    {cover && <img className='cover-image' src={cover.url} />}

                    <div className="cover-options">
                        {!cover && <button onClick={handleCover}> Selecionar </button>}
                        {cover && <button onClick={() => setCover(null)}> Remover </button>}
                        <p> {cover?.name + cover?.extension || 'Nenhuma imagem selecionada.'} </p>
                    </div>
                </div>
                
                <form className='movie-form' onSubmit={handleSubmit}>
                    <h2> Informações: </h2>

                    <label> 
                        Título: 
                        <input name="title" defaultValue={loadedData.title} /> 
                    </label>

                    <label> 
                        Descrição: 
                        <textarea name="description" defaultValue={loadedData.description} /> 
                    </label>

                    <label> 
                        Gênero: 
                        <input name="genre" defaultValue={loadedData.genre} /> 
                    </label>

                    <label>
                        Classificação:
                        <select name="rating" defaultValue={loadedData.age_rating}>
                            <option value="L"> L </option>
                            <option value="10"> 10 </option>
                            <option value="12"> 12 </option>
                            <option value="14"> 14 </option>
                            <option value="16"> 16 </option>
                            <option value="18"> 18 </option>
                        </select>
                    </label>

                    <button> Salvar </button>
                </form>
            </div>

            {showModal &&
                <ImageManager 
                    modal
                    onPick={handlePick}
                    closeModal={() => setShowModal(false)}
                />
            }

        </div>
    )
}

export default MovieEditor