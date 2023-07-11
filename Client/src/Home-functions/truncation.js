function truncate(string,number){
    if(string.length > 20){
        var newstring = string.slice(0,number)
        newstring += "...";
        return newstring;
    }
    else{
        return string;
    }
}
export {truncate}