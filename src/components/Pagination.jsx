import './css/Pagination.css'

function Pagination({ page, totalPages, onChange }) {
    const pagesPerGroup = 10
    const pageGroup = Math.floor((page - 1) / pagesPerGroup)

    const pageGroupStart = pageGroup * pagesPerGroup + 1
    const pageGroupEnd = pageGroupStart + pagesPerGroup - 1

    const pageNumbers = []
    for(let i = pageGroupStart; i <= pageGroupEnd; i++) {pageNumbers.push(i)}

    const setPage = (page) => {
        onChange?.(page)
    }

    const handlePrevGroup = () => {setPage(Math.max((pageGroupStart - pagesPerGroup), 1))}
    const handleNextGroup = () => {setPage(Math.min((pageGroupStart + pagesPerGroup), totalPages))}

    const handlePrevPage = () => {setPage(Math.max((page - 1), 1))}
    const handleNextPage = () => {setPage(Math.min((page + 1), totalPages))}

    return(
        <div className='page-navigation'>
            <div className='button-group'>
                <button onClick={handlePrevGroup} disabled={page == 1}> {'<<'} </button>
                <button onClick={handlePrevPage} disabled={page == 1}> {'< Anterior'} </button>
            </div>
            
            <div className='button-group'>
                {pageNumbers.map(
                    number => 
                    <button 
                        key={number} 
                        className={number == page ? 'selected-button' : ''} 
                        onClick={() => {setPage(number)}} 
                        disabled={number > totalPages}
                    > 
                        {number} 
                    </button>
                )}
            </div>

            <div className='button-group'>
                <button onClick={handleNextPage} disabled={page == totalPages}> 
                    {'Próximo >'} 
                </button>

                <button onClick={handleNextGroup} disabled={pageGroupStart + pagesPerGroup > totalPages}> 
                    {'>>'} 
                </button>
            </div>
        </div>
    )
}

export default Pagination
