import CrudCore from "./CrudCore";
import CrudComponent from "../CrudComponent.vue";
import cAction from "../dist_base/actions/cAction.vue";

export default {
    install (app) {
        app.component('crud-component',CrudComponent);
        CrudCore.componentItems['crud-component'] = CrudComponent;

        app.component('c-action',cAction);
        CrudCore.componentItems['c-action'] = cAction;

        // app.component('a-base',aBase);
        // CrudCore.componentItems['a-base'] = aBase;

        // app.component('w-base',wBase);
        // CrudCore.componentItems['w-base'] =  wBase;
    }
}



