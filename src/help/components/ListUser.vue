<template>
    <div>
        <h4>Lista utenti</h4>
    </div>
    <div v-if="Object.keys(collectionActions).length > 0">
        <div class="mt-5 lg:mt-0">
            <c-action layout="buttons" :conf="collectionActions"></c-action>
        </div>
    </div>
    <div class="mt-2" v-if="loaded">
        <div class="flex flex-row flex-wrap w-full gap-5">
            <div class="card w-1/5 h-200  border-[2px] rounded p-2 shadow-2xl" v-for="(row,index) in value" :key="index">
                <div class="text-2xl">{{row.name}}</div>
                <div class="overflow-auto">{{row.email}}</div>
                <div class="mt-2">
                    <c-action :conf="recordActionsConf[index]" layout="buttons"></c-action>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import vList from '@templates/views/vList.vue';
export default {
    name: "ListUser",
    extends:vList
}
</script>

<style scoped>

</style>
