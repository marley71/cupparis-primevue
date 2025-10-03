<template>
    <template v-if="layout==='simple'">
        <div class="inline-flex shadow rounded-lg overflow-hidden">
            <a-base v-for="(action,key) in actions" :key="key" :ref="key" :conf="getConf(action,key)"></a-base>
        </div>
    </template>
    <template v-else-if="layout==='buttons'">
        <div class="flex">
            <template v-for="(action,key) in getActions()" :key="key">
                <a-base :ref="key" :conf="getConf(action,key)" v-if="inWhitelist(key)"></a-base>
            </template>
        </div>
    </template>
    <template v-else-if="layout==='menubar'">
        <Menubar :model="menubarActions" class="w-full text-left">
            <template v-if="title" #start>
                <span>{{ title }}</span>
            </template>
            <template #item="{ item, root }">
                <a-base v-if="!root" :ref="item.action" :conf="getConf(item,item.action)"></a-base>
                <div v-else class="cursor-pointer p-1">
                    {{ item.label }}&nbsp;<i class="fa fa-angle-down"></i>
                </div>
            </template>
        </Menubar>
    </template>
    <template v-else>
        <div>
            {{layout}} : Layout non riconosciuto
        </div>
    </template>

</template>

<script>

import ABase from "./aBase.vue";
import _cAction from "@cupparis-lib/actions/_cAction.vue";

export default {
    name: "c-action",
    components: {ABase},
    extends: _cAction,
}
</script>

<style scoped>

</style>
