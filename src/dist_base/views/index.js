import cView from "./cView.vue";
import vBase from "./vBase.vue";
import vList from "./vList.vue";
import vListEdit from './vListEdit.vue'
import vRecord from './vRecord.vue';
import vInsert from './vInsert.vue';
import vEdit from './vEdit.vue';
import vView from './vView.vue';
import vSearch from './vSearch.vue';
import vListHasmany from './vListHasmany.vue';

export default {
    install (app) {
        app.component('c-view',cView);
        app.component('v-base', vBase);
        app.component('v-list', vList);
        app.component('v-record', vRecord);
        app.component('v-insert', vInsert);
        app.component('v-edit', vEdit);
        app.component('v-view', vView);
        app.component('v-search', vSearch);
        app.component('v-list-edit',vListEdit);
        app.component('v-list-hasmany',vListHasmany);
    },
    cView,vBase,vList,vListEdit,vRecord,vSearch,vListHasmany,vInsert,vEdit,vView
}
