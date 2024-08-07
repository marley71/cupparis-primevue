// import ProtocolList from "./ProtocolList.js";
import CrudCore from "./CrudCore";

class CrudHelpers {

}

CrudHelpers.addBearerTokenToUrl = (url, btKey) => {

    //;
    btKey = btKey || 'bt';
    url = url || '';
    var prefix = (url.indexOf('?') >= 0) ? '&' : '?';
    var btValue = import.meta.env.PROD
        ? document.querySelector('meta[name="bearer-token"]')
        : CrudCore.getCache('token');
    return url + prefix + btKey + '=' + btValue;
}

CrudHelpers.lining = (text, maxLength, char) => {
    if (!text) {
        return "";
    }
    char = char || " ";
    maxLength = maxLength || 40;

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

/*
    Sistema la stringa per il blob da scaricare
 */
CrudHelpers.s2ab = (s) => {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

CrudHelpers.toBlob = (s) => {
    return CrudHelpers.s2ab(atob(s));
}

CrudHelpers.createRuntimeDownload = (content,mime,name) => {
    const pdfData = CrudHelpers.toBlob(content);
    const url = window.URL.createObjectURL(new Blob([pdfData], {type: mime}));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
}

CrudHelpers.createRuntimeLink = (url,target) => {
    const link = document.createElement('a');
    link.href = url;
    if (target) {
        link.setAttribute('target',target);
    }
    document.body.appendChild(link);
    link.click();
}

CrudHelpers.getHashParams = (key,onlyValue) => {

    let hash = document.location.hash.split('?');

    if (hash.length <= 1) {
        return {};
    }

    let hashParams = hash[1].split('&');

    let params = {};

    for (var p of hashParams) {
        let tmp = p.split('=');
        if (key && key !== tmp[0]) {
            continue;
        }
        params[tmp[0]] = tmp[1];
    }

    if (key && onlyValue === true) {
        return params[key];
    }
    return params;
}

export default CrudHelpers;
