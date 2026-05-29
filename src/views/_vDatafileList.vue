
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
  methods: {
    isRowSelectable(rowData) {
    return !rowData.has_errors; // la tua condizione
  },
  isRowSelected(rowData) {
    if (this.selectionMode === 'multiple') {
      return (this.selected || []).some(r => r.id === rowData.id);
    }
    return this.selected?.id === rowData.id;
  },
  toggleRowSelection(rowData, checked) {
    if (this.selectionMode === 'multiple') {
      const selected = [...(this.selected || [])];
      const idx = selected.findIndex(r => r.id === rowData.id);
      if (checked && idx === -1) selected.push(rowData);
      if (!checked && idx !== -1) selected.splice(idx, 1);
      this.selected = selected;
    } else {
      this.selected = checked ? rowData : null;
    }
  },
  }
}
</script>

<style scoped>

</style>
