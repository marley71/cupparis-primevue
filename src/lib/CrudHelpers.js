// import ProtocolList from "./ProtocolList.js";
import CrudCore from "./CrudCore";
import moment from "moment/moment";

class CrudHelpers {

}

CrudHelpers.toggleDarkMode = () => {
    console.log('ciccio',document.documentElement,localStorage);
    if (!localStorage.theme) {
        localStorage.theme = "dark";
    } else {
        localStorage.removeItem("theme");
    }
    if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
        document.documentElement.classList.add(
            "app-dark",
        );
        document.getElementById('dark-mode-icon').classList.remove('fa-moon');
        document.getElementById('dark-mode-icon').classList.add('fa-sun');

    } else {
        document.documentElement.classList.remove(
            "app-dark",
        );
        document.getElementById('dark-mode-icon').classList.add('fa-moon');
        document.getElementById('dark-mode-icon').classList.remove('fa-sun');
    }
    // // Whenever the user explicitly chooses light mode
    // localStorage.theme = "light";
    // // Whenever the user explicitly chooses dark mode
    // localStorage.theme = "dark";
    // // Whenever the user explicitly chooses to respect the OS preference
    // localStorage.removeItem("theme");
}

CrudHelpers.hasDarkMode = () => {
    var theme = localStorage.getItem("theme");
    if (theme && theme==='dark') {
        return true;
    }
    return false;
}

CrudHelpers.addBearerTokenToUrl = (url, btKey) => {

    //;
    btKey = btKey || 'bt';
    url = url || '';
    var prefix = (url.indexOf('?') >= 0) ? '&' : '?';

    var btValue = '';
    if (import.meta.env.PROD) {
        var selector = document.querySelector('meta[name="bearer-token"]');
        btValue = selector ? selector.content : ''
    } else {
        btValue =  CrudCore.getCache('token');
    }
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

/**
 * ritorna i paremtri della variabile di route context
 * @param key
 */
CrudHelpers.getContextParams = (vueObject,key)  => {
    let context = vueObject.$route.params.context;
    if (!context) {
        return [];
    }
    let listParams = context.filter( a => a.indexOf('s_') == 0) || [];
    if (key) {
        let idx = listParams.indexOf('s_'+key);
        if (idx >= 0) {
            return listParams[idx];
        }
        return null;
    }
    return listParams;
}

CrudHelpers.dateFormat = (value,displayFormat) => {
    var md = moment(value);
    //console.log('displayFormat',that.displayFormat);
    if (md.isValid()) {
        return md.format(displayFormat?displayFormat:'DD/MM/YYYY')
    } else {
        return CrudCore.translate('app.invalidDateString'); // + '*' ;
    }
}

CrudHelpers.formDataToAssociativeArray = (values) => {
    let params = {}
    if (values instanceof FormData) {
        for (var pair of values.entries()) {
            params[pair[0]] = pair[1]
        }
    } else {
        params = values;
    }
    return params;
}

/**
 * mappa i domainValues in options per i componenti di primevue
 * @param {*} domainValues 
 * @param {*} domainValuesOrder 
 * @returns 
 */
CrudHelpers.mapOptions = (domainValues,domainValuesOrder) => {
    let options = [];
    if (domainValuesOrder) {
        for (let i in domainValuesOrder) {
            let opt = {
                id : domainValuesOrder[i],
                label : domainValues[domainValuesOrder[i]],
            }
            options.push(opt);
        }
    } else {
        for (let k in domainValues) {
            let opt = {
                id : k,
                label : domainValues[k],
            }
            options.push(opt);
        }
    }
    return options;
}
export default CrudHelpers;
