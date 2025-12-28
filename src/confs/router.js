import vList from "@templates/views/vList.vue";
import vListEdit from "@templates/views/vListEdit.vue";
import vRecord from "@templates/views/vRecord.vue";
import cManage from "@templates/app/cManage.vue";
import cImport from "@templates/app/cImport.vue";
import CrudVars from "../lib/CrudVars";
import CrudCore from "../lib/CrudCore";


function _getManageConfInstance(obj,key) {
    let keys = key.split('.');
    let conf = keys[0];
    console.log('router. _getModelConf conf',conf,obj,keys.length)
    if (obj[conf]instanceof Function) {
        conf = obj[conf]();
    } else {
        conf = obj[conf];
    }
    return conf;
}


function _getModelConf(obj,key) {
    let keys = key.split('.');
    let conf = _getManageConfInstance(obj,key);
    if (keys.length > 1) {
        for(let i=1;i<keys.length;i++) {
            conf = conf[keys[i]];
        }
    }
    return conf;
}

/**
 * qui e' un po' diverso perche' la key insert potrebbe non essere definita nel conf
 * @param {} obj 
 * @param {*} key 
 * @returns 
 */
function _getModelConfInsert(obj,key) {
    let keys = key.split('.');
    let conf = _getManageConfInstance(obj,key);

    // questo e' il caso standard per l'inserimento di un nuovo record quando la key e' insert
    if (keys.length === 2 && keys[1] === 'insert') {
        if (!conf['insert']) {
            conf = conf.edit;
            if (!conf) {
                throw new Error('Insert o Edit conf not found');
            }
            conf.type = 'v-insert';
            delete conf.pk;
            return conf;
        }
        return conf;
    }
    // altrimenti e' un caso di variabile custom e non faccio nessuna assunzione
    if (keys.length > 1) {
        for(let i=1;i<keys.length;i++) {
            conf = conf[keys[i]];
        }
    }
    return conf;
}

function _getManageConf(key,route) {
    if (!CrudVars.modelConfs[key]) {
        console.log(key,'route ',route,CrudVars.modelConfs);
        //document.location.href = '/#404'
        //throw 'Not found';
        CrudCore.event().emit('route-error',{msg: key +' Not found',route:route});
    }
    console.debug('router CrudVars',key,CrudVars.modelConfs[key]())
    return  CrudVars.modelConfs[key](); //CrudCore.clone(CrudVars.modelConfs[key]);
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
            props: route => ({ conf: Object.assign(_getModelConf(CrudVars.modelConfs,route.params.cConf),{pk:route.params.cPk} )})
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
            props: route => ({ conf: CrudVars.modelConfs[route.params.cConf]() })
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
