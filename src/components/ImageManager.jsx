import { useEffect, useRef, useState } from 'react'
import './ImageManager.css'

function ImageManager(props) {
    //Handle images
    const [page, setPage] = useState(1)
    const [images, setImages] = useState([])
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState(0)
    const [forceReload, setForceReload] = useState(0)
    const limit = 50

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500)

        return () => clearTimeout(timeout)
    }, [search])

    useEffect(() => {
        setPage(1)
    }, [debouncedSearch])

    useEffect(() => {
        const loadImages = async () => {
            const res = await fetch(
                `/api/images?search=${encodeURIComponent(debouncedSearch)}&page=${page}&limit=${limit}`,
                {method: 'GET'}
            )

            const data = await res.json()
            setImages(data.images)
            setTotalPages(data.pages)
        }

        loadImages()
    }, [page, debouncedSearch, forceReload])

    
    //Handle pagination
    const [totalPages, setTotalPages] = useState(1)

    const pagesPerGroup = 10
    const pageGroup = Math.floor((page - 1) / pagesPerGroup)

    const pageGroupStart = pageGroup * pagesPerGroup + 1
    const pageGroupEnd = pageGroupStart + pagesPerGroup - 1

    const pageNumbers = []
    for(let i = pageGroupStart; i <= pageGroupEnd; i++) {pageNumbers.push(i)}

    const handlePrevGroup = () => {setPage(Math.max((pageGroupStart - pagesPerGroup), 1))}
    const handleNextGroup = () => {setPage(Math.min((pageGroupStart + pagesPerGroup), totalPages))}

    const handlePrevPage = () => {setPage(Math.max((page - 1), 1))}
    const handleNextPage = () => {setPage(Math.min((page + 1), totalPages))}

    //Handle image uploads
    const [isUploading, setIsUploading] = useState(false)

    const handleUpload = async (files) => {
        setIsUploading(true)
        
        const invalidFiles = []
        const images = new FormData()

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                invalidFiles.push(file)
                continue
            }

            images.append('image', file)
        }

        if (images.getAll('image').length == 0) {
            window.alert('No image files were provided!')
            setIsUploading(false)
            return
        }

        const res = await fetch('/api/images', {
            body: images,
            method: 'POST'
        })

        const data = await res.json()

        if (data.partial) {
            window.alert('Some files could not be uploaded!')
        }

        if (!data.success) {
            window.alert('An error occurred, please try again!')
        }

        if (invalidFiles.length > 0) {
            window.alert(`${invalidFiles.length} files were ignored as they were not images!`)
        }

        setIsUploading(false)
        setForceReload(prev => prev + 1)
    }

    //Handle dragging files in
    const [isDragging, setIsDragging] = useState(false)
    const dragCounter = useRef(0)

    const handleDragEnter = (e) => {
        e.preventDefault()
        if (!e.dataTransfer.types.includes('Files')) return

        dragCounter.current++
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        if (!e.dataTransfer.types.includes('Files')) return
        dragCounter.current--

        if (dragCounter.current == 0) {
            setIsDragging(false)
        }
    }

    const handleDrop = async (e) => {
        if (!e.dataTransfer.types.includes('Files')) return

        e.preventDefault()
        dragCounter.current = 0
        setIsDragging(false)

        const files = e.dataTransfer.files
        handleUpload(files)
    }

    //Handle image options
    const handleDownload = async (name, extension, url) => {
        const file = await fetch(url)
        const blob = await file.blob()
        const blobURL = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = blobURL
        a.download = name + extension
        a.click()
    }

    const handleRename = async (uuid, currentName) => {
        const name = window.prompt('Please type the new image name:', currentName)
        if (!name) {
            window.alert('Please input a name!')
            return
        }

        const res = await fetch(`/api/images/${uuid}?name=${name}`, {
            method: 'PATCH'
        })

        if (!res.ok) {
            window.alert('An error occurred, please try again!')
            return
        }
        
        setForceReload(prev => prev + 1)
    }

    const handleDelete = async (uuid) => {
        const confirm = window.confirm('Delete this image?')
        if(!confirm) return

        const res = await fetch(`/api/images/${uuid}`, {
            method: 'DELETE'
        })

        if (!res.ok) {
            window.alert('An error occurred, please try again!')
            return
        }

        setForceReload(prev => prev + 1)
    }

    const handleImageClick = 
        props.selectFunction ? 
        props.selectFunction : 
        (image) => {window.open(image.url, '_blank')}

    //Separates component content to allow for modal display
    const content = (
        <div className='image-manager'>
            { isUploading && 
                <div className='spinner-overlay'>
                    <div className='spinner' />
                </div>
            }

            <h1> Minhas Imagens </h1>
            {props.closeModal && <i className="fa-solid fa-x close-button" onClick={props.closeModal}/>}

            <div className='flex-row-wrapper'>
                <div className='search-bar'>
                    <input 
                        type='text' 
                        placeholder='Buscar imagens...' 
                        onChange={({ target }) => setSearch(target.value)} 
                    />
                    <i className="fa-solid fa-magnifying-glass" />
                </div>

                <label className='upload-file-button' htmlFor='file-input'> 
                    <i className="fa-solid fa-cloud-arrow-up" />
                    Enviar imagem 
                </label>

                <input 
                    type='file' 
                    className='hidden-file-input' 
                    id='file-input' 
                    accept='image/*' 
                    multiple 
                    onChange={(e) => handleUpload(e.target.files)} 
                />
            </div>
            
            <div className='display-drop-wrapper'
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                { isDragging &&
                    <div className='file-drop-overlay'>
                        <div className='file-drop'>
                            <i className="fa-solid fa-cloud-arrow-up fa-4x"></i>
                            <p> Arraste arquivos para enviar </p>
                        </div>
                    </div>
                }

                <div className='images-display'>         
                    {images.map(
                        image => 
                        <div className='image-wrapper' key={image.id}>

                            <div className='image-container'>
                                <div className='image-options'>
                                    <button onClick={() => {handleDownload(image.name, image.extension, image.url)}}>
                                        <i className="fa-solid fa-download"></i>
                                    </button>

                                    <button onClick={() => {handleRename(image.uuid, image.name)}}>
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </button>

                                    <button onClick={() => {handleDelete(image.uuid)}}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
        
                                <div className='image-overlay'> 
                                    <p> {props.selectFunction ? 'Selecionar imagem' : 'Visualizar imagem'} </p> 
                                </div>

                                <img src={image.url} onClick={() => handleImageClick(image)} loading='lazy' draggable='false' />
                            </div>

                            <p className='image-name' title={image.name + image.extension} onClick={() => handleImageClick(image)}> 
                                {image.name + image.extension} 
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className='page-navigation'>
                <div className='button-group'>
                    <button onClick={handlePrevGroup} disabled={page == 1}> {'<<'} </button>
                    <button onClick={handlePrevPage} disabled={page == 1}> {'< Anterior'} </button>
                </div>
                
                <div className='button-group'>
                    {pageNumbers.map(
                        number => 
                        <button 
                            key={number} 
                            className={number == page ? 'selected-button' : ''} 
                            onClick={() => {setPage(number)}} 
                            disabled={number > totalPages}
                        > 
                            {number} 
                        </button>
                    )}
                </div>

                <div className='button-group'>
                    <button onClick={handleNextPage} disabled={page == totalPages}> 
                        {'Próximo >'} 
                    </button>

                    <button onClick={handleNextGroup} disabled={pageGroupStart + pagesPerGroup > totalPages}> 
                        {'>>'} 
                    </button>
                </div>
            </div>
        </div>
    )

    return(
        <>
            {props.modal ? 
                <div className="modal-background">
                    <div className="modal-display">
                        {content}
                    </div>
                </div> 
                : 
                content
            }
        </>
    )
}

export default ImageManager