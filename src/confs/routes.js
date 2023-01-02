/**
 * routes predefinite per l'utilizzo generale della libreria, estendono la proprietò crud.confs.routes
 */
import CrudCore from "../lib/CrudCore";
let prefix = CrudCore.USE_API?'/api':'';

const routeConfs = {
    list: {
        method: 'get',
        url: prefix + '/foorm/{modelName}',
        resultType: 'list',
        protocol: 'list',
        commonParams: {},  //parametri statici da aggiungere sempre alla chiamata
        values: {}, // vettore associativo dei parametri per la costruzione dell'url
        params: {},
    },
    uploadfile: {
        method: 'post',
        //url         : '/api/json/{modelName}/uploadfile',
        url: prefix + '/uploadfile',
        resultType: 'record',
        protocol: 'record',
        commonParams: {},  //parametri statici da aggiungere sempre alla chiamata
        values: {}, // vettore associativo dei parametri per la costruzione dell'url
        params: {},
    },
    upload: {
        method: 'post',
        url: prefix + '/upload',
        resultType: 'record',
        protocol: 'record',
        commonParams: {},  //parametri statici da aggiungere sempre alla chiamata
        values: {}, // vettore associativo dei parametri per la costruzione dell'url
        params: {},
    },
    insert: {
        method: "get",
        url: prefix + '/foorm/{modelName}/new',
        resultType: 'record',
        protocol: 'record',
        type: 'create',
    },
    update: {
        method: "post",
        url: prefix + '/foorm/{modelName}/{pk}',
        resultType: 'record',
        protocol: 'record',
        type: 'update',
        commonParams: {_method: 'PUT'}
    },
    create: {
        method: "post",
        url: prefix + '/foorm/{modelName}',
        resultType: 'record',
        protocol: 'record',
        type: 'create',
        commonParams: {_method: 'POST'}
    },
    edit: {
        method: "get",
        url: prefix + '/foorm/{modelName}/{pk}/edit',
        //url         :'/foorm/{modelName}/{pk}/edit',
        resultType: 'record',
        protocol: 'record',
        type: 'update',
    },
    search: {
        method: "get",
        url: prefix + '/foorm/{modelName}/search',
        //url         :'/foorm/{modelName}/{pk}/edit',
        resultType: 'record',
        protocol: 'record'
    },
    view: {
        method: "get",
        url: prefix + '/foorm/{modelName}/{pk}/view',
        resultType: 'record',
        protocol: 'record',
        type: 'read',
    },
    delete: {
        method: "post",
        //url: prefix + '/foorm/{modelName}/{pk}',
        url : '/foormaction/delete/{modelName}/list',
        resultType: 'record',
        protocol: 'record',
        type: 'delete',
        commonParams: {_method: 'DELETE'}
    },
    'multi-delete': {
        method: "post",
        url: prefix + '/foorm/{modelName}/multi-delete',
        resultType: 'record',
        protocol: 'record',
        type: 'delete'
    },
    autocomplete: {
        method: "post",
        url: prefix + "/foormaction/autocomplete/{foormName}/{viewType}",
        resultType: 'list',
        protocol: 'list'

    },
    set: {
        method: "post",
        //url: prefix + '/api/json/set/{modelName}/{field}/{value}',
        url :  prefix + "/foormaction/set/{modelName}/list",
        resultType: 'record',
        protocol: 'record'
    },
    pages: {
        url: prefix + '/crud/page/{path}',
    },
    calendar: {
        method: 'get',
        url: prefix + '/foorm/{modelName}',
        resultType: 'list',
        protocol: 'list',
        commonParams: {}, // parametri statici da aggiungere sempre alla chiamata
        values: {}, // vettore associativo dei parametri per la costruzione dell'url
        params: {}
    },
    // routes queue to import
    load_datafile: {
        method: 'post',
        url: prefix + '/queue/add/datafile/load',
        resultType: 'record',
        protocol: 'record',
        extra_params: {}
    },
    status_queue: {
        method: 'get',
        url: prefix + '/queue/status/{id}',
        resultType: 'record',
        protocol: 'record',
        extra_params: {}
    },
    'status-queue': {
        method: 'get',
        url: prefix + '/queue/status/{id}',
        resultType: 'record',
        protocol: 'record',
        extra_params: {}
    },
    'add-queue' : {
        method: 'get',
        url: prefix + '/queue/add/{queueName}',
        resultType: 'record',
        protocol: 'record',
        extra_params: {}
    },
    save_datafile: {
        method: 'post',
        url: prefix + '/queue/add/datafile/save',
        resultType: 'record',
        protocol: 'record'
    },
    datafile_data: {
        method: 'get',
        url: prefix + '/foormc/{modelName}/datafile_id/{jobId}',
        resultType: 'list',
        protocol: 'list'
    },
    datafile_insert: {
        method: 'get',
        url: prefix + '/foorm/{modelName}/new',
        resultType: 'record',
        protocol: 'record'
    },
    datafile_import: {
        method: 'get',
        url: prefix + '/foorm/{modelName}/import/{jobId}',
        resultType: 'record',
        protocol: 'record'
    }
}

export default routeConfs
