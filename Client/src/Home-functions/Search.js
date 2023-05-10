function SearchFunction(){
    return(
        <>
            <div className="col-8"><input id="input-search" className="input-search" placeholder="search..."></input></div>
            <div className="col-1"><button>go</button></div>
            <div className="col-1"><button>search by filters</button></div>
        </>
        
    )
}
export {SearchFunction};