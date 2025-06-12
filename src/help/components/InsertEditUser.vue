<template>
    <div v-if="loaded">
        <h5>Layout di edit insert</h5>
        <div>
            <component :is="widgetsConfig['email'].type" :conf="widgetsConfig['email']"></component>
            <c-widget :is="widgetsConfig['name'].type" :conf="widgetsConfig['name']"></c-widget>
        </div>
        <div>
            <c-action ref="actions" :conf="recordActionsConf" layout="buttons" ></c-action>
        </div>
    </div>
</template>

<script>
import vRecord from '../../dist/views/vRecord.vue';

export default {
    name: "insert-edit-user",
    extends: vRecord,
}
</script>

<style scoped>

</style>
