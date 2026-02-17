//import cView from "./cView.vue";
import aBase from "./aBase.vue";
//import aSelect from "./aSelect.vue";
import cAction from "./cAction.vue";
import CrudCore from "../../lib/CrudCore";


export default {
    install (app) {
        app.component('a-base', aBase);
        CrudCore.componentItems['a-base'] = aBase;
        // app.component('a-select', aSelect);
        // CrudCore.componentItems['a-select'] = aSelect;
        app.component('c-action', cAction);
        CrudCore.componentItems['c-action'] = cAction;
    },
    aBase,cAction
}
