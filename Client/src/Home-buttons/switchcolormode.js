function switchtolight(num){
    if (num === 1){
    document.getElementById("div-color").className = "div-colorlight z-index-1"
    document.getElementById("div-menu").style = "background-color: rgb(73, 0, 133);"
    document.getElementById("row-main").className = "row row-mainlight"
    }
    else{
    document.getElementById("div-color").className = "div-color z-index-1"
    document.getElementById("div-menu").style = "background-color: #0000003b;"
    document.getElementById("row-main").className = "row row-main"
    document.getElementById("row-main").style = "animation: eeeeeemacarina 3.5s;"
    
    }
}
export {switchtolight};