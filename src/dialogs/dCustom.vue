<template>
    <Dialog class="p-dialog" v-model:visible="display" :modal="true" :style="{width: '50vw'}">
        <template #header>
            <h3>{{ translate(title) }}</h3>
        </template>
        <template v-if="componentName">
            <component :is="componentName" :conf="cConf"></component>
        </template>
        <div v-else ref="el">
            <template v-if="Array.isArray(message)">
                <div  v-for="(msg,index) in message" v-html="msg" :key="index"></div>
            </template>
            <template v-else>
                <div v-html="message"></div>
            </template>
        </div>
        <template v-if="Object.keys(callbacks).length > 0"  #footer>
            <Button v-for="(cb,key) in callbacks" :key="key" :callback-name="key" :label="translate(key)" icon="pi pi-check" autofocus v-on:click="callCb(key)" />
        </template>
    </Dialog>
</template>

<script>
import dBase from './dBase.vue'
import Button from 'primevue/button';
import Dialog from "primevue/dialog";

export default {
  name: 'd-custom',
  extends: dBase,
    components: {Button, Dialog},
    mounted () {
    if (!this.title) {
      this.title = 'app.nome-app'
    }
  },
    data() {
      return {
          componentName : null,
          cConf : null,
      }
    },
    methods: {
      showComponent(compName,conf) {
          this.cConf = conf;
          this.componentName = compName;
      }
    }
}
</script>

<style scoped>

</style>
