import { useParams, useSearchParams } from "react-router-dom";
import QuillEditor from "../components/QuillEditor";
import './Editor.css'

function Editor() {
    const { post } = useParams()
    console.log(post)

    const checkEmpty = (e) => {
        const empty = !(e.target.innerText.trim())
        if (empty) {e.target.innerHTML = null}
    }

    const preventEnter = (e) => {
        if (e.key == 'Enter') {e.preventDefault()}
    }

    return(
        <>
            <h2> Título da postagem: </h2>
            <h1 contentEditable='true' onKeyDown={preventEnter} onInput={checkEmpty} style={{outline: 'none'}}></h1>
            <QuillEditor />
        </>
    )
}

export default Editor