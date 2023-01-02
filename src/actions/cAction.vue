<template>
    <div v-if="layout=='simple'" class="flex p-buttonset border border-1 border-round" :style="'width:'+(Object.keys(actions).length * 30)+ 'px'">
        <a-base v-for="(action,key) in actions" :key="key" :ref="key" :conf="action"></a-base>
    </div>
    <div v-else-if="layout=='buttons'">
        <a-base v-for="(action,key) in actions" :key="key" :ref="key" :conf="action"></a-base>
    </div>
    <div v-else >
        Layout non riconosciuto
    </div>
</template>

<script>
//import WrapperConf from "./WrapperConf";
import CrudComponent from "../CrudComponent.vue";
import ABase from "./aBase.vue";
//import Server from "../lib/Server";

export default {
    name: "c-action",
    components: {ABase},
    extends : CrudComponent,
    props: ['conf','layout'],
    data() {
        let that = this;
        return that.conf;
    },
    methods: {
        instance(key) {
            return this.$refs[key];
        }
    }
}
</script>

<style scoped>

</style>
