
<script>

import _wBase from "./_wBase.vue"

export default {
    name: '_wAutocomplete',
    extends : _wBase,
  methods: {
    /**
     * ritorna il valore dell'autocomplete in base alla configurazione di labelFields
     * @param event
     * @private
     */
    getAutocompleteLabel(event) {
      let that = this;
      if (that.conf.getAutocompleteLabel) {
        return that.conf.getAutocompleteLabel.apply(this,[event]);
      }

      if (that.labelFields && that.labelFields.length > 0) {
        let label = '';
        for (let i in that.labelFields) {
          label += (event[that.labelFields[i]] || '') + ' ';
        }
        return label;
      }
      if (event.label)
        return event.label;
      return '';
    },

    reset(event) {
      let that = this;
      if (that.conf.reset) {
        return that.conf.reset.apply(this,[event]);
      }
      console.debug('reset w-autocomplete',that.value,that.autocompleteValue,that);
      that.value = null;
      that.autocompleteValue = null;
    },

    search (event) {
      let that = this;
      if (that.conf.search) {
        return that.conf.search.apply(this,[event]);
      }

      if (!that.route) {
        that.route = that.createRoute('autocomplete');
        that.route.setValuesFromObj(that);
      }
      let field = that.autocompleteField?that.autocompleteField:that.name;
      that.route.setParams({
        field : field,
        value : event.query,
        params : that.autocompleteParams,

      });

      console.log('route',that.route,that);
      that.Server.route(that.route,function (json) {
        console.log('json',json);
        that.suggestions = json.result;
      });
      console.log('search',that.conf,event);
    },

    change(event) {
      console.debug('_wAutocomplete.change',event);
      this.value = event.value.id;
      this.referredData = event.value;
      if (this.conf.change) {
        return this.conf.change.apply(this,[event.value]);
      }
    },

    clear(event) {
      this.value = null;
      this.autocompleteValue = null;
      this.change(event);
    },

    itemSelect(event) {
      console.debug('_wAutocomplete.itemSelect',this.autocompleteValue,event);
      this.setValue(this.autocompleteValue.id)
      this.change(event);
    },
  }
}
</script>
