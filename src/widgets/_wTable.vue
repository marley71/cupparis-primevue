
<script>

import _wBase from "./_wBase.vue"

export default {
    name: '_wTable',
    extends : _wBase,
    methods : {
      getKeys() {
        if (this.value && this.value.length > 0) {
          return Object.keys(this.value[0]);
        }
        return [];
      }
    }
}
</script>
