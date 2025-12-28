
<script>
import Server from "../lib/Server";
import CrudCore from "../lib/CrudCore";
import _vList from './_vList.vue';

export default {
    name: "_vDatafileList",
    extends: _vList,
  mounted() {
    this.load();
  },
}
</script>

<style scoped>

</style>
