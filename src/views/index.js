import cView from "./cView.vue";
import vBase from "./vBase.vue";
import vList from "./vList.vue";
import vRecord from './vRecord.vue';
import vSearch from './vSearch.vue';

export default {
    install (app) {
        app.component('c-view',cView);
        app.component('v-base', vBase);
        app.component('v-list', vList);
        app.component('v-record', vRecord);
        app.component('v-search', vSearch);
    },
    cView,vBase,vList,vRecord,vSearch
}
