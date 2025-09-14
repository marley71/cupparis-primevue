<template>
    <div v-if="loaded">
        <form ref="form" enctype="multipart/form-data">
            <h5>Layout di edit insert, inserisco direttamente i campi con i nomi</h5>
            <div>
                <component :is="widgetsConfig['mainrole'].type" :conf="widgetsConfig['mainrole']"></component>
                <component :is="widgetsConfig['email'].type" :conf="widgetsConfig['email']"></component>
                <component :is="widgetsConfig['name'].type" :conf="widgetsConfig['name']"></component>
            </div>
            <div>
                <c-action ref="actions" :conf="recordActionsConf" layout="buttons" ></c-action>
            </div>
        </form>

    </div>
</template>

<script>
import vRecord from '@templates/views/vRecord.vue';

export default {
    name: "insert-edit-user",
    extends: vRecord,
}
</script>

<style scoped>

</style>
