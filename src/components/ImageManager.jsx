import { useEffect, useRef, useState } from 'react'
import './ImageManager.css'

function ImageManager() {
    const [search, setSearch] = useState('')

    const fetchImages = () => {
        return fetch('/api/images', {
            method: 'GET'
        })
    }

    useEffect(() => {
        const timeout = setTimeout(async () => {
            
        })


    }, [search])

    return(
        <>
            <div className="searchbar">
                <input type="text" placeholder="Buscar imagem..." onChange={({ target }) => setSearch(target.value)} />
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>

            <div className='images-container'>
                {images.map(image => <img key={image.id} src={image.url} loading="lazy" />)}
            </div>

        </>
    )
}

export default ImageManager