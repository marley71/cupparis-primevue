
<script>

import _wBase from "./_wBase.vue"

export default {
    name: '_wAutocomplete',
    extends : _wBase,
    mounted() {
      console.log('mounted _wAutocomplete',this.conf);
      if (this.conf.referredData) {
          // let label = 'label'
          // conf.autocompleteValue  = conf.referredData[label]; //conf.referredData;
          this.autocompleteValue = this.__initialValue();
          this.suggestions = [this.conf.referredData];
          console.log('autocompleteValue',this.conf.referredData);
      }
    },  
  methods: {
    __initialValue() {
        let that = this;
        if (that.extraBind['option-label']) {
            if (that.extraBind['option-label'] instanceof  Function) {
                return that.extraBind['option-label'](that.referredData);
            }
            return that.referredData[that.extraBind['option-label']];
        }

        return that.getAutocompleteLabel(that.referredData);

        //console.log('extra bind ',conf.extraBind['option-label'],conf);
        // if (conf.extraBind['option-label']) {
        //     if (conf.extraBind['option-label'] instanceof  Function) {
        //         return conf.extraBind['option-label'](conf.referredData);
        //     }
        //     return conf.referredData[conf.extraBind['option-label']];
        // }

        // return that.getAutocompleteLabel(conf.referredData);


        //return conf.referredData['label'];
    },
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

      //console.log('route',that.route,that);
      that.Server.route(that.route,function (json) {
        console.log('json',json);
        that.suggestions = json.result;
      });
      //console.log('search',that.conf,event);
    },

    change(event) {
      //console.debug('_wAutocomplete.change',event);
      this.value = event.value?event.value.id:null;
      this.referredData = event.value?event.value:null;
      if (this.conf.change) {
        return this.conf.change.apply(this,[this.value]);
      }
    },

    clear(event) {
      this.value = null;
      this.autocompleteValue = null;
      this.change(event);
    },

    itemSelect(event) {
      //console.debug('_wAutocomplete.itemSelect',this.autocompleteValue,event);
      let that = this;
      this.setValue(this.autocompleteValue.id);
      that.change(event);
    },
  }
}
</script>
