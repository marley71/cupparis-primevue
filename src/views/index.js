import cView from "./cView.vue";
import vBase from "./vBase.vue";
import vList from "./vList.vue";
import vListEdit from './vListEdit.vue'
import vRecord from './vRecord.vue';
import vSearch from './vSearch.vue';

export default {
    install (app) {
        app.component('c-view',cView);
        app.component('v-base', vBase);
        app.component('v-list', vList);
        app.component('v-record', vRecord);
        app.component('v-search', vSearch);
        app.component('v-list-edit',vListEdit)
    },
    cView,vBase,vList,vListEdit,vRecord,vSearch
}
