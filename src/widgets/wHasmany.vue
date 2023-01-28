<template>
    <template v-if="layout=='list'">

        <div class="p-datatable p-component p-datatable-responsive-scroll min-w-full mt-4">
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

                    <v-record v-for="(data,index) in value" :key="index"
                              :conf="getHasmanyConf(index)" :inlist="true" :indexInlist="index"
                              @actionInlist="executeActionInlist">
                    </v-record>
                    </tbody>
                    <tfoot class="mt-3">
                    <div class="p-4">
                        <span class="d-block text-danger text-truncate font-weight-medium" v-if="outOfLimit()">
                        <!-- Limite massimo raggiunto -->
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
        </div>


    </template>
    <template v-else>
        <Card ref="el">
            <template #header>

            </template>
            <template #title>
                {{ translate(label) }}
            </template>
            <template #content>
                <div class="flex flex-column">
                    <template v-for="(data,index) in value" :key="index">
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
                    <span>{{ translate('app.aggiungi') }}</span>&nbsp;
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
        var that = this;
        if (!this.conf.hasmanyConf.getFieldName) {
            this.conf.hasmanyConf.getFieldName = (name) => {
                return that.conf.modelName + '-' + name + '[]';
            }
        }
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
            this.value.push(v);
        },
        getHasmanyConf(i) {
            let that = this;
            let hs = CrudCore.clone(that.hasmanyConf);
            hs.routeName = null;
            hs.actions = [];
            hs.value = that.value[i];
            hs.type = 'v-view';
            console.log('HS', hs);
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
            console.log('remove index', index, this.value);
            if (index < this.value.length) {
                this.value.splice(parseInt(index), 1);
            }
            console.log('removed index', index, this.value);
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
