import { useEffect, useRef, useState } from 'react'
import './ImageManager.css'

function ImageManager() {
    //Handle images
    const [page, setPage] = useState(1)
    const [images, setImages] = useState([])
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState(0)
    const [forceReload, setForceReload] = useState(0)
    const limit = 30

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
        try {
            const uploadedImagesData = []
            const uploadError = () => {
                const err = new Error ('Internal server error: Unable to upload images!')
                err.uploadedImagesData = uploadedImagesData
                throw err
            }

            const uploadImage = async (image) => {
                const form = new FormData()
                form.append('image', image)

                const res = await fetch('/api/images', {
                    method: 'POST',
                    body: form,
                })
                if (!res.ok) {uploadError()}

                const { data } = await res.json()
                if (!data) {uploadError()}

                uploadedImagesData.push(data)
            }

            if (files.length == 0) {return}

            for(let i = 0; i < files.length; i++) {
                await uploadImage(files[i])
            }

            setForceReload(prev => prev + 1)
        } catch(err) {
            console.log(err)
            window.alert('Não foi possível fazer o envio das imagens!')
            //Handle image cleanup

        } finally {
            setIsUploading(false)
        }
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

        try {
            e.preventDefault()
            dragCounter.current = 0
            setIsDragging(false)

            const files = e.dataTransfer.files
            
            for (let i = 0; i < files.length; i++) {
                if (!files[i].type.startsWith('image/')) {
                    throw new Error('Invalid file types provided!')
                }
            }

            await handleUpload(files)
        } catch (err) {
            console.log(err)
            window.alert('Os tipos de arquivo enviados são inválidos!')
        }
    }

    //Handle image options
    const handleDownload = async (name, url) => {
        const file = await fetch(url)
        const blob = await file.blob()
        const blobURL = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = blobURL
        a.download = name
        a.click()
    }

    const handleRename = async (id, name) => {
        const extension = name.slice(name.lastIndexOf('.'))
        const newName = window.prompt('Digite o novo nome da imagem: ') + extension
       
        //PATCH /api/images?id
    }

    const handleDelete = async (id) => {
        if(!window.confirm('Tem certeza que deseja excluir a imagem?\nEssa ação é permanente.')) return

        //DELETE /api/images?id
    }

    //testing
    /*
    useEffect(() => {
        const fakeImages = Array.from({ length: 50 }, (_, i) => ({
            id: i + 1,
            name: `image_${i + 1}.jpg`,
            url: `https://picsum.photos/seed/${i + 1}/400/300`
        }))

        setImages(fakeImages)
        setTotalPages(5) // adjust based on your limit
    }, [])*/

    return(
        <div className='image-manager'>
            { isUploading && 
                <div className='spinner-overlay'>
                    <div className='spinner' />
                </div>
            }

            <h1> Minhas Imagens </h1>

            <div className='flex-row-wrapper'>
                <div className='search-bar'>
                    <input type='text' placeholder='Buscar imagens...' onChange={({ target }) => setSearch(target.value)} />
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>

                <label className='upload-file-button' htmlFor='file-input'> 
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    Enviar imagem 
                </label>
                <input type='file' className='hidden-file-input' id='file-input' accept='image/*' multiple onChange={(e) => handleUpload(e.target.files)}></input>
            </div>
            
            <div className='images-display'
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

                {images.map(
                    image => 
                    <div className='image-wrapper' key={image.id}>

                        <div className='image-container'>
                            <div className='image-options'>
                                <button onClick={() => {handleDownload(image.name, image.url)}}>
                                    <i className="fa-solid fa-download"></i>
                                </button>

                                <button onClick={() => {handleRename(image.id, image.name)}}>
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </button>

                                <button onClick={() => {handleDelete(image.id)}}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
    
                            <div className='image-overlay'> <p> Visualizar imagem </p> </div>
                            <img src={image.url} onClick={() => {window.open(image.url, '_blank')}} loading='lazy' />
                        </div>

                        <p className='image-name' title={image.name}> {image.name} </p>
                    </div>
                )}
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
                    <button onClick={handleNextPage} disabled={page == totalPages}> {'Próximo >'} </button>
                    <button onClick={handleNextGroup} disabled={pageGroupStart + pagesPerGroup > totalPages}> {'>>'} </button>
                </div>
            </div>
        </div>
    )
}

export default ImageManager