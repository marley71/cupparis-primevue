<script>
import wBase from './wBase.vue';
export default {
    name: "wAutocomplete",
    extends: wBase,
    methods: {
        /**
         * ritorna il valore dell'autocomplete in base alla configurazione di labelFields
         * @param event
         * @private
         */
        _getAutocompleteLabel(event) {
            return this.getAutocompleteLabel.apply(this,[event]);
        },
        itemSelect() {
            this.setValue(this.autocompleteValue.id)
        },
    }
}
</script>

<template src="@templates/widgets/wAutocomplete.html"></template>

<style scoped>

</style>
