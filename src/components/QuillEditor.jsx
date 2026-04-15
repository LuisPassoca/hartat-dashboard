import Quill from "quill"
import { useEffect, useRef, useState } from "react"
import "quill/dist/quill.snow.css"

import QuillResize from "quill-resize-module"
import 'quill-resize-module/dist/resize.css'

Quill.register('modules/resize', QuillResize)

import './QuillEditor.css'
import ImagePicker from "./ImagePicker"

function QuillEditor() {
  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const [showModal, setShowModal] = useState(false)

  const imageHandler = async () => {
      const uploadImage = async () => {
        const image = input.files[0]
        const form = new FormData()
        form.append('image', image)

        const res = await fetch('/api/upload-image', {
          method: 'POST',
          body: form,
        })

        const { data } = await res.json()

        if (!data) {
          throw new Error('Unable to upload image due to an internal server error!')
        }
        
        const range = quillRef.current.getSelection()
        quillRef.current.insertEmbed(range.index, 'image', data.imageURL)
      }

      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.click() 

      input.addEventListener('change', uploadImage)
  }

  useEffect(() => {
    quillRef.current = new Quill(editorRef.current, {
      placeholder: "Conteúdo da postagem",
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
  }, [])

  const getContents = () => {
    console.log(quillRef.current.getSemanticHTML())
  }

  return(
    <>
      {showModal ? <ImagePicker /> : ''}
      <div id="quill-editor" ref={editorRef} />
      <button onClick={getContents}> Get editor contents </button>
    </>
  )
}

export default QuillEditor
