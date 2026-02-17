<template>
    <template v-if="layout==='simple'">
        <div class="inline-flex rounded-lg overflow-hidden gap-1">
            <a-base v-for="(action,key) in actions" :key="key" :ref="key" :conf="getConf(action,key)"></a-base>
        </div>
    </template>
    <template v-else-if="layout==='buttons'">
        <ButtonGroup>
            <template v-for="(action,key) in getActions()" :key="key">
                <a-base :ref="key" :conf="getConf(action,key)" v-if="inWhitelist(key)"></a-base>
            </template>
        </ButtonGroup>
    </template>
    <template v-else-if="layout==='menubar'">
        <div class="card flex justify-center">
            <Button class="p-button-sm" type="button" icon="fa fa-list" @click="$refs['menuRef' + rowIndex].toggle($event)" aria-haspopup="true" aria-controls="overlay_menu" :label="menubarTitle"/>
            <Menu :ref="'menuRef' + rowIndex" :model="menubarActions" :popup="true">
                <template #item="{ item }">
                    <a-base :ref="item.action" :conf="getConf(item,item.action)"></a-base>
                </template>
            </Menu>
        </div>
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
