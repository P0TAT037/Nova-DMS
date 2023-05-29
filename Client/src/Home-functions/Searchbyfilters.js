import { useState } from "react";
function Searchbyfilters(props){
    const [ispressed,setIspressed] = useState(false);
    function handlebuttonclick(){
        setIspressed(true);
    }
    function handleexitclick(){
        setIspressed(false);
    }
    function handleSearchClick() {
        const name = document.getElementById('nm').value;
        const description = document.getElementById('Des').value;
        const content = document.getElementById('con').value;
        const author = document.getElementById('auth').value;
        const editedBy = document.getElementById('eb').value;
        const createdDate = document.getElementById('cd').value;
        const updatedDate = document.getElementById('ud').value;

        const requestBody = {
            // Only include properties with non-empty values
            ...(name && { name }),
            ...(description && { description }),
            ...(content && { content }),
            ...(author && { author }),
            ...(editedBy && { editedBy }),
            ...(createdDate && { createdDate }),
            ...(updatedDate && { updatedDate }),
          };
          console.log(JSON.stringify(requestBody));
          const headers = {
            'accept': '*/*',
            'Authorization': `Bearer ${props.token}`,
            'Content-Type': 'application/json',
          };
          fetch("https://localhost:7052/search/filter", {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
          })
         
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log(data);
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
          
        
    }
    return(
        <>
        <div className="col-1"><button onClick={handlebuttonclick} className="filters-button"title="Search By Filters"></button></div>
        {ispressed !== false &&(
            <div style={{width: "40vw"}} className="div-popup z-index-2" >
                <span>Search by filters</span>
                    <button className="btn-popup-close" onClick={handleexitclick}>X</button>
                    <br />
                    <label htmlFor="nm">File Name:</label>
                    <input type="text" id="nm" />
                    <br />
                    <label htmlFor="Des">File Description:</label>
                    <input type="text" id="Des" />
                    <br />
                    <label htmlFor="con">File Content:</label>
                    <input type="text" id="con" />
                    <br />
                    <label htmlFor="auth">Author:</label>
                    <input type="text" id="auth" />
                    <br />
                    <label htmlFor="eb">Edited By:</label>
                    <input type="text" id="eb" />
                    <br />
                    <label htmlFor="cd">Created Date:</label>
                    <input type="text" id="cd" />
                    <br />
                    <label htmlFor="ud">Updated Date:</label>
                    <input type="text" id="ud" />
                    <br />
                    <button id="Search-button" onClick={handleSearchClick}>Search</button>
                
            </div>
        )}
        </>
    );
}
export {Searchbyfilters}