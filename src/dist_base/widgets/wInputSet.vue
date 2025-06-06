<template>
    <div class="flex">
<!--        <InputText class="w-full" :name="name" :type="inputType" v-model="value" v-bind="extraBind"-->
<!--                   @change="_change" :class="errors.length?'p-invalid':''"></InputText>-->
        <span>{{value}}</span>
        <Button icon="fa fa-edit" class="p-button-sm ml-1 p-1" outlined :disabled="!canUpdate"
                @click="toggle"></Button>
        <OverlayPanel ref="panel" @hide="cancel()">
            <h6>Modifica</h6>
            <div class="my-1 grid w-24rem">
                <span class="mt-1">{{ label }}:</span>
                <InputText v-model="value"/>
                <Button label="Salva" @click="set()"></Button>
            </div>
        </OverlayPanel>
    </div>
</template>

<script>

import _wInputSet from '../../widgets/_wInputSet.vue'
export default {
    name: "wInputSet",
    extends: _wInputSet,
}
</script>

<style scoped>

</style>
