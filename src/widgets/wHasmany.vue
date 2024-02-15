<template>
    <template v-if="hasmanyType=='list'">
        <div>
            <v-list-hasmany ref="listView" :conf="getHasmanyList()"></v-list-hasmany>
        </div>
    </template>
    <template v-else-if="hasmanyType=='record'">
        <Card ref="el" class="mb-3">
            <template #header>

            </template>
            <template #title v-if="hasDisplayTitle()">
                {{ translate(label) }}
            </template>
            <template #content>
                <div class="flex flex-column">
                    <template v-for="(data,index) in hasmanyValue" :key="index">
                        <div class="flex align-self-end">
                            <Button class="p-button-outlined p-button-danger" icon="fa fa-times" @click="removeItem(index)"></Button>
                        </div>
                        <v-record ref="recordView" :conf="getHasmanyConf(index)"></v-record>
                    </template>
                </div>
            </template>
            <template #footer>
                <template v-if="outOfLimit()">

                <span class="d-block text-primary text-truncate font-weight-medium" v-if="outOfLimitMessage()">
                        <!-- Limite massimo raggiunto -->
                        {{ outOfLimitMessage() }}
                    </span>
                </template>
                <button v-else @click="addItem" type="button"
                        class="p-button p-button-sm p-component p-button-outlined justify-content-center">
                    <span>{{ translate('app.aggiungi') }}</span>&nbsp;
                </button>
            </template>
        </Card>
    </template>
    <template v-else-if="hasmanyType=='view-only'">
        <template v-for="(data,index) in hasmanyValue" :key="index">
            <div v-for="field in getHasmanyConf(index).fields" :key="index">
                <c-widget :conf="getHasmanyWidgetConf(index,field)"></c-widget>
            </div>
        </template>
    </template>
    <div v-else>
        <span>hasmanyType {{ hasmanyType }} non valido!</span>
    </div>
</template>

<script>
import CrudComponent from "../CrudComponent.vue";
import CrudCore from "../lib/CrudCore";
//import cView from '../views/cView.vue'

