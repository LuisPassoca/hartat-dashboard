import Quill from "quill"
import { useEffect, useRef } from "react"
import "quill/dist/quill.snow.css"

function QuillEditor() {
  const editorRef = useRef(null)

  useEffect(() => {
    new Quill(editorRef.current, {
      theme: "snow"
    })
  }, [])

  return <div id="editor" ref={editorRef}></div>
}

export default QuillEditor
