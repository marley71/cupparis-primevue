
<script>

import _wBase from "./_wBase.vue"
import moment from 'moment'

export default {
    name: '_wDatePicker',
    extends : _wBase,
    methods: {
        clear(event) {
            console.debug('clear',event)
            if (this.conf.clear) {
                this.conf.clear.apply(this,[event]);
                this.change(event);
                return ;
            }
            this.value = null;
            this.dateValue = null;
            this.change(null);
        },
        change(event) {
            //console.debug(event.value,'change',event,(typeof event));
            //if (typeof event == "string") {  // se event e' una stringa allora e' il valore della data.. altrimenti e' stato premuto il tasto clear
            if (event) {
                let inputDateFormat = this.dateFormat || 'YYYY-MM-DD';
                let date = (event && moment(event).isValid()) ? moment(event).format(inputDateFormat) : null;
                if (date) {
                    this.value = date;
                } else {
                    this.value = null;
                    this.dateValue = null;
                }
            } else {
                this.value = null;
                this.dateValue = null;
            } 
            if (this.conf.change) {
                return this.conf.change.apply(this,[event])
            }

        }
    }
}
</script>
