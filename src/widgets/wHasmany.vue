<template>
    <template v-if="layout=='list'">

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
    extends : CrudComponent,
    //components : {cView},
    emits:['change'],
    //emits: ['update:modelValue'],
    props: {
        //modelValue: String,
        conf : Object,
    },
    mounted() {
        // evento da emettere durante le modifiche
        //this.$emit('update:modelValue', this.selectedCategory.id);
        setTimeout(this.ready,10);
    },
    data () {
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
        setValue(val) {
            let that = this;
            that.value = [];
            setTimeout(function () {
                that.value = val;
            },1)

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
                v[fields[f]] = '';
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
            console.log('HS',hs);
            return hs;
        },
        removeItem(index) {
            console.log('remove index',index);
            if (index < this.value.length) {
                this.value.splice(parseInt(index),1);
            }
        }
    }
}
</script>

<style scoped>

</style>
