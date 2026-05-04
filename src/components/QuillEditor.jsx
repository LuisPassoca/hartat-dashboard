import Quill from "quill"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import "quill/dist/quill.snow.css"

import QuillResize from "quill-resize-module"
import 'quill-resize-module/dist/resize.css'

Quill.register('modules/resize', QuillResize)

import './css/QuillEditor.css'
import ImageManager from "./ImageManager"

const QuillEditor = forwardRef(({ imageHandler }, ref) => {
  const quillRef = useRef(null)
  const editorRef = useRef(null)

  //Use Quill's default Image Hanlder if none is provided (uploads image on base64)
  const handlers = imageHandler ? { image: imageHandler } : {}

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
          handlers
        },
        resize: {
          tools: ['left', 'center', 'right', 'full'],
        }
      }
    })
  }, [])

  const insertImage = (image) => {
    const range = quillRef.current.getSelection()
    quillRef.current.insertEmbed(range.index, 'image', image.url)
  }

  useImperativeHandle(ref, () => ({
    getHtml: () => quillRef.current.getSemanticHTML(),
    insertImage: (image) => {insertImage(image)},
    getQuillRef: () => quillRef.current,
    getEditorRef: () => editorRef.current,
  }))

  return(
    <div className="quill-wrapper">
      <div ref={editorRef} />
    </div>
  )
})

export default QuillEditor