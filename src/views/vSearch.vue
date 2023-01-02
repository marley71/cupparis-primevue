<script>
import vRecord from './vRecord';

export default {
    name: "vSearch",
    extends: vRecord,
    emits:['search'],
    methods : {
        search() {
            let that = this;
            var formData = that.view.getViewData();
            this.$emit('search',formData)
        },
        getFieldName(field) {
            return 's_' + field;
        },
    }
}
</script>

<style scoped>

</style>
