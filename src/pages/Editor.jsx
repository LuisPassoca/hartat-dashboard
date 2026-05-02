import { useParams, useSearchParams } from "react-router-dom";
import QuillEditor from "../components/QuillEditor";
import './Editor.css'
import { useEffect, useRef, useState } from "react";
import ImageManager from "../components/ImageManager";

function Editor() {
    const { post } = useParams()

    const [quillContent, setQuillContent] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [coverImage, setCoverImage] = useState(null)
    const coverImageRef = useRef(null)
    const postTitleRef = useRef(null)
    
    const handlePost = () => {
        const title = postTitleRef.current?.innerText.trim()

        const html = quillContent?.() || ''
        const plainText = html.replace(/<([^>]+)>/ig, '').trim()
        const hasText = plainText.length > 0

        const rawCover = coverImageRef.current
        const cover = 
            coverImageRef.current ? 
            `<img class='${rawCover.className}' src='${rawCover.src}' style='${rawCover.style.cssText}' />` :
            ''

        const data = {title, html, cover}
        console.log(data)

        if (post) {}
    }


    const checkEmpty = (e) => {
        const empty = !(e.target.innerText.trim())
        if (empty) {e.target.innerHTML = null}
    }

    const preventEnter = (e) => {
        if (e.key == 'Enter') {e.preventDefault()}
    }

    return(
        <>
            <h1> Post Editor</h1>

            {!coverImage && <span> Cover image (optional): </span>}
            
            {coverImage && 
                <img 
                    ref={coverImageRef} 
                    className='cover-image' 
                    src={coverImage.url} 
                    style={{objectPosition: coverImage.align}} 
                />
            }

            <div className="cover-image-options">
                <div className="selected-image">
                    {!coverImage && <button onClick={() => setShowModal(true)}> Select Image </button>}
                    {coverImage && <button onClick={() => setCoverImage(null)}> Remove Image </button>}
                    {coverImage?.name + coverImage?.extension || 'No image selected.'}
                </div>

                {coverImage &&
                    <div className="align-buttons">
                        Image Alignment:
                        <button 
                            onClick={() => setCoverImage(prev => ({...prev, align: 'top'}))} 
                            disabled={coverImage?.align == 'top'}
                        > 
                            Top 
                        </button>

                        <button 
                            onClick={() => setCoverImage(prev => ({...prev, align: 'center'}))}
                            disabled={coverImage?.align == 'center'}
                        > 
                            Center 
                        </button>

                        <button 
                            onClick={() => setCoverImage(prev => ({...prev, align: 'bottom'}))}
                            disabled={coverImage?.align == 'bottom'}
                        > 
                            Bottom 
                        </button>
                    </div>
                }
            </div>
            

            {showModal && 
                <ImageManager 
                    closeModal={() => setShowModal(false)} 
                    selectFunction={(i) => {
                        setCoverImage({...i, align: 'center'})
                        setShowModal(false)
                    }}
                    modal
                />
            }


            <h1 
                ref={postTitleRef}
                contentEditable='true' 
                onKeyDown={preventEnter} 
                onInput={checkEmpty} 
            />


            <div className="quill-editor-wrapper">
                <QuillEditor setQuillContent={setQuillContent} />
            </div>
            <button className="create-post" onClick={handlePost}> Create Post </button>
        </>
    )
}

export default Editor