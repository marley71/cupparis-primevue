<script>

import CrudComponent from "../CrudComponent.vue";
import moment from "moment/moment";
export default {
    name: "_wBase",
    extends : CrudComponent,
    methods : {
        _ready() {
            if (this.ready) {
                this.ready.apply(this);
            }
        },
        _change(event, type) {
            let that = this;
            let evt = event || {};
            evt.widget = this;
            switch (this.type) {
                case 'w-autocomplete':
                    if (type == 'clear') {
                        this.value = null;
                        this.autocompleteValue = null;
                    } else if (event) {
                        this.value = event.id;
                        this.referredData = event;
                    }
                    break;
                case 'w-date-picker':
                    if (type == 'clear') {
                        this.value = null;
                        this.dateValue = null;
                    } else if (event) {
                        let inputDateFormat = evt.widget.inputDateFormat || 'YYYY-MM-DD';
                        let date = event ? moment(event).format(inputDateFormat) : null;
                        //console.log("DATE",date, inputDateFormat)
                        //var date = new Date();
                        this.value = date;
                    }
                    break;
                case 'w-date-range-picker':
                    if (type == 'clear') {
                        this.value = null;
                        this.dateValue = null;
                    } else if (event) {
                        let inputDateFormat = evt.widget.inputDateFormat || 'YYYY-MM-DD';
                        if (this.dateValue) {
                            let d1 = this.dateValue[0]?moment(this.dateValue[0]).format(inputDateFormat) : null;
                            let d2 = this.dateValue[1]?moment(this.dateValue[1]).format(inputDateFormat) : null;
                            this.value = [d1,d2];
                        }

                        // let date = event ? moment(event).format(inputDateFormat) : null;
                        // console.log("DATE",date, inputDateFormat,this.dateValue);
                        // //var date = new Date();
                        // this.value = [date,date];
                    }
                    break;
                default:
                    break;
            }
            this.$emit('change', evt);
            if (this.change) {
                setTimeout(function () {
                    that.change(evt);
                },10)
            }

        },
        getValue() {
            let that = this;
            switch (that.conf.type) {
                case 'w-hasmany':
                    return that.$refs.wRef.getValue();
                default:
                    return that.value;
            }

        },
    }
}
</script>

