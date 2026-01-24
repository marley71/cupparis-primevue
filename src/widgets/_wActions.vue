<script>

import _wBase from "./_wBase.vue"

export default {
  name: '_wActions',
  extends: _wBase,
  methods: {
    getActionsWhitelist() {
      return Array.isArray(this.actions) ? this.actions : [this.actions];
    },
    recordActionConf() {
      return (this.viewInstance && this.viewInstance.recordActionsConf) ? this.viewInstance.recordActionsConf : {};
    }
  }
}
</script>
