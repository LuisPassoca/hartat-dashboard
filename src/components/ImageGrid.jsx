import { useEffect, useState } from 'react'
import './css/ImageGrid.css'

function ImageGrid({ images, onClick, onRename, onDownload, onDelete, allowSelection, onSelectionChange }) {
    const [selected, setSelected] = useState(new Map())

    const toggleSelection = (image) => {
        setSelected(prev => {
            const updated = new Map(prev)
            const exists = updated.has(image.uuid)

            if (exists) {updated.delete(image.uuid)}
            else {updated.set(image.uuid, image)}

            return updated
        })
    }

    useEffect(() => {
        setSelected(new Map())
    }, [images])

    useEffect(() => {
        onSelectionChange?.(selected)
    }, [selected])

    const handleClick = (image) => {
        if (allowSelection) {
            toggleSelection(image)
            return
        }

        onClick?.(image)
    }

    return(
        <div className='image-grid'>

            {images.map(image =>  (
                <div 
                    className='image-wrapper' 
                    key={image.uuid}
                    onClick={() => handleClick(image)}
                >

                    <div className='image-container'>

                        {!allowSelection &&
                            <div className='image-options'
                                onClick={(e) => e.stopPropagation()}
                            >

                                <button onClick={() => onDownload(image)} title='Download'> 
                                    <i className="fa-solid fa-download" /> 
                                </button>

                                <button onClick={() => onRename(image)} title='Rename'> 
                                    <i className="fa-solid fa-pen-to-square" /> 
                                </button>

                                <button onClick={() => onDelete(image)} title='Delete'> 
                                    <i className="fa-solid fa-trash" /> 
                                </button>

                            </div>
                        }

                        <img
                            src={image.url}
                            draggable={false}
                            loading='lazy'
                        />

                    </div>

                    <div className='name-selection-wrapper'>

                        {allowSelection &&
                            <input 
                                type='checkbox' 
                                checked={selected.has(image.uuid)}
                                readOnly
                            />
                        }

                        <p className='image-name' title={image.name + image.extension}> 
                            {image.name + image.extension} 
                        </p>

                    </div>

                </div>
            ))}

        </div>
    )
}

export default ImageGrid