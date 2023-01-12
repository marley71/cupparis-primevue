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
                        <div>gg</div>
<!--                        <v-record :conf="getHasmanyConf(index)"></v-record>-->
                    </template>
                    <div class="" v-for="(item,index) in confViews" v-show="showItem(item.cRef)" :key="index">
                        <div class="card m-2 border-round-lg border-1">
                            <!--<div class="card-header" crud-hasmany_title>-->
                            <!--{{cConf.metadata.modelName}}-->
                            <!--</div>-->
                            <div class="flex justify-content-end">
                                <button v-on:click="deleteItem(item.cRef)" class="p-button p-button-sm p-button-outlined p-button-danger p-2"
                                        type="button" title="Cancella elemento"><i class="fa fa-trash"></i>
                                </button>
                            </div>
                            <div class="card-body p-1 ">
                                <v-hasmany :c-model="name" :c-conf="item"></v-hasmany>
                            </div>
                        </div>
                    </div>
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

export default {
    name: "wHasmany",
    extends : CrudComponent,
    //components : {VRecord, cView},
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
        return this.conf;
    },
    methods: {
        ready() {

        },
        outOfLimit() {
            return false;
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
            let hs = that.hasmanyConf;
            hs.routeName = null;
            hs.actions = [];
            hs.value = that.value[i];
            hs.type = 'v-edit';
            console.log('HS',hs);
            return hs;
        }
    }
}
</script>

<style scoped>

</style>
