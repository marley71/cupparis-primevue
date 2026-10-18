<template>
    <Dialog class="p-dialog" v-model:visible="display" :modal="true" :style="{width: width}" @hide="hide">
        <template #header>
            <h3 class="text-xl">{{ translate(title) }}</h3>
        </template>

        <div ref="el">
            <div class="flex gap-5 text-primary">
              <div>
                <i class="fa fa-info-circle fa-2x"></i>
              </div>
              <div>
                  <div v-html="message"></div>
                  <div v-if="widgetConf">
                    <component ref="widget" :is="widgetConf.type" :conf="widgetConf"></component>
                  </div>
                  <InputText v-else v-model="value" @change="ok"></InputText>
              </div>
            </div>

        </div>

        <template #footer>
            <Button :label="translate('app.ok')" icon="pi pi-check" autofocus v-on:click="ok" />
        </template>
    </Dialog>
</template>

<script>

import _dInput from '@cupparis-lib/dialogs/_dInput.vue'
import Button from 'primevue/button';
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";

export default {
    name: 'd-input',
    components: {
        Button,
        Dialog,
        InputText,
    },
    extends: _dInput,
}
</script>

<style scoped>

</style>
