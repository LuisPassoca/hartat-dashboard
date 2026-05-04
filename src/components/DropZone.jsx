import { useRef, useState } from 'react'
import './css/DropZone.css'

function DropZone({ children, onDrop }) {
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
        onDrop?.(files)
    }

    return(
        <div
            className='file-drop-wrapper'
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

            {children}
        </div>
    )
}

export default DropZone