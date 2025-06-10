
<script>

import _wBase from "./_wBase.vue"
import moment from "moment/moment";

export default {
    name: '_wDateText',
    extends : _wBase,
  methods: {
    getFormattedValue() {
      let that = this;
      //return that.translate(that.invalidDateString)
      var md = moment(that.value);
      //console.log('displayFormat',that.displayFormat);
      if (md.isValid()) {
        return md.format(that.displayFormat)
      } else {
        return that.translate(that.invalidDateString); // + '*' ;
      }
    },
  }
}
</script>
