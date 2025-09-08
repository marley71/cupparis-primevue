<template>
    <Dialog class="p-dialog" v-model:visible="display" :modal="true" :style="{width: width}" @hide="hide">
        <template #header>
            <h3>{{ translate(title) }}</h3>
        </template>

        <div ref="el">
            <div class="flex gap-5 text-primary">
              <div>
                <i class="fa fa-info-circle fa-2x"></i>
              </div>
              <div>
                <template v-if="Array.isArray(message)">
                  <div  v-for="(msg,index) in message" v-html="msg" :key="index"></div>
                </template>
                <template v-else>
                  <div v-html="message"></div>
                </template>
              </div>
            </div>

        </div>

        <template #footer>
            <Button :label="translate('app.ok')" icon="pi pi-check" autofocus v-on:click="ok" />
        </template>
    </Dialog>
</template>

<script>
import _dMessage from '@cupparis-lib/dialogs/_dMessage.vue'
import Button from 'primevue/button';
import Dialog from "primevue/dialog";

export default {
    name: 'd-message',
    components: {Button,Dialog},
    extends: _dMessage,
}
</script>

<style scoped>

</style>
