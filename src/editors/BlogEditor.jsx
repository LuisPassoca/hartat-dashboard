import { useRef, useState } from "react"
import CoverImage from "../components/CoverImage"
import QuillEditor from "../components/QuillEditor"
import ImageManager from "../components/ImageManager"

function BlogEditor({ html, image = null, title }) {
    const [coverImage, setCoverImage] = useState(image)
    const [showModal, setShowModal] = useState(false)

    const [allowSelection, setAllowSelection] = useState(false)
    const [selectionTarget, setSelectionTarget] = useState('')

    const quillEditorRef = useRef(null)

    const openModal = (target, selection) => {
        setAllowSelection(selection)
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
            <CoverImage 
                coverImage={coverImage}
                setCoverImage={setCoverImage}
                openModal={() => openModal('cover', false)}
            />

            <QuillEditor 
                ref={quillEditorRef}
                imageHandler={() => openModal('quill', false)}
            />
            
            <button> Publicar </button>

            { 
                showModal &&
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

export default BlogEditor