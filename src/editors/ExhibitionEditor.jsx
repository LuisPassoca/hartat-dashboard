import { useNavigate, useParams } from "react-router-dom"

import './css/ExhibitionEditor.css'
import { useEffect, useState } from "react"
import ImageManager from "../components/ImageManager"

function ExhibitionEditor() {
    const { id } = useParams()
    const editMode = id ? true : false
    const [loadedData, setLoadedData] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch(`/api/exhibitions/${id}`)
                const { data } = await res.json()

                setLoadedData(data)

                setCover({
                    name: data.cover_name,
                    extension: data.cover_extension,
                    uuid: data.cover_uuid,
                    url: `/api/images/${data.cover_uuid}`
                })

                setGallery(data.gallery.map(g => ({ uuid: g.image_uuid })))
            } catch(err) {
                console.log(err)
                alert('Não foi possível encontrar a exposição!')
                navigate('/')
            }
        }

        if (editMode) { loadData() }
    }, [])

    const [cover, setCover] = useState(null)
    const [gallery, setGallery] = useState([])

    const [showModal, setShowModal] = useState(false)
    const [pickTarget, setPickTarget] = useState('')
    const [allowSelection, setAllowSelection] = useState(false)
    
    const handleCover = () => {
        setPickTarget('cover')
        setAllowSelection(false)
        setShowModal(true)
    }

    const handleGallery = () => {
        setPickTarget('gallery')
        setAllowSelection(true)
        setShowModal(true)
    }

    const handlePick = (images) => {
        if (pickTarget == 'cover') { setCover(images[0]) }
        if (pickTarget == 'gallery') { setGallery(images) }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = Object.fromEntries(new FormData(e.currentTarget))

        if (
            !formData.title.trim() ||
            !formData.description.trim() ||
            !cover
        ) {
            alert('Por favor, preencha todos os campos obrigatórios.')
            return
        }

        const data = {...formData, cover: cover.uuid, gallery: gallery.map(i => i.uuid)}
        const res = await fetch(`/api/exhibitions${editMode ? `/${id}` : ''}`, {
            method: editMode ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!res.ok) {
            alert('Ocorreu um erro! Por favor, tente novamente mais tarde.')
            return
        }

        alert('Exposição salva com sucesso!')
        navigate('/')
    }

    return(
        <div className="exhibition-editor">
            <h1> {editMode ? 'Editar Exposição' : 'Adicionar Exposição'} </h1>

            <div className="cover-info-wrapper">
                <div className="cover-wrapper">
                    <h2> Capa*: </h2>

                    {cover && <img className='cover-image' src={cover.url} />}

                    <div className="cover-options">
                        {!cover && <button onClick={handleCover}> Selecionar Capa </button>}
                        {cover && <button onClick={() => setCover(null)}> Remover </button>}
                        <p> {cover?.name + cover?.extension || 'Nenhuma imagem selecionada.'} </p>
                    </div>
                </div>
                <form className="exhibition-form" onSubmit={handleSubmit}>
                    <h2> Informações*: </h2>

                    <label> Título: <input name="title" defaultValue={loadedData.title} /> </label>
                    <label> Descrição: <textarea name="description" defaultValue={loadedData.description} /> </label>

                    <button> Salvar </button>
                </form>
            </div>

            <div className="gallery-wrapper">
                <h2> Galeria (opcional): </h2>

                <div className="gallery-images">
                    { gallery.map(i => <img key={i.uuid} src={`/api/images/${i.uuid}?preview`} />) }
                </div>
                
                <button onClick={handleGallery}> Selecionar Imagens </button>
            </div>

            {showModal &&
                <ImageManager 
                    modal
                    allowSelection={allowSelection}
                    closeModal={() => setShowModal(false)}
                    onPick={handlePick}
                />
            }

        </div>
    )
}

export default ExhibitionEditor