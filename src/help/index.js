import ActionSelect from "./components/ActionSelect.vue";
import InsertEditUser from "./components/InsertEditUser.vue";
import ListUser from "./components/ListUser.vue";
import ManageCustomComponent from "./components/ManageCustomComponent.vue";
import ManageCustomEdit from "./components/ManageCustomEdit.vue";

import CrudCore from "../lib/CrudCore";


export default {
    install (app) {
        app.component('action-select',ActionSelect);
        CrudCore.componentItems['action-select'] = ActionSelect;   // permette la visibilita' anche per le dialog
        app.component('insert-edit-user',InsertEditUser);
        CrudCore.componentItems['insert-edit-user'] = InsertEditUser;
        app.component('list-user',ListUser);
        CrudCore.componentItems['list-user'] = ListUser;
        app.component('manage-custom-component', ManageCustomComponent);
        CrudCore.componentItems['manage-custom-component'] = ManageCustomComponent;
        app.component('manage-custom-edit', ManageCustomEdit);
        CrudCore.componentItems['manage-custom-edit'] = ManageCustomEdit;
    }
}
