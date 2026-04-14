import { useNavigate } from "react-router-dom";
import QuillEditor from "../components/QuillEditor";
import { useEffect } from "react";

function Home() {
    const navigate = useNavigate()

    useEffect(() => {navigate('/dashboard', {replace: true})}, [])
    
    return(
        <h1> You shouldnt be seeing this! </h1>
    )
}

export default Home