export default {
    name: "wHasmany",
    extends: CrudComponent,
    //components : {cView},
    emits: ['change'],
    //emits: ['update:modelValue'],
    props: {
        //modelValue: String,
        conf: Object,
    },
    mounted() {
        // evento da emettere durante le modifiche
        //this.$emit('update:modelValue', this.selectedCategory.id);
        setTimeout(this.ready, 10);
    },
    data() {
        var that = this;
        var baseName = that.conf.hasmanyConf.modelName?that.conf.hasmanyConf.modelName:that.conf.name;
        //console.log('BASENAME',baseName,this.conf);
        if (!that.conf.hasmanyConf.getFieldName) {
            that.conf.hasmanyConf.getFieldName = function (name) {
                return baseName + '-' + name + '[]';
            }
        }
        if (that.conf.hasmanyType == 'list') {
            that.conf.value = that.addDataKeyField(that.conf.value);  // serve per rendere univoco il record della lista per la multiselezione
        }

        that.conf.hasmanyValue = that.trasformValue(that.conf.value);
        if (!this.conf.limit) {
            that.conf.limit = null;
        }
        that.conf.hasmanyConf.metadata = that.conf.relationConf || {};
        return that.conf;
    },
    methods: {
        ready() {

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
                return this.$refs.listView.getValue();
            }
            let val = [];
            if (this.$refs.recordView) {
                for (let i=0;i<this.$refs.recordView.length;i++) {
                    val.push(this.$refs.recordView[i].getValue());
                }
            }
            return val;
            // if (!this.value) {
            //     return [];
            // }
            // return this.value;
        },
        setValue(val) {
            let that = this;
            that.value = [];
            that.value = val;

            setTimeout(function () {
                if (that.hasmanyType == 'list') {
                    //console.log("HS",that.value)
                    that.value = that.addDataKeyField(that.value);
                    that.$refs.listView.value = that.value;
                    that.$refs.listView.reload();
                } else {
                    that.hasmanyValue = that.trasformValue(that.value);
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
            let v = {};
            for (let f in fields) {
                let field = fields[f];
                let fieldConfig = that.hasmanyConf.fieldsConfig[field];
                let defVal = (fieldConfig && (fieldConfig.default || fieldConfig.default === 0)) ? fieldConfig.default : '';
                v[fields[f]] = defVal;
            }
            v.status = 'created';

            if (this.hasmanyType=='list') {
                v.dataKey = window.performance.now();
                this.value.push(v);
                this.$refs.listView.reload();
            } else {
                this.value.push(v);
                this.hasmanyValue[window.performance.now()] = v;
            }



        },
        getHasmanyConf(i) {
            let that = this;
            let hs = CrudCore.clone(that.hasmanyConf);
            hs.routeName = null;
            hs.actions = [];
            hs.value = that.hasmanyValue[i];
            hs.type = 'v-view';
            //console.log('HS', hs);
            return hs;
        },
        getHasmanyList() {
            let that = this;
            let hs = CrudCore.clone(that.hasmanyConf);
            hs.type = 'v-list-hasmany'
            hs.routeName = null;
            hs.actions = hs.actions || ['action-delete','action-insert'];
            hs.actionsConfig = {
                'action-delete':{
                    execute() {
                        that.removeItem(this.index);

                    }
                },
                'action-delete-selected':{
                    execute() {
                        //console.debug('selected',that.$refs.listView.selected,that.$refs.listView.value);
                        let indexs = [];
                        let dataKeys = that.$refs.listView.value.map(a => a.dataKey);
                        for (let i in that.$refs.listView.selected) {
                            let index = dataKeys.indexOf(that.$refs.listView.selected[i].dataKey);
                            if (index < 0) {
                                console.warn('index non trovato per dataKey',that.$refs.listView.selected[i].dataKey,'datakeys',dataKeys);
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
        removeItem(index) {
            let that = this;
            if (this.hasmanyType == 'list') {
                let v = this.$refs.listView.getValue();
                //console.debug('LIST VALUES',JSON.parse(JSON.stringify(v)),index);
                if (Array.isArray(index)) {
                    let arr = index.sort((a,b) => {return a-b});
                    arr.reverse();
                    for (let i in arr) {
                        v.splice(arr[i],1);
                        //console.debug('LIST VALUES',arr[i],JSON.parse(JSON.stringify(v)));
                    }
                } else {
                    v.splice(index,1);
                }
                that.value = that.addDataKeyField(v);
                //console.debug('LIST VALUES  2',JSON.parse(JSON.stringify(that.value)));
                this.$refs.listView.value = that.value;
                this.$refs.listView.reload();
            } else {
                let rIndex = Object.keys(this.hasmanyValue).indexOf(index);
                //console.log('remove index', index, this.value);
                if (rIndex < this.value.length) {
                    this.value.splice(parseInt(rIndex), 1);
                }
                //console.log('removed index', rIndex, this.value);
                delete this.hasmanyValue[index];
                //this.hasmanyValue = this.trasformValue(this.value);
            }

        },
        trasformValue(value) {
            let hasmanyValue = {};
            let items = value || [];
            for(let i in items) {
                hasmanyValue[ window.performance.now() + "--" + i] = items[i];
            }
            return hasmanyValue;//Object.values(hasmanyValue);
        },
        hasDisplayTitle() {
            return this.displayTitle !== false;
        },
        getHasmanyWidgetConf(index,field) {
            let that = this;
            let fieldsConfig = that.hasmanyConf.fieldsConfig || {};
            let conf = fieldsConfig[field] || { type : 'w-text'};
            conf.value = that.hasmanyValue[index][field];
            if (!conf.height) {
                conf.height = '30';
            }
            console.debug('getHasmanyWidgetConf',conf);
            return conf;
        },
        addDataKeyField(values) {
            for (let i in values) {
                values[i].dataKey = window.performance.now() + '_' + Math.floor(Math.random() * 100000);
            }
            return values;
        }
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
