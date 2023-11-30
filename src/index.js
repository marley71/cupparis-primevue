
import CrudComponent from "./CrudComponent.vue"
import cAction from './actions/cAction.vue'
import cView from './views/cView.vue'
import vRecord from './views/vRecord.vue'
import vSearch from './views/vSearch.vue'
import vList from './views/vList.vue'
import vListEdit from './views/vListEdit.vue'
import vListHasmany from './views/vListHasmany.vue'
import cImport from './app/cImport.vue'
import widgets from './widgets'
import views from './views'
import apps from './app'
import dialogs from './dialogs'
import CrudCore from "./lib/CrudCore.js";
import routerConf from "./confs/router";
import CrudVars from "./lib/CrudVars";
import routeConfs from "./confs/routes";
import cManage from './app/cManage.vue';
import aBase from './actions/aBase.vue';
import Server from './lib/Server.js';
import Wait from "./Wait.vue";

import { configure } from 'vee-validate';
import { localize,setLocale } from '@vee-validate/i18n';

export default {
    install(app) {
        app.component('crud-component', CrudComponent);
        app.component('c-action',cAction);
        widgets.install(app);
        views.install(app);
        apps.install(app);
        dialogs.install(app);
        let prefix = CrudVars.useApi?'/api':'';
        for (let k in routeConfs) {
            routeConfs[k].url = prefix + routeConfs[k].url;
        }
        configure({
            // Generates an English message locale generator
            generateMessage: localize('appLang', CrudVars.validationMessages),
        });
        setLocale('appLang');
    },
    CrudComponent,cAction,CrudCore,routerConf,CrudVars,routeConfs,
    cView,
    vRecord,vSearch,cManage,vList,vListEdit,cImport,vListHasmany,
    aBase,
    Server,Wait

}
