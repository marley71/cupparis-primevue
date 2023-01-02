
import CrudComponent from "./CrudComponent.vue"
import cAction from './actions/cAction.vue'
import widgets from './widgets'
import views from './views'
import apps from './app'
import dialogs from './dialogs'
import CrudCore from "./lib/CrudCore.js";
import routerConf from "./confs/router";
import CrudVars from "./lib/CrudVars";

export default {
    install(app) {
        app.component('crud-component', CrudComponent);
        app.component('c-action',cAction);
        widgets.install(app);
        views.install(app);
        apps.install(app);
        dialogs.install(app);
        // app.component('a-order', aOrder)
        // app.component('a-square', aSquare)
        // app.component('a-grouped', aGrouped)
    },
    CrudComponent,cAction,CrudCore,routerConf,CrudVars
}
