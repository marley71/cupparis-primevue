import vList from "../views/vList.vue";
import vListEdit from "../views/vListEdit.vue";
import vRecord from "../views/vRecord.vue";
import cManage from "../app/cManage.vue";
import cImport from "../app/cImport.vue";
import CrudVars from "../lib/CrudVars";
import CrudCore from "../lib/CrudCore";

const routerConf =  [
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
        props: route => ({ conf: CrudVars.modelConfs[route.params.cConf] })
    },
    {
        path: '/list-edit/:cConf',
        name: 'v-list-edit',
        component: vListEdit,
        props: route => ({ conf: CrudVars.modelConfs[route.params.cConf] })
    },
    {
        path: '/insert/:cConf',
        name: 'v-insert',
        component: vRecord,
        props: route => ({ conf: CrudVars.modelConfs[route.params.cConf] })
    },
    {
        path: '/edit/:cConf/:cPk',
        name: 'v-edit',
        component: vRecord,
        props: route => ({ conf: Object.assign(CrudVars.modelConfs[route.params.cConf],{pk:route.params.pk} )})
    },
    {
        path: '/view/:cConf/:cPk',
        name: 'v-view',
        component: vRecord,
        props: route => ({ conf: Object.assign(CrudVars.modelConfs[route.params.cConf],{pk:route.params.pk} )})
    },
    // {
    //     path: '/page/:cPath',
    //     name: 'c-page',
    //     component: cPage,
    //     props: true
    // },
    {
        path: '/manage/:cConf',
        name: 'c-manage',
        component: cManage,
        props: route => ({ conf: CrudCore.clone(CrudVars.modelConfs[route.params.cConf]) })
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
export default routerConf;
