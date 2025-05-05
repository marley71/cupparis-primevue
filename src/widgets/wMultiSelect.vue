<script>
import wBase from './wBase.vue';
export default {
    name: "wMultiSelect",
    extends: wBase,
    methods : {
        getMultiSelectLabel(option) {
            // console.log('option', option, this.options, this.domainValues);
            return this.domainValues[option];
        },
        removeMultiSelect(option) {
            var id = this.value.indexOf(option);
            this.value.splice(id,1);
        },
    }
}
</script>

<template src="@templates/widgets/wMultiSelect.html"></template>

<style scoped>

</style>
