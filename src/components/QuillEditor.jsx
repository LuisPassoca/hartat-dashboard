import Quill from "quill"
import { useEffect, useRef, useState } from "react"
import "quill/dist/quill.snow.css"

import QuillResize from "quill-resize-module"
import 'quill-resize-module/dist/resize.css'

Quill.register('modules/resize', QuillResize)

import './QuillEditor.css'
import ImageManager from "./ImageManager"

function QuillEditor(props) {
  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const [showModal, setShowModal] = useState(false)

  const imageHandler = async () => {
    document.activeElement.blur()
    setShowModal(true)
  }

  useEffect(() => {
    quillRef.current = new Quill(editorRef.current, {
      placeholder: "Type your post...",
      theme: "snow",
      modules: {
        toolbar: {
          container: [
            [{ 'header': [false, 2, 1] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'align': [] }, { 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
            ['link', 'image', 'video'],
          ],
          handlers: { image: imageHandler }
        },
        resize: {
          tools: ['left', 'center', 'right', 'full'],
        }
      }
    })

    //Not ideal, but passes the function to the parent
    props.setQuillContent(() => () => quillRef.current.getSemanticHTML())
  }, [])

  const getContents = () => {
    console.log(quillRef.current.getSemanticHTML())
  }

  const selectFunction = (image) => {
    const range = quillRef.current.getSelection()
    quillRef.current.insertEmbed(range.index, 'image', image.url)
    setShowModal(false)
  }

  return(
    <>
      <div className="quill-wrapper">
        <div ref={editorRef} />
      </div>

      {showModal && 
        <ImageManager 
          selectFunction={selectFunction} 
          closeModal={() => setShowModal(false)} 
          modal
        />
      }
    </>
  )
}

export default QuillEditor
