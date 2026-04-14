import Quill from "quill"
import { useEffect, useRef } from "react"
import "quill/dist/quill.snow.css"

import QuillResize from "quill-resize-module"
import 'quill-resize-module/dist/resize.css'

Quill.register('modules/resize', QuillResize)

import './QuillEditor.css'

function QuillEditor() {
  const editorRef = useRef(null)
  const quillRef = useRef(null)

  useEffect(() => {
    quillRef.current = new Quill(editorRef.current, {
      placeholder: "Digite sua postagem aqui...",
      theme: "snow",
      modules: {
        toolbar: [
          [{ 'header': [false, 2, 1] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'script': 'sub' }, { 'script': 'super' }],
          [{ 'align': [] }, { 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
          ['link', 'image', 'video'],
        ],
        resize: {
          tools: ['left', 'center', 'right', 'full'],
        }
      }
    })
  }, [])

  const getContents = () => {
    console.log(quillRef.current.getContents())

  }

  return(
    <>
      <div id="quill-editor" ref={editorRef} />
      <button onClick={getContents}> Get editor Delta </button>
    </>
  )
}

export default QuillEditor
