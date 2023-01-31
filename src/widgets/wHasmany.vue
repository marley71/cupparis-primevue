<template>
    <template v-if="layout=='list'">
        <v-list-hasmany ref="listView" :conf="getHasmanyList()"></v-list-hasmany>
        <!-- <div class="p-datatable p-component p-datatable-responsive-scroll min-w-full mt-4">
            <div class="p-datatable-header">
                {{ translate(modelName) }}
            </div>
            <div class="p-datatable-wrapper">
                <table role="table" class="p-datatable-table">
                    <thead class="p-datatable-thead" role="rowgroup">
                    <tr role="row">

                        <th class="" role="columnheader">

                        </th>
                        <th v-for="label in getHasmanyLabels()" class="" role="columnheader">
                            {{ label }}
                        </th>
                    </tr>
                    </thead>
                    <tbody class="p-datatable-tbody" role="rowgroup">

                    <v-record v-for="(data,index) in hasmanyValue" :key="index"
                              :conf="getHasmanyConf(index)" :inlist="true" :indexInlist="index"
                              @actionInlist="executeActionInlist">
                    </v-record>
                    </tbody>
                    <tfoot class="mt-3">
                    <div class="p-4">
                        <span class="d-block text-danger text-truncate font-weight-medium" v-if="outOfLimit()">
                        {{ translate('app.limite-raggiunto') }}
                        </span>
                        <button v-else @click="addItem" type="button"
                                class="p-button p-button-sm p-component p-button-outlined">
                            <span>{{ translate('app.aggiungi') }}</span>&nbsp;
                        </button>
                    </div>

                    </tfoot>
                </table>
            </div>
        </div> -->


    </template>
<!--    <template v-else-if="layout=='orderlist'">-->

<!--        <OrderList v-model="value" listStyle="height:auto" dataKey="id">-->
<!--            <template #header>-->
<!--                {{ translate(modelName) }}-->

<!--&lt;!&ndash;                    <th v-for="label in getHasmanyLabels()" class="" role="columnheader">&ndash;&gt;-->
<!--&lt;!&ndash;                        {{ label }}&ndash;&gt;-->
<!--&lt;!&ndash;                    </th>&ndash;&gt;-->

<!--                        <span class="d-block text-danger text-truncate font-weight-medium" v-if="outOfLimit()">-->
<!--                        &lt;!&ndash; Limite massimo raggiunto &ndash;&gt;-->
<!--                        {{ translate('app.limite-raggiunto') }}-->
<!--                        </span>-->
<!--                            <button v-else @click="addItem" type="button"-->
<!--                                    class="p-button p-button-sm p-component p-button-outlined">-->
<!--                                <span>{{ translate('app.aggiungi') }}</span>&nbsp;-->
<!--                            </button>-->
<!--            </template>-->
<!--            <template #item="slotProps">-->
<!--                <div class="p-datatable-wrapper">-->

<!--                        <v-record :key="slotProps.index"-->
<!--                                  :conf="getHasmanyConf(slotProps.index)" :inlist="true" :indexInlist="slotProps.index"-->
<!--                                  @actionInlist="executeActionInlist">-->
<!--                        </v-record>-->
<!--                </div>-->
<!--            </template>-->
<!--        </OrderList>-->

<!--        <div class="p-datatable p-component p-datatable-responsive-scroll min-w-full mt-4">-->
<!--            <div class="p-datatable-header">-->
<!--                {{ translate(modelName) }}-->
<!--            </div>-->
<!--            <div class="p-datatable-wrapper">-->
<!--                <table role="table" class="p-datatable-table">-->
<!--                    <thead class="p-datatable-thead" role="rowgroup">-->
<!--                    <tr role="row">-->

<!--                        <th class="" role="columnheader">-->

<!--                        </th>-->
<!--                        <th v-for="label in getHasmanyLabels()" class="" role="columnheader">-->
<!--                            {{ label }}-->
<!--                        </th>-->
<!--                    </tr>-->
<!--                    </thead>-->
<!--                    <tbody class="p-datatable-tbody" role="rowgroup">-->

