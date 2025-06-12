
import CrudComponent from "./CrudComponent.vue"
import cAction from './dist/actions/cAction.vue'
import cView from './dist/views/cView.vue'
import vRecord from './dist/views/vRecord.vue'
import vView from './dist/views/vView.vue'
import vEdit from './dist/views/vEdit.vue'
import vInsert from './dist/views/vInsert.vue'
import vSearch from './dist/views/vSearch.vue'
import vList from './dist/views/vList.vue'
import vListEdit from './dist/views/vListEdit.vue'
import vListHasmany from './dist/views/vListHasmany.vue'
import cImport from './dist/app/cImport.vue'
import widgets from './dist/widgets'
import views from './dist/views'
import apps from './dist/app'
import dialogs from './dist/dialogs'
import CrudCore from "./lib/CrudCore.js";
import routerConf from "./confs/router";
import CrudVars from "./lib/CrudVars";
import routeConfs from "./confs/routes";
import cManage from './dist/app/cManage.vue';
import aBase from './dist/actions/aBase.vue';
import Server from './lib/Server.js';
import Route from './lib/Route.js';
import Wait from "./Wait.vue";
import viewConfs from "./confs/views.js";
import CrudHelpers from "./lib/CrudHelpers";
import cWidget from "./dist/widgets/cWidget.vue";
import wBase from './dist/widgets/wBase.vue';
import actionConfs from "./confs/actions";

import { configure } from 'vee-validate';
import { localize,setLocale } from '@vee-validate/i18n';

import WidgetsPage from "./help/WidgetsPage.vue";
import ViewsPage from "./help/ViewsPage.vue";
import ManagePage from "./help/ManagePage.vue";
import ImportPage from "./help/ImportPage.vue";
import ActionsPage from "./help/ActionsPage.vue";
import DialogsPage from "./help/DialogsPage.vue";
import EsperimentiPage from "./help/EsperimentiPage.vue";
import InsertEditUser from "./help/components/InsertEditUser.vue";
import ListUser from './help/components/ListUser.vue';
import ActionSelect from "./help/components/ActionSelect.vue";


import JsToCode from "./help/JsToCode";
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
        CrudCore.componentItems['CrudComponent'] = CrudComponent;
        CrudCore.componentItems['c-action'] = cAction;
        CrudCore.componentItems['c-view'] = cView;
        CrudCore.componentItems['v-record'] = vRecord;
        CrudCore.componentItems['v-insert'] = vInsert;
        CrudCore.componentItems['v-edit'] = vEdit;
        CrudCore.componentItems['v-view'] = vView;
        CrudCore.componentItems['v-search'] = vSearch;
        CrudCore.componentItems['c-Manage'] = cManage;
        CrudCore.componentItems['v-list'] = vList;
        CrudCore.componentItems['v-list-edit'] = vListEdit;
        CrudCore.componentItems['c-import'] = cImport;
        CrudCore.componentItems['v-list-hasmany'] = vListHasmany;
        CrudCore.componentItems['a-base'] = aBase;
        CrudCore.componentItems['c-widget'] =  cWidget;
        CrudCore.componentItems['w-base'] =  wBase;
        // componenti custom utilizzati nelle pagine di help
        CrudCore.componentItems['list-user'] =  ListUser;
        CrudCore.componentItems['insert-edit-user'] =  InsertEditUser;
        CrudCore.componentItems['action-select'] =  ActionSelect;

    },
    CrudComponent,cAction,CrudCore,CrudVars,cWidget,wBase,
    cView,
    routerConf,routeConfs,actionConfs,viewConfs,
    vRecord,vSearch,cManage,vList,vListEdit,cImport,vListHasmany,
    vEdit,vInsert,vView,
    aBase,
    Server,Wait,Route,
    CrudHelpers,
    // --- help pages
    WidgetsPage,ViewsPage,ManagePage,ImportPage,ActionsPage,DialogsPage,EsperimentiPage,
    InsertEditUser,ListUser,
    JsToCode

}
