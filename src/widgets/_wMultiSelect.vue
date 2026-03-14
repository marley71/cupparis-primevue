
<script>

import _wBase from "./_wBase.vue"

export default {
    name: '_wMultiselect',
    extends : _wBase,
  methods: {
    getMultiSelectLabel(option) {
      return this.domainValues[option];
    },
    removeMultiSelect(option) {
      var id = this.value.indexOf(option);
      this.value.splice(id,1);
      this.change({});
    },
    setDomainValues(domainValues,domainValuesOrder) {
      console.log("DVMS:",domainValues);
      this.domainValues = domainValues;
      let dVO = domainValuesOrder || Object.keys(domainValues);
      let options = [];
      for (var i in dVO) {
          console.log("DVMS2:",dVO[i],domainValues[dVO[i]]);
          options.push({
              code : ""+dVO[i],
              name : domainValues[dVO[i]],
          })
      }
      this.options = options;
    },
    hasFilter() {
      return Boolean(this.has_filter);
    }

  }
}
</script>
