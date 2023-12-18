// import ProtocolList from "./ProtocolList.js";

class CrudHelpers {

}

CrudHelpers.lining = (text,maxLength,char) => {
    if (!text) {
        return "";
    }
    char = char || " ";
    maxLength= maxLength || 40;

    var indTokens = text.split(" ");
    var textSpaced = '';
    var currLength = 0;
    for (var i in indTokens) {
        var token = indTokens[i];
        textSpaced += token;
        currLength += token.length;
        if (currLength >= maxLength) {
            textSpaced += "<br/>";
            currLength = 0;
        } else {
            textSpaced += "&nbsp;";
        }
    }
    return textSpaced;

}

export default CrudHelpers;
