
<script>

import _wBase from "./_wBase.vue"
import moment from "moment/moment";
import 'moment/locale/it';
export default {
    name: '_wDateText',
    extends : _wBase,
  methods: {
    getFormattedValue() {
      let that = this;
      //return that.translate(that.invalidDateString)
      moment.locale('it');
      if (that.locale) {
        moment.locale(that.locale);
      }
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
