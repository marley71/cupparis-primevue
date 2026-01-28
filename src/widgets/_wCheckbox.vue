
<script>

import _wBase from "./_wBase.vue"

export default {
    name: '_wCheckbox',
    extends : _wBase,
  created() {
    this.setValue(this.value);
  },
  methods: {
    setValue(value) {
      //console.debug('_wBase.setValue',value);
      if (Array.isArray(value)) {
        for (var i in value) {
          value[i] = value[i] + '';
        }
      }
      this.value = value;
    },
  }
}
</script>
