
import widgets from '@templates/widgets'
import views from '@templates/views'
import apps from '@templates/app'
import lib from './lib';
import help from "./help";


import CrudComponent from "./CrudComponent.vue"
import cAction from '@templates/actions/cAction.vue'
//import cView from '@templates/views/cView.vue'
import vRecord from '@templates/views/vRecord.vue'
import vView from '@templates/views/vView.vue'
import vEdit from '@templates/views/vEdit.vue'
import vInsert from '@templates/views/vInsert.vue'
import vSearch from '@templates/views/vSearch.vue'
import vList from '@templates/views/vList.vue'
import vListEdit from '@templates/views/vListEdit.vue'
import vListHasmany from '@templates/views/vListHasmany.vue'
import cImport from '@templates/app/cImport.vue'

import dialogs from '@templates/dialogs'
import CrudCore from "./lib/CrudCore.js";
import routerConf from "./confs/router";
import CrudVars from "./lib/CrudVars";
import routeConfs from "./confs/routes";
import cManage from '@templates/app/cManage.vue';
import aBase from '@templates/actions/aBase.vue';
import Server from './lib/Server.js';
import Route from './lib/Route.js';
import Wait from "./Wait.vue";
import viewConfs from "./confs/views.js";
import CrudHelpers from "./lib/CrudHelpers";
//import cWidget from "@templates/widgets/cWidget.vue";
import wBase from '@templates/widgets/wBase.vue';
import actionConfs from "./confs/actions";

import WidgetsPage from "./help/WidgetsPage.vue";
import ViewsPage from "./help/ViewsPage.vue";
import ManagePage from "./help/ManagePage.vue";
import ImportPage from "./help/ImportPage.vue";
import ActionsPage from "./help/ActionsPage.vue";
import DialogsPage from "./help/DialogsPage.vue";
import EsperimentiPage from "./help/EsperimentiPage.vue";
import JsToCode from "./help/JsToCode";
import RulesErrors from "./templates/widgets/RulesErrors.vue";
import "./assets/cupparis.css"



export default {
    install(app) {
        lib.install(app);
        widgets.install(app);
        views.install(app);
        apps.install(app);
        dialogs.install(app);
        help.install(app);

        let prefix = CrudVars.useApi?'/api':'';
        for (let k in routeConfs) {
            routeConfs[k].url = prefix + routeConfs[k].url;
        }
        
        // Configura VeeValidate con i messaggi tradotti
        CrudCore.configureValidationMessages();

    },
    // Funzione per aggiornare i messaggi di validazione dopo il caricamento delle traduzioni
    //updateValidationMessages: configureValidationMessages,
    CrudComponent,cAction,CrudCore,CrudVars,wBase,
    //cView,
    routerConf,routeConfs,actionConfs,viewConfs,
    vRecord,vSearch,cManage,vList,vListEdit,cImport,vListHasmany,
    vEdit,vInsert,vView,
    aBase,
    Server,Wait,Route,
    CrudHelpers,
    // --- help pages
    WidgetsPage,ViewsPage,ManagePage,ImportPage,ActionsPage,DialogsPage,EsperimentiPage,
    JsToCode,RulesErrors

}
