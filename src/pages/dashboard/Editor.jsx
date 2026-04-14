import { useSearchParams } from "react-router-dom";
import QuillEditor from "../../components/QuillEditor";

function Editor() {
    const [searchParams] = useSearchParams()
    console.log(searchParams.get('mode'))

    return(
        <>
            <h1> Criar postagem </h1>
            <QuillEditor />
        </>
    )
}

export default Editor