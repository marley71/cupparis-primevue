import cImport from "./cImport.vue";
import cManage from "./cManage.vue";
import CrudCore from '@cupparis-lib/lib/CrudCore';

export default {
    install (app) {
        app.component('c-import',cImport);
        CrudCore.componentItems['c-import'] = cImport;
        app.component('c-manage', cManage);
        CrudCore.componentItems['c-manage'] = cManage;
    },
    cImport,cManage
}
