
import CrudComponent from "./CrudComponent.vue"
import cAction from './actions/cAction.vue'
//import widgets from './widgets'
import views from './views'
import apps from './app'
import dialogs from './dialogs'
import CrudCore from "./lib/CrudCore.js";
import routerConf from "./confs/router";
import CrudVars from "./lib/CrudVars";
import routeConfs from "./confs/routes";
export default {
    install(app) {
        //app.component('crud-component', CrudComponent);
        app.component('c-action',cAction);
        //widgets.install(app);
        views.install(app);
        apps.install(app);
        dialogs.install(app);
        let prefix = CrudVars.useApi?'/api':'';
        for (let k in routeConfs) {
            routeConfs[k].url = prefix + routeConfs[k].url;
        }
    },
    CrudComponent,cAction,CrudCore,routerConf,CrudVars,routeConfs,
}
