<script>
import wBase from './wBase.vue';
import moment from "moment/moment";
export default {
    name: "wDateText",
    extends: wBase,
    methods : {
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

<template src="@templates/widgets/wDateText.html"></template>

<style scoped>

</style>