<!--                    <v-record v-for="(data,index) in value" :key="index"-->
<!--                              :conf="getHasmanyConf(index)" :inlist="true" :indexInlist="index"-->
<!--                              @actionInlist="executeActionInlist">-->
<!--                    </v-record>-->
<!--                    </tbody>-->
<!--                    <tfoot class="mt-3">-->
<!--                    <div class="p-4">-->
<!--                        <span class="d-block text-danger text-truncate font-weight-medium" v-if="outOfLimit()">-->
<!--                        &lt;!&ndash; Limite massimo raggiunto &ndash;&gt;-->
<!--                        {{ translate('app.limite-raggiunto') }}-->
<!--                        </span>-->
<!--                        <button v-else @click="addItem" type="button"-->
<!--                                class="p-button p-button-sm p-component p-button-outlined">-->
<!--                            <span>{{ translate('app.aggiungi') }}</span>&nbsp;-->
<!--                        </button>-->
<!--                    </div>-->

<!--                    </tfoot>-->
<!--                </table>-->
<!--            </div>-->
<!--        </div>-->


<!--    </template>-->
    <template v-else>
        <Card ref="el">
            <template #header>

            </template>
            <template #title>
                {{ translate(label) }}
            </template>
            <template #content>
                <div class="flex flex-column">
                    <template v-for="(data,index) in hasmanyValue" :key="index">
                        <hr>
                        <div class="flex align-self-end">
                            <Button icon="fa fa-times" @click="removeItem(index)" :label="index"></Button>
                        </div>
                        <v-record :conf="getHasmanyConf(index)"></v-record>
                    </template>
                </div>
            </template>
            <template #footer>
            <span class="d-block text-danger text-truncate font-weight-medium" v-if="outOfLimit()">
                    <!-- Limite massimo raggiunto -->
                    {{ translate('app.limite-raggiunto') }}
                </span>
                <button v-else @click="addItem" type="button"
                        class="p-button p-button-sm p-component p-button-outlined">
                    <span>{{ translate('app.aggiungi') }} lllllll</span>&nbsp;
                </button>
            </template>
        </Card>
    </template>
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
        window.HS = this;
        var that = this;
        let baseName = that.conf.hasmanyConf.modelName?that.conf.hasmanyConf.modelName:that.conf.name;
        console.log('BASENAME',baseName);
        if (!this.conf.hasmanyConf.getFieldName) {
            this.conf.hasmanyConf.getFieldName = (name) => {
                return baseName + '-' + name + '[]';
            }
        }
        this.conf.hasmanyValue = that.trasformValue(that.conf.value);
        return this.conf;
    },
    methods: {
        ready() {

        },
        executeActionInlist(index, action) {
            console.log('ACTIONINLIST::: ', index, action);
            switch (action) {
                case 'delete':
                    this.removeItem(index);
                    return;
                default:
                    return;
            }
        },
        getValue() {
            if (!this.value) {
                return [];
            }
            return this.value;
        },
        setValue(val) {
            let that = this;
            that.value = [];
            setTimeout(function () {
                that.value = val;
            }, 1)

        },
        outOfLimit() {
            if (!this.limit)
                return false;
            return (this.value.length >= this.limit);
        },
        addItem() {
            let that = this;
            let fields = that.hasmanyConf.fields;
            let v = {};
            for (let f in fields) {
                let field = fields[f];
                let fieldConfig = that.hasmanyConf.fieldsConfig[field];
                let defVal = (fieldConfig && fieldConfig.default) ? fieldConfig.default : '';
                v[fields[f]] = defVal;
            }
            v.status = 'created';

            if (this.layout=='list') {
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
            hs.actions = ['action-delete','action-insert'];
            hs.actionsConfig = {
                'action-delete':{
                    execute() {
                        that.removeItem(this.index);
                        //that.value.splice(this.index,1);
                    }
                },
                'action-insert':{
                    
                    execute() {
                        that.addItem();
                    }
                },
            }
            hs.value = that.value;
            //console.log('HS', hs);
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
            if (this.layout == 'list') {
                let v = this.$refs.listView.getValue();
                //console.log('LIST VALUES',v);
                v.splice(index,1);
                that.value = v;
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
                hasmanyValue[ window.performance.now() ] = items[i];
            }
            return hasmanyValue;
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
