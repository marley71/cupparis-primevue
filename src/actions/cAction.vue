<template>
    <template v-if="layout=='simple'">
        <div class="flex p-buttonset border border-round">
            <!-- :style="'width:'+(Object.keys(actions).length * 30)+ 'px'" -->
            <a-base v-for="(action,key) in actions" :key="key" :ref="key" :conf="action"></a-base>
        </div>
    </template>
    <template v-else-if="layout=='buttons'">
        <template v-for="(action,key) in actions" :key="key">
            <a-base  :ref="key" :conf="action" v-if="inWhitelist(key)"></a-base>
        </template>
    </template>
    <template v-else-if="layout=='menubar'">
        <Menubar :model="menubarActions" class="w-full">
            <template v-if="title" #start>
                <span>{{ title }}</span>
            </template>
            <!--                    <template #end>-->
            <!--                        <div v-if="!label" class="col-12">-->
            <!--                            <div class="p-inputgroup">-->
            <!--                                <InputText v-model="newTargetCase" placeholder="Enter target url or id to be added" style="width:300px"/>-->
            <!--                                <Button icon="pi pi-plus" class="p-button-secondary" @click="newTargetInput"/>-->
            <!--                            </div>-->
            <!--                        </div>-->
            <!--                    </template>-->
        </Menubar>
    </template>
    <template v-else>
        <div>
            Layout non riconosciuto
        </div>
    </template>

</template>

<script>
//import WrapperConf from "./WrapperConf";
import CrudComponent from "../CrudComponent.vue";
import ABase from "./aBase.vue";
//import Server from "../lib/Server";

export default {
    name: "c-action",
    components: {ABase},
    extends: CrudComponent,
    props: {
        'conf': Object,
        'layout': {
            type: String,
            default: 'buttons'
        },
        'whitelist': Array,
    },
    data() {
        let that = this;
        that.conf.title = '';
        if (that.layout == 'menubar') {
            that.conf.menubarActions = that.getMenubarActions();
        }
        return that.conf;
    },
    methods: {
        getWhitelist() {
            var that = this;
            if (!that.whitelist) {
                return that.conf.actions ? Object.keys(that.conf.actions)
                    : Object.keys(that.conf);
            }
            return that.whitelist;
        },
        inWhitelist(key) {
            var that = this;
            var whitelist = that.getWhitelist();
            console.log("WHITELISTTTT",whitelist,key,whitelist.includes(key))
            return whitelist.includes(key);
        },
        instance(key) {
            console.log('actions ref', key, this.$refs, this.$refs[key])
            return this.$refs[key][0];
        },
        getMenubarActions() {
            let that = this;
            let items = [];
            for (let name in that.conf) {
                items.push({
                    label: that.translate(that.conf[name].text),
                    icon: that.conf[name].icon,
                    command: () => that.conf[name].execute(),
                    disabled: that.conf[name].disabled,
                    action: name,
                })
            }
            console.log('menubar', items, that.conf);
            return items;
        }
    }
}
</script>

<style scoped>

</style>
