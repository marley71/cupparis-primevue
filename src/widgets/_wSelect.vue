
<script>

import _wBase from "./_wBase.vue"
import CrudCore from '../lib/CrudCore.js';
import CrudVars from '../lib/CrudVars.js';
export default {
    name: '_wSelect',
    extends : _wBase,
    methods: {
        /**
     * aggiunge un elemento usando come configurazione la addConf che può essere stringa (nome modello) o una funzione che restituisce la configurazione
     * @param item elemento da aggiungere
     */
        add() {
            let that = this;
            let conf = that._getAddConf();
            if (!conf) {
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
                        let thatAction = this;
                        console.debug('afterExecute',thatAction.json);
                        thatAction.viewInstance.dialogInstance.hide();

                        if (thatAction.json.result) {
                            
                            let key = thatAction.json.result[that.optionKey];
                            let domainValues = Object.assign({}, that.domainValues);
                            domainValues[key] = thatAction.json.result[that.optionLabel];
                            that.setDomainValues(domainValues);
                            that.value = key;
                            
                            //that.setValue(domainValues[that.optionKey]);

                            // if (thatAction.json.metadata.pk) {
                            // //that.autoCompleteValue = that.json.result;
                            // that.setAutocompleteValue(thatAction.json.result);
                            // that.referredData = thatAction.json.result;
                            // that.value = thatAction.json.metadata.pk;
                            // }
                        
                        }
                    }
                }
            }
            CrudCore.componentDialog('v-insert',conf,that.addDialogConf.title,that.addDialogConf);
        },
        _getAddConf() {
            let that = this;
            if (!that.addConf) {
                return null;
            }
            let conf = null;
            if (typeof that.addConf === 'string') {
                console.debug('addConf',CrudVars.modelConfs);
                let modelNameConf = 'Model' + CrudCore.pascalCase(that.addConf);
                conf = CrudCore.clone(CrudVars.modelConfs[modelNameConf]); // restituisce la configurazione del modello

                if (!conf) {
                CrudCore.alertError('Configurazione del modello (' + modelNameConf + ') non trovata');
                return;
                }
                conf = conf().insert || conf().edit;
                conf.modelName = that.addConf;
            } else if (typeof that.addConf === 'function') {
                conf = that.addConf();
            } else {
                conf = CrudCore.clone(that.addConf);
            }
            if (!conf) {
                CrudCore.alertError('Configurazione di add elemento non valida');
                return;
            }
            return conf;
        }
    }
}
</script>
