import { useEffect, useState } from 'react'
import './css/ImageManager.css'
import ImageGrid from './ImageGrid'
import DropZone from './DropZone'
import Pagination from './Pagination'

function ImageManager({ modal, closeModal, onPick, allowSelection }) {
    const [images, setImages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [forceReload, setForceReload] = useState(false)

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const limit = 30

    const [selectionMode, setSelectionMode] = useState(false)
    const [selectedImages, setSelectedImages] = useState(new Map())
    
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    useEffect(() => {
        const debounceTime = 500
        const t = setTimeout(() => {
            setDebouncedSearch(prev => {
                if (prev == search) {return prev}
                return search
            })
        }, debounceTime)

        return () => clearTimeout(t)
    }, [search])

    useEffect(() => {
        setPage(1)
    }, [debouncedSearch])
    
    //Load images
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

    //Handlers
    const handleDownload = async (image) => {
        const file = await fetch(image.url)
        const blob = await file.blob()
        const blobUrl = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = blobUrl
        a.download = image.name + image.extension
        a.click()
        URL.revokeObjectURL(blobUrl)
    }

    const handleMultipleDownloads = async () => {
        for (const image of selectedImages) {
            await handleDownload(image[1])
        }
    }

    const handlePick = (image) => {
        if (modal) {
            onPick?.([image])
            closeModal?.()
            return
        }

        window.open(image.url, '_blank')
    }

    const handleMultiplePick = () => {
        const images = Array.from(selectedImages.values())
        onPick?.(images)
        closeModal?.()
        return
    }

    const handleRename = async (image) => {
        const rename = window.prompt('Please enter the new image name:', image.name)

        if (!rename) {
            window.alert('Please enter a name!')
            return
        }

        const res = await fetch(`/api/images/${image.uuid}?name=${rename}`, {
            method: 'PATCH'
        })

        if (!res.ok) {
            window.alert('An error has occured!')
            return
        }

        setForceReload(prev => !prev)
    }

    const handleDelete = async (image, multiple) => {
        if (!multiple) {
            const confirm = window.confirm('Delete this image?')
            if(!confirm) return
        }

        const res = await fetch(`/api/images/${image.uuid}`, {
            method: 'DELETE'
        })

        if (!res.ok) {
            window.alert('An error occurred!')
            return
        }

        setForceReload(prev => prev + 1)
    }

    const handleMultipleDeletes = async () => {
        const confirm = window.confirm('Delete ALL selected images?')
        if(!confirm) return

        const images = Array.from(selectedImages.values())
        for (const image of images) {
            await handleDelete(image, true)
        }
    }

    const generateThumbnail = (file) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        const image = new Image()
        image.src = URL.createObjectURL(file)

        return new Promise((res) => {
            image.onload = () => {
                const ratio = image.width / image.height
                const targetHeight = 100
                const targetWidth = targetHeight * ratio

                canvas.width = targetWidth
                canvas.height = targetHeight

                ctx.drawImage(image, 0, 0, targetWidth, targetHeight)

                canvas.toBlob((blob) => {
                    res(new File([blob], file.name))
                }, 'image/webp', 80)
            }
        })

    }

    const handleUpload = async (files) => {
        setIsLoading(true)
        
        const invalidFiles = []
        const images = new FormData()

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                invalidFiles.push(file)
                continue
            }

            const thumbnail = await generateThumbnail(file)

            images.append('image', file)
            images.append('thumbnail', thumbnail)
        }

        if (images.getAll('image').length == 0) {
            window.alert('No image files were provided!')
            setIsLoading(false)
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

        setIsLoading(false)
        setForceReload(prev => prev + 1)
    }

    const content = (
        <>
            {isLoading && <div className='loading-spinner' />}
        
            <h1> My Images </h1>
            {modal && <i className="fa-solid fa-x close-button" onClick={() => closeModal()}/>}

            <div className='flex-row'>
                <div className='searchbar'>
                    <input 
                        type='text' 
                        placeholder='Search for images...' 
                        onChange={({ target: { value } }) => {setSearch(value)}} 
                    />
                    <i className="fa-solid fa-magnifying-glass" />
                </div>

                <label className='upload-file-button' htmlFor='file-input'> 
                    <i className="fa-solid fa-cloud-arrow-up" />
                    Upload image 
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

            {allowSelection &&
                <div className='flex-row bulk-operations'>
                    {selectionMode &&
                        <>
                            {modal &&
                                <button onClick={handleMultiplePick}> 
                                    <i className="fa-solid fa-check" /> 
                                    Confirm Selection
                                </button>
                            }
                            
                            <button onClick={handleMultipleDownloads}> 
                                <i className="fa-solid fa-download" />  
                                Download All 
                            </button>

                            <button onClick={handleMultipleDeletes}> 
                                <i className="fa-solid fa-trash" /> 
                                Delete All 
                            </button>
                        </>
                    }


                        <label htmlFor='selection-mode-checkbox'> Select multiple: </label>
                        <input 
                            id='selection-mode-checkbox' 
                            type='checkbox' 
                            onChange={(e) => {setSelectionMode(e.target.checked)}}
                        />

                </div>
            }

            <DropZone
                onDrop={handleUpload}
            >
                <ImageGrid 
                    images={images}
                    allowSelection={selectionMode}
                    onSelectionChange={setSelectedImages}
                    onClick={handlePick}
                    onDownload={handleDownload}
                    onRename={handleRename}
                    onDelete={handleDelete}
                />
            </DropZone>

            <Pagination 
                page={page}
                totalPages={totalPages}
                onChange={setPage}
            />

        </>
    )       

    return(
        <>
            {modal ?
                <div className='modal-backdrop'>
                    <div className='modal-content'>
                        {content}
                    </div>
                </div> :
                content
            }
        </>
    )
}

export default ImageManager