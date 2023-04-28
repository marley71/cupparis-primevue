/**
 * Created by pier on 20/12/17.
 */

//import jQuery from 'jquery';
import CrudVars from "./CrudVars";

const Server = {

};


/**
 * ritorna l'url reale nel dominio in cui si lavora
 * in caso di subdomain aggiunge il subdomain all'url passato
 * @param url, url a cui aggiungere il prefisso subdomain
 * @returns {*}
 *
 * **/
Server.getUrl = function (url) {
    return Server.subdomain?Server.subdomain + url:url;
};

Server.getHearders = function() {
    var headers = {};
    if (import.meta.env.VITE_TOKEN && !import.meta.env.PROD) {
        headers = {
            'Authorization': 'Bearer ' +  import.meta.env.VITE_TOKEN,
            'Accept': 'application/json'
        }
        return headers;
    }
    if (!import.meta.env.VITE_TOKEN && !import.meta.env.PROD) {
        headers = {
            'Authorization': 'Bearer ' +  window.localStorage.getItem('token'),
            'Accept': 'application/json'
        }
        return headers;
    }
    if (CrudVars.useApi) {
        let selector = document.querySelector('meta[name="bearer-token"]');
       headers = {
           'Authorization': 'Bearer ' +  (selector?selector.content:''), // jQuery('meta[name="bearer-token"]').attr('content')
           'Accept': 'application/json'
       }
    } else {
        let selector = document.querySelector('meta[name="csrf-token"]');
        headers = {
            'X-CSRF-TOKEN': (selector?selector.content:'') //jQuery('meta[name="csrf-token"]').attr('content')
        }
    }
    //console.log('HEADERS',headers);
    return headers;
}

Server.post = function (url, params, callback) {
    var realUrl = Server.getUrl(url);
    var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
    var processData = true;
    if (params instanceof FormData) {
        contentType = false;
        processData = false;
    }
    console.log('serverPost',(params instanceof FormData),contentType,processData);
    window.jQuery.ajax({
        url: realUrl,
        headers: Server.getHearders(),
        type: 'POST',
        data: params,
        contentType: contentType,
        processData: processData,
    }).done(function(json) {
        callback(json);
    }).fail(function (data, error, msg) {
        callback({error:1,msg:msg});
    });
};

Server.get = function (url, params, callback) {
    var realUrl = Server.getUrl(url);
    var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
    var processData = true;
    var _data = {};
    if (params instanceof FormData) {
        contentType = false;
        processData = true;
        console.log('is FormData')
        for (var key of params.keys()) {
            var values = params.getAll(key);
            console.log('key',key,'values',values);
            if (! (key in _data) ) {
                if (values.length == 1) {
                    _data[key] = values[0];
                } else {
                    _data[key] = [];
                    for (var vi in values) {
                        _data[key].push(values[vi]);
                    }
                }
            }

        }

        // for (var key of params.keys()) {
        //     var values = params.getAll(key);
        //     if (values.length == 1) {
        //         _data[key] = values[0];
        //     } else {
        //         var keyName = key+'[]';
        //         for (var vi in values) {
        //             _data[keyName] = values[vi];
        //         }
        //     }
        // }
    } else {
        _data = params;
    }
    console.log('Server.get _data',_data,contentType,processData);
    //console.log('serverGet',(params instanceof FormData),contentType,processData,params);
    window.jQuery.ajax({
        url: realUrl,
        headers: Server.getHearders(),
        type: 'GET',
        data: _data,
        contentType: contentType,
        processData: processData,
    }).done(function(json) {
        callback(json);
    }).fail(function (data, error, msg) {
        callback({error:1,msg:msg});
    });
};

Server.route = function(route,callback) {
    var __cb = callback?callback:function (json) {console.debug(route.className,json)};
    var realUrl = route.getUrl();
    var params = route.getParams();
    Server[route.getMethod()](realUrl,params,function (json) {
        __cb(json);
    })
};

Server.postJson = function (url, params, callback) {
    var realUrl = Server.getUrl(url);
    var contentType = 'application/json; charset=UTF-8';
    console.log('serverPost',(params instanceof FormData),contentType);
    window.jQuery.ajax({
        url: realUrl,
        headers: Server.getHearders(),
        type: 'POST',
        data: JSON.stringify(params),
        contentType: contentType,
        processData:  false,
    }).done(function(json) {
        callback(json);
    }).fail(function (data, error, msg) {
        callback({error:1,msg:msg});
    });
};

Server.subdomain = null;

export default Server
