<template src="@templates/dialogs/d-custom.html">

</template>

<script>
import dBase from './dBase.vue'
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import CView from "../views/cView.vue";
import cManage from "../app/cManage.vue";

export default {
  name: 'd-custom',
  extends: dBase,
    components: {CView, Button,Dialog,cManage},
    props : ['confComponent'],
    mounted () {
      if (!this.title) {
        this.title = 'app.nome-app'
      }
    },
    data() {
      let cc = this.confComponent || {};
      let componentName = cc.componentName?cc.componentName:null;
      let componentConf = cc.componentConf?cc.componentConf:null;
      if (componentConf) {
          componentConf.dialog = this;   // passo il riferimento alla dialog
      }
      // @TODO in caso di manage si dovrebbe settare alcune configurazioni per evitare funzionamenti inattesi. updateHash,disabilitarla, togliere la view in popup,ecc
        if (componentName == 'c-manage') {
            componentConf.autoUpdateHash = false;
        }
      console.log('custom',componentName,componentConf);
      return {
          componentName : componentName,
          componentConf : componentConf,
          compRef : 'c-instance'
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
