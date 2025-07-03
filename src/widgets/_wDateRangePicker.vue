
<script>

import _wBase from "./_wBase.vue"
import moment from "moment/moment";

export default {
    name: '_wDateRangePicker',
    extends : _wBase,
    methods : {
        clear(event) {
            console.debug('clear',event)
            if (this.conf.clear) {
                this.conf.clear.apply(this,[event]);
                this.change(event);
                return ;
            }
            this.value = null;
            this.dateValue = null;
            this.change(event);
        },
        change(event) {
            console.debug('change',event,this.dateValue,this.value);
            //if (typeof event == "string") {  // se event e' una stringa allora e' il valore della data.. altrimenti e' stato premuto il tasto clear
            //let inputDateFormat = this.inputDateFormat || 'YYYY-MM-DD';
            //let date = (event && moment(event).isValid()) ? moment(event).format(inputDateFormat) : null;
            // if (date) {
            //     this.value = date;
            // } else {
            //     this.value = null;
            //     this.dateValue = null;
            // }
            let inputDateFormat = this.dateFormat || 'YYYY-MM-DD';
            if (this.dateValue) {
                let d1 = this.dateValue[0]?moment(this.dateValue[0]).format(inputDateFormat) : null;
                let d2 = this.dateValue[1]?moment(this.dateValue[1]).format(inputDateFormat) : null;
                this.value = [d1,d2];
            }

            if (this.conf.change) {
                return this.conf.change.apply(this,[event])
            }
            //}

        }


        //         case 'w-date-range-picker':
        //             if (type == 'clear') {
        //                 this.value = null;
        //                 this.dateValue = null;
        //             } else if (event) {
        //                 let inputDateFormat = evt.widget.inputDateFormat || 'YYYY-MM-DD';
        //                 if (this.dateValue) {
        //                     let d1 = this.dateValue[0]?moment(this.dateValue[0]).format(inputDateFormat) : null;
        //                     let d2 = this.dateValue[1]?moment(this.dateValue[1]).format(inputDateFormat) : null;
        //                     this.value = [d1,d2];
        //                 }
        //
        //                 // let date = event ? moment(event).format(inputDateFormat) : null;
        //                 // console.log("DATE",date, inputDateFormat,this.dateValue);
        //                 // //var date = new Date();
        //                 // this.value = [date,date];
        //             }
    }
}
</script>
