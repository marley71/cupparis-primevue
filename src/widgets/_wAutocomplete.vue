
<script>

import _wBase from "./_wBase.vue"
import CrudHelpers from "../lib/CrudHelpers"
import CrudCore from "../lib/CrudCore"
import CrudVars from "../lib/CrudVars"

export default {
    name: '_wAutocomplete',
    extends : _wBase,
    mounted() {
      //console.log('mounted _wAutocomplete',this.conf);
      if (this.conf.referredData) {
          // let label = 'label'
          // conf.autocompleteValue  = conf.referredData[label]; //conf.referredData;
          this.autocompleteValue = this.__initialValue();
          this.suggestions = [this.conf.referredData];
          //console.log('autocompleteValue',this.conf.referredData);
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
          if (event && Object.keys(event).length > 0) {
            //console.debug('event',event,that.labelFields[i]);
            label += CrudHelpers.getByDot(event,that.labelFields[i]) + (i < that.labelFields.length - 1 ? that.separator : ''); // (event[that.labelFields[i]] || '') + ' ';
          }
        }
        //console.debug('label',label);
        return label.trim();
      }
      return '';
    },

    reset(event) {
      let that = this;
      if (that.conf.reset) {
        return that.conf.reset.apply(this,[event]);
      }
      //console.debug('reset w-autocomplete',that.value,that.autocompleteValue,that);
      that.value = null;
      that.autocompleteValue = null;
    },
    /**
     * metodo eseguito prima della ricerca
     * @param event evento di ricerca
     * @returns event evento di ricerca
     */
    beforeSearch(event) {
      let that = this;
      if (that.conf.beforeSearch) {
        return that.conf.beforeSearch.apply(this,[event]);
      }
      return event;
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
      event = that.beforeSearch(event);
      //console.log('route',that.route,that);
      that.Server.route(that.route,function (json) {
        console.log('json',json);
        that.suggestions = json.result;
        event = that.afterSearch(event);
      });
      //console.log('search',that.conf,event);
    },
    /**
     * metodo eseguito dopo la ricerca
     * @param event evento di ricerca
     * @returns event evento di ricerca
     */
    afterSearch(event) {
      let that = this;
      if (that.conf.afterSearch) {
        return that.conf.afterSearch.apply(this,[event]);
      }
      return event;
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

    setAutocompleteValue(autocompleteValue) {
      let that = this;
      that.autocompleteValue = autocompleteValue;
      this.itemSelect({
        value : autocompleteValue
      })
    },
    /**
     * aggiunge un elemento usando come configurazione la addConf che può essere stringa (nome modello) o una funzione che restituisce la configurazione
     * @param item elemento da aggiungere
     */
    add() {
      let that = this;
      let conf = null;
      if (that.addConf) {
        if (typeof that.addConf === 'string') {
          console.debug('addConf',CrudVars.modelConfs);
          
          let modelNameConf = 'Model' + that.addConf.charAt(0).toUpperCase() +  CrudCore.camelCase(that.addConf).slice(1); //   that.addConf.charAt(0).toUpperCase() + that.addConf.slice(1);
          conf = CrudCore.clone(CrudVars.modelConfs[modelNameConf]); // restituisce la configurazione del modello
          if (!conf) {
            CrudCore.alertError('Configurazione del modello (' + modelNameConf + ') non trovata');
            return;
          }
          conf.modelName = that.addConf;
        } else if (typeof that.addConf === 'function') {
          conf = that.addConf();
        } else {
          conf = CrudCore.clone(that.addConf);
        }
        
      }
      if (!conf) {
        CrudCore.alertError('Configurazione di add elemento non valida');
        return;
      }
      // impostazioni di default per la popup di inserimento per tutti i campi che hanno un specie di popup
      for (let field in conf.fieldsConfig) {
        if (['date','datetime','time','select','checkbox'].includes(conf.fieldsConfig[field].type)) {
          conf.fieldsConfig[field].inPopup = true;
        }
      }
      conf.type = 'v-insert';
      conf.actions = ['action-save'];
      conf.actionsConfig = {
          'action-save': {
              afterExecute() {
                  let that = this;
                  console.debug('afterExecute');
                  that.viewInstance.dialogInstance.hide();
                  if (that.json.result && that.json.result.id) {
                    that.autoCompleteValue = that.json.result;
                    that.referredData = that.json.result;
                    that.value = that.json.result.id;
                  }
              }
          }
      }
      CrudCore.componentDialog('v-insert',conf,that.addDialogConf.title,that.addDialogConf);
    }
  }
}
</script>
