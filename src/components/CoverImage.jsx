import './css/CoverImage.css'

function CoverImage({ coverImage, setCoverImage, openModal }) {


    return(
        <>
            {!coverImage && <span> Cover image (optional): </span>}

            {coverImage && 
                <img 
                    className='cover-image' 
                    src={coverImage.url} 
                    style={{objectPosition: coverImage.align}} 
                />
            }

            <div className="cover-image-options">
                <div className="selected-image">
                    {!coverImage && <button onClick={openModal}> Select Image </button>}
                    {coverImage && <button onClick={() => setCoverImage(null)}> Remove Image </button>}
                    {coverImage?.name + coverImage?.extension || 'No image selected.'}
                </div>

                {coverImage &&
                    <div className="align-buttons">
                        Image Alignment:
                        <button 
                            onClick={() => setCoverImage(prev => ({...prev, align: 'top'}))} 
                            disabled={coverImage?.align == 'top'}
                        > 
                            Top 
                        </button>

                        <button 
                            onClick={() => setCoverImage(prev => ({...prev, align: 'center'}))}
                            disabled={coverImage?.align == 'center'}
                        > 
                            Center 
                        </button>

                        <button 
                            onClick={() => setCoverImage(prev => ({...prev, align: 'bottom'}))}
                            disabled={coverImage?.align == 'bottom'}
                        > 
                            Bottom 
                        </button>
                    </div>
                }
            </div>
        </>
    )
}

export default CoverImage