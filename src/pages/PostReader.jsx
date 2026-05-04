import { useParams } from 'react-router-dom'
import { useRef } from 'react'

import './css/PostReader.css'

function PostReader() {
    const { post } = useParams()

    const displayRef = useRef(null)

    return(
        <>
            <h1> Hello PostReader! </h1>
        
            <div className="ql-snow">
                <div className="ql-editor" ref={displayRef} />     
            </div>
        </>
    )
}

export default PostReader