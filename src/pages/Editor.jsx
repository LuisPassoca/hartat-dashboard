import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import QuillEditor from "../components/QuillEditor";
import ImageManager from "../components/ImageManager";
import CoverImage from "../components/CoverImage";

import './css/Editor.css'

function Editor() {
    const [coverImage, setCoverImage] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [selectionTarget, setSelectionTarget] = useState('')
    const [allowSelection, setAllowSelection] = useState(false)
    const quillEditorRef = useRef(null)

    const openModal = (target, select) => {
        setAllowSelection(select)
        setSelectionTarget(target)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
    }

    const handleImagePick = (images) => {
        if (selectionTarget == 'cover') {
            setCoverImage(images[0])
        }

        if (selectionTarget == 'quill') {
            quillEditorRef.current?.getQuillRef().focus()

            for (const image of images) {
                quillEditorRef.current?.insertImage(image)
            }
        }
    }

    return(
        <>
            <h1> Post Editor </h1>

            <CoverImage 
                coverImage= {coverImage} 
                setCoverImage={setCoverImage} 
                openModal={() => openModal('cover', false)}
            />  
            
            <div className="editable-title">
                <h1 
                    contentEditable='true' 
                    onKeyDown={(e) => {if (e.key == 'Enter') {e.preventDefault()}}} 
                    onInput={({ target }) => {if (!target.innerText.trim()) {target.innerHTML = null}}} 
                />
            </div>


            <div className="quill-editor-wrapper">
                <QuillEditor 
                    ref={quillEditorRef}
                    imageHandler={() => openModal('quill', true)}
                />
            </div>

            {showModal && 
                <ImageManager 
                    allowSelection={allowSelection}
                    onPick={handleImagePick}
                    closeModal={closeModal}
                    modal
                />
            }
            
        </>
    )
}

export default Editor