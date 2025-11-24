<script>
//import CrudComponent from "../CrudComponent.vue";
import _wBase from './_wBase.vue';
import CrudCore from "../lib/CrudCore";

export default {
    name: "_wHasmany",
    extends: _wBase,
    // emits: ['change'],
    // props: {
    //     conf: Object,
    // },
    data() {
        var that = this;
        let conf = this._loadReactiveData(that.conf);
        conf.hasmanyConf = conf.hasmanyConf || {};
        var baseName = conf.hasmanyConf.modelName?conf.hasmanyConf.modelName:conf.name;
        //console.log('BASENAME',baseName,this.conf);
        if (!conf.hasmanyConf.getFieldName) {
            conf.hasmanyConf.getFieldName = function (name) {
                return baseName + '-' + name + '[]';
            }
        }

        let keys = that._generateArrayKeys();

        //if (that.conf.hasmanyType == 'list') {
            conf.value = that.addDataKeyField(that.conf.value);  // serve per rendere univoco il record della lista per la multiselezione
        //}

        //that.conf.hasmanyValue = that.trasformValue(that.conf.value);
        if (!conf.limit) {
            conf.limit = null;
        }
        conf.hasmanyConf.metadata = conf.relationConf || {};
        conf.vForKeys = keys;
        ///console.debug('hasmany_log',keys);
        return conf;
    },
    methods: {
        toggle(event) {
          this.$refs.op.toggle(event);
        },
        // metodo contenuto nelle views e ci faccio il forward
        resetWidgetsErrors() {
            console.debug('reset widget error hasmany');
            let that = this;
            let nViews = [];
            switch (this.hasmanyType) {
                case 'record':
                    console.debug('record hasmany',that.$refs.recordView)
                    nViews = that.$refs.recordView?that.$refs.recordView:[];  // possono anche non esserci
                    for(let i in nViews) {
                        nViews[i].resetWidgetsErrors();
                    }

                    break;
                default:
                    break;
            }
        },
        // metodo contenuto nelle views e ci faccio il forward
        async validate() {
            let that = this;
            let result = {
                valid : true
            }
            let nViews = [];
            switch (this.hasmanyType) {
                case 'record':
                    nViews = that.$refs.recordView?that.$refs.recordView:[];  // possono anche non esserci
                    console.debug('record hasmany',nViews.length,that.$refs.recordView)
                    for(let i in nViews) {
                        console.debug('record hasmany prima validate')
                        let res = await nViews[i].validate();
                        result.valid = result.valid && res;
                        console.debug('hasmany validate',res)
                    }
                    break;
                default:
                    break;
            }
            console.debug('hasmany return ',result);
            return result;
        },
        getRules() {
            return [];
        },
        executeActionInlist(index, action) {
            //console.log('ACTIONINLIST::: ', index, action);
            switch (action) {
                case 'delete':
                    this.removeItem(index);
                    return;
                default:
                    return;
            }
        },
        getValue() {
            //window.WH = this;
            if (this.hasmanyType == 'list') {
                return this.$refs.listViewHasmany.getValue();
            }
            let val = [];
            if (this.$refs.recordView) {
                for (let i=0;i<this.$refs.recordView.length;i++) {
                    let v = this.$refs.recordView[i].getValue();
                    val.push(this.$refs.recordView[i].getValue());
                }
            }
            return val;
        },
        setValue(val) {
            let that = this;
            that.value = [];
            that.value = val;

            setTimeout(function () {
                if (that.hasmanyType == 'list') {
                    //console.log("HS",that.value)
                    that.value = that.addDataKeyField(that.value);
                    that.$refs.listViewHasmany.value = that.value;
                    that.$refs.listViewHasmany.reload();
                } else {
                    let keys = that._generateArrayKeys(val);
                    that.vForKeys = keys;
                    that.value = that.addDataKeyField(that.value);
                    //that.hasmanyValue = that.value;
                    //that.hasmanyValue = that.trasformValue(that.value);
                }

            }, 1)

        },
        outOfLimit() {
            if (!this.limit)
                return false;
            return (this.value.length >= this.limit);
        },
        outOfLimitMessage() {
            return this.limitMessage || this.translate('app.limite-raggiunto');
        },
        addItem() {
            let that = this;

            let fields = that.hasmanyConf.fields;
            //let fieldsConfig = CrudCore.clone(that.hasmanyConf.fieldsConfig);
            let v = {};
            let fieldsConfig = {};
            console.debug('hasmany fields',fields);
            for (let f in fields) {
                let field = fields[f];
                let fieldConfig = that.hasmanyConf.fieldsConfig[field];
                let defVal = (fieldConfig && (fieldConfig.default || fieldConfig.default === 0)) ? fieldConfig.default : '';
                v[fields[f]] = defVal;
                v.dataKey = that._getRandomKey()
                let md = that.hasmanyConf.modelData || {};
                if (that.hasmanyType=='list') {
                    fieldsConfig[field] = this.$refs.listViewHasmany.getWidgetConfig(field, defVal, (md[field] || {}))
                } else {
                    fieldsConfig[field] = CrudCore.clone(fieldConfig);
                }
            }
            v.status = 'created';

            if (that.hasmanyType=='list') {
                // in caso di widget complessi e' importante salvaguardare i widgets gia' esistenti.
                that.widgetToConf();
                let val = that.getValue();
                val.push(v);
                that.setValue(val);
                that.$refs.listViewHasmany.widgetsConfig.push(fieldsConfig);

            } else {
                let val = that.getValue();
                val.push(v);
                that.vForKeys.push(that._getRandomKey());
                console.debug('hasmany_log ',val);
                that.value = val;
                //that.setValue(val);
            }



        },
        removeItem(index) {
            let that = this;
            console.debug('wHasmany.removeItem',index);
            if (this.hasmanyType == 'list') {
                // prendiamo i valori aggiornati il lista insieme alle configurazioni;
                //let fieldsConfig = CrudCore.clone(that.hasmanyConf.fieldsConfig);
                //let values = that.$refs.listViewHasmany.getValue();
                that.widgetToConf();
                //console.debug('wHasmany.removeItem current values',values);
                if (Array.isArray(index)) {
                    let arr = index.sort((a,b) => {return a-b});
                    arr.reverse();
                    for (let i in arr) {
                        that.$refs.listViewHasmany.widgetsConfig.splice(arr[i],1);
                        that.$refs.listViewHasmany.value.splice(arr[i],1);

                        //console.debug('LIST VALUES',arr[i],JSON.parse(JSON.stringify(v)));
                    }
                } else {
                    that.$refs.listViewHasmany.widgetsConfig.splice(index,1);
                    that.$refs.listViewHasmany.value.splice(index,1);

                }
                that.$refs.listViewHasmany.deselectAll();
            } else {
                console.debug('hasmany_log remove',index)
                let viewVal = that.getValue();  // prendo i valori aggiornati delle views
                let val = [];
                let keys = [];
                for (let i in that.vForKeys) {
                    if (that.vForKeys[i] != index) {
                        val.push(viewVal[i]);
                        keys.push(that.vForKeys[i]);
                    }
                }

                that.value = val;
                    that.vForKeys = keys;
            }

        },
        /**
         * trasferisce i dati dall'istanza del widget alla configurazione, in modo da poter ricostruire i widgets attuali quando
         * vengono ridisegnati
         */
        widgetToConf() {
            for (let i=0;i<this.$refs.listViewHasmany.value.length;i++) {
                let ws = this.$refs.listViewHasmany.getRowWidgets(i);
                for (let k in ws) {
                    switch (ws[k].type) {
                        case 'w-autocomplete':
                            console.debug('autocompleteValue',ws[k].autocompleteValue);
                            this.$refs.listViewHasmany.widgetsConfig[i][k].autocompleteValue = ws[k].autocompleteValue;
                            break;
                    }
                    this.$refs.listViewHasmany.value[i][k] = ws[k].getValue()
                }
            }
        },
        getHasmanyConf(i) {
            let that = this;
            let hs = CrudCore.clone(that.hasmanyConf);
            hs.routeName = null;
            hs.actions = [];
            //hs.value = that.hasmanyValue[i];
            hs.value = that.value[i];
            hs.type = 'v-view';
            //console.log('HS', hs);
            return hs;
        },
        getHasmanyList() {
            let that = this;
            let hs = CrudCore.clone(that.hasmanyConf);
            console.debug('hasmany conf ',hs);
            hs.type = 'v-list-hasmany'
            hs.routeName = null;
            hs.actions = hs.actions || ['action-delete','action-insert'];
            hs.actionsConfig = {
                'action-delete':{
                    actionType : 'record',
                    execute() {
                        that.removeItem(this.index);

                    }
                },
                'action-delete-selected':{
                    execute() {
                        let indexs = [];
                        let dataKeys = that.$refs.listViewHasmany.value.map(a => a.dataKey);
                        for (let i in that.$refs.listViewHasmany.selected) {
                            let index = dataKeys.indexOf(that.$refs.listViewHasmany.selected[i].dataKey);
                            if (index < 0) {
                                console.warn('index non trovato per dataKey',that.$refs.listViewHasmany.selected[i].dataKey,'datakeys',dataKeys);
                            } else {
                                indexs.push(index);
                            }
                        }
                        that.removeItem(indexs);

                    }
                },
                'action-insert':{
                    disabled() {
                        if (that.limit) {
                            return that.value.length >= that.limit
                        }
                        return false;
                    },
                    execute() {
                        that.addItem();
                    }
                },
            }
            hs.value = that.value;
            console.debug('HS', hs);
            return hs;
        },
        getHasmanyLabels() {

            let that = this;
            let hs = that.hasmanyConf;
            let labels = [];
            for (let i in hs.fields) {
                let field = hs.fields[i];
                let fieldConfig = hs.fieldsConfig[field];
                if (fieldConfig && fieldConfig.type === 'w-hidden') {
                    continue;
                }
                let label = hs.fields[i];
                if (fieldConfig && fieldConfig.label) {
                    label = fieldConfig.label;
                }

                labels.push(label);
            }
            return labels;

        },

        // trasformValue(value) {
        //     let hasmanyValue = [];
        //     let items = value || [];
        //     for(let i in items) {
        //         //hasmanyValue[ window.performance.now() + "--" + i] = items[i];
        //         hasmanyValue.push(items[i])
        //     }
        //     return hasmanyValue;//Object.values(hasmanyValue);
        // },
        hasDisplayTitle() {
            return this.displayTitle !== false;
        },
        getHasmanyWidgetConf(index,field) {
            let that = this;
            let fieldsConfig = that.hasmanyConf.fieldsConfig || {};
            let conf = fieldsConfig[field] || { type : 'w-text'};
            conf.value = that.value[index][field]; // that.hasmanyValue[index][field];
            if (!conf.height) {
                conf.height = '30';
            }
            //console.debug('getHasmanyWidgetConf',conf);
            return conf;
        },
      getWidgetType(index,field) {
        let that = this;
        let fieldsConfig = that.hasmanyConf.fieldsConfig || {};
        let conf = fieldsConfig[field] || { type : 'w-text'};
        conf.value = that.value[index][field]; // that.hasmanyValue[index][field];
        return conf.type;
      },
        addDataKeyField(values) {
            for (let i in values) {
                if (!values[i].dataKey) {
                    values[i].dataKey = this._getRandomKey()
                }

            }
            return values;
        },

        /**
         * metoto utilizzato da w-hasmany con modalità panel dove non abbiamo il concetto di widget
         * per permettere di fare colonne custom
         * @param column
         * @private
         */
        _getColumnValue(index,field) {
            if (this.getColumnValue) {
                return this.getColumnValue.apply(this,[index,field]);
            }
           return this.value[index][field];  // this.hasmanyValue[index][field];
        },
        /**
         * ritorna una key random per il ciclo for sui valori dei hasmany record per poter far funzionare la delete
         * @returns {string}
         * @private
         */
        _getRandomKey() {
            return parseInt(window.performance.now()) + '_' + Math.floor(Math.random() * 100000);
        },
        /**
         * genera il vettore delle keys per la gestione del ciclo v-for in modalita' record
         * @private
         */
        _generateArrayKeys(val) {
            let keys = [];
            let values = this.conf.value || [];
            if (val) {
                values = val;
            }

            for (let i in values) {
                keys.push(this._getRandomKey());
            }
            return keys;
        },
        /**
         * ritorna i fields visibili in modalita' panel
         * @private
         */
        _getPanelFields() {
            let that = this;
            let hs = that.hasmanyConf;
            let fields = [];
            for (let i in hs.fields) {
                let field = hs.fields[i];
                let fieldConfig = hs.fieldsConfig[field];
                if (fieldConfig && fieldConfig.type === 'w-hidden') {
                    continue;
                }
                fields.push(field);
            }
            return fields;
        },
        _getFieldLabel(field) {

            let that = this;
            let hs = that.hasmanyConf;
            for (let i in hs.fields) {
                let f = hs.fields[i];
                if (f != field) {
                    continue;
                }
                let fieldConfig = hs.fieldsConfig[f];
                if (fieldConfig && fieldConfig.type === 'w-hidden') {
                    continue;
                }
                let label = hs.fields[i];
                if (fieldConfig && fieldConfig.label) {
                    label = fieldConfig.label;
                    return label;
                }
                let mN = hs.modelName?hs.modelName+'.':'';
                label = CrudCore.translate(mN + "fields."+field+".label")
                return  label;

            }
            return 'not found';

        },

    }
}
</script>

<style lang="scss" scoped>
.p-datatable-thead > tr > th {
    font-weight: bold;
    text-align: center;
    background-color: white;
    border-top: 1px solid var(--primary-400)
}

.p-datatable-header {
    border-top: 1px solid var(--primary-400);
    text-align: center;
    background-color: white;

}
</style>
<script setup>
</script>
