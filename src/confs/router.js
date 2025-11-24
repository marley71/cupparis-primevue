import vList from "@templates/views/vList.vue";
import vListEdit from "@templates/views/vListEdit.vue";
import vRecord from "@templates/views/vRecord.vue";
import cManage from "@templates/app/cManage.vue";
import cImport from "@templates/app/cImport.vue";
import CrudVars from "../lib/CrudVars";
import CrudCore from "../lib/CrudCore";

function _getModelConf(obj,key) {
    let conf = obj;
    let keys = key.split('.');
    for(let i in keys) {
        conf = conf[keys[i]];
    }
    return conf;  //CrudCore.clone(conf);
}

function _getModelConfInsert(obj,key) {
    let conf = obj;
    let keys = key.split('.');
    for(let i in keys) {
        conf = conf[keys[i]];
    }
    console.log('Insert conf',conf,obj,keys.length)
    if (!conf) {
        conf = obj[keys[keys.length-2]];
        conf = CrudCore.clone(conf.edit);
        conf.type = 'v-insert';
        return conf;
    }
    return conf; //CrudCore.clone(conf);
}

function _getManageConf(key,route) {
    if (!CrudVars.modelConfs[key]) {
        console.log(key,'route ',route,CrudVars.modelConfs);
        //document.location.href = '/#404'
        throw 'Not found';
    }
    return  CrudVars.modelConfs[key]; //CrudCore.clone(CrudVars.modelConfs[key]);
}
var routerConf = null;
try {
    routerConf =  [
        // {
        //     path: '/',
        //     name: 'default',
        //     component: cPage,
        //     props: {cPath: ''}
        // },
        {
            path: '/list/:cConf',
            name: 'v-list',
            component: vList,
            props: route => ({ conf: _getModelConf(CrudVars.modelConfs,route.params.cConf) })
        },
        {
            path: '/list-edit/:cConf',
            name: 'v-list-edit',
            component: vListEdit,
            props: route => ({ conf: _getModelConf(CrudVars.modelConfs,route.params.cConf) })
        },
        {
            path: '/insert/:cConf',
            name: 'v-insert',
            component: vRecord,
            props: route => ({ conf: _getModelConfInsert(CrudVars.modelConfs,route.params.cConf) })
        },
        {
            path: '/edit/:cConf/:cPk',
            name: 'v-edit',
            component: vRecord,
            props: route => ({ conf: Object.assign(_getModelConf(CrudVars.modelConfs,route.params.cConf),{pk:route.params.cPk} )})
        },
        {
            path: '/view/:cConf/:cPk',
            name: 'v-view',
            component: vRecord,
            props: route => ({ conf: Object.assign(_getModelConf(CrudVars.modelConfs,route.params.cConf),{pk:route.params.pk} )})
        },
        {
            path: '/manage/:cConf/:context*',
            name: 'c-manage',
            component: cManage,
            props: route => ({ conf: _getManageConf(route.params.cConf,route) })
        },
        {
            path: '/manage/:viewType(list|edit|insert|view|custom)/:cConf/:context*',
            name: 'c-manage-view',
            component: cManage,
            props: route => ({ conf: _getManageConf(route.params.cConf,route) })
        },
        {
            path: '/import/:cConf',
            name: 'c-import',
            component: cImport,
            props: route => ({ conf: CrudVars.modelConfs[route.params.cConf] })
        },
        // {
        //     path: '/calendar/:cConf',
        //     name: 'c-calendar',
        //     component: cCalendar,
        //     props: true
        // }
    ];


} catch (e) {
    alert('route non trovata');
    //document.location.href='/'
}

export default routerConf;
