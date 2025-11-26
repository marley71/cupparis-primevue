<script>
import _dBase from './_dBase.vue'


export default {
  name: '_dCustom',
  extends: _dBase,
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
          componentConf.dialogInstance = this;   // passo il riferimento alla dialog
          console.debug('assegnato riferimento a dialog');
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
