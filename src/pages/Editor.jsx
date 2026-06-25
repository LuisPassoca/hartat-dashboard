import { Route, Routes, useNavigate } from "react-router-dom"
import MovieEditor from "../editors/MovieEditor"

import './css/Editor.css'
import ExhibitionEditor from "../editors/ExhibitionEditor"

function Editor() {
    const navigate = useNavigate()


    function EditorIndex() {

        return(
            <div className="editor-index">
                <h1> Criar Conteúdo </h1>

                <div className="content-selector">
                    <p> Selecione um conteúdo para criar: </p>
                    <button onClick={() => navigate('/editor/exhibitions')}> Criar Exposição </button>
                    <button onClick={() => navigate('/editor/movies')}> Criar Filme </button>
                </div> 
            </div>
        )
    }

    return(
        <Routes>
            <Route index element={<EditorIndex />} />
            <Route path="/movies" element={<MovieEditor />} />
            <Route path="/movies/:id" element={<MovieEditor editMode />} />
            <Route path="/exhibitions/:id?" element={<ExhibitionEditor />} />
        </Routes>
    )
}

export default Editor