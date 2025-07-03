<template>
    <Dialog class="p-dialog" v-model:visible="display" :modal="true" :style="{width: width}" :class="cssClass" @hide="hide">
        <template #header>
            <h3>{{ translate(title) }}</h3>
        </template>
        <div class="h-full" :style="{height:height}">
            <template v-if="componentName">
                <component ref="compRef" :is="componentName" :conf="componentConf"></component>
            </template>
            <div v-else ref="el">
                <template v-if="Array.isArray(message)">
                    <div  v-for="(msg,index) in message" v-html="msg" :key="index"></div>
                </template>
                <template v-else>
                    <div v-html="message"></div>
                </template>
            </div>
        </div>
        <template v-if="Object.keys(callbacks).length > 0"  #footer>
            <Button v-for="(cb,key) in callbacks" :key="key" :callback-name="key" :label="translate(key)" icon="pi pi-check" autofocus v-on:click="callCb(key)" />
        </template>
        <template v-else-if="buttons.length > 0"  #footer>
            <Button v-for="(bt,index) in buttons"
                    :key="index"
                    :callback-name="'bt'+index"
                    :label="bt.label?translate(bt.label):translate('bt'+index)"
                    :icon="bt.icon?bt.icon:''"
                    :class="bt.css?bt.css:''"
                    :autofocus="bt.autofocus?true:false"
                    v-on:click="buttonCallback(index)" />
        </template>
    </Dialog>
</template>

<script>

import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import cManage from "../app/cManage.vue";

import _dCustom from '@cupparis-lib/dialogs/_dCustom.vue'

export default {
  name: 'd-confirm',
  extends: _dCustom,
  components: {Button,Dialog,cManage},
}

</script>

<style scoped>

</style>
