

<script>
import CrudComponent from "../CrudComponent.vue";
// import vBase from "./vBase.vue";
// import vList from "./vList.vue";
// import vListEdit from './vListEdit.vue';
// import vListHasmany from "./vListHasmany.vue";
// import vRecord from "./vRecord.vue";
// import vSearch from "./vSearch.vue";

export default {
    name : "_cView",
    //components: {vBase,vList,vListEdit,vRecord,vSearch,vListHasmany},
    extends: CrudComponent,
    props : ['conf'],
    methods: {
        instance() {
            return this.$refs.vRef;
        }
    }
}
</script>

<style scoped>

</style>
