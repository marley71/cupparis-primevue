<script>

import _wBase from "./_wBase.vue"
import cs from "@cupparis-lib";

export default {
  name: '_wDownload',
  extends: _wBase,

  methods: {
    download() {
      cs.Server.get('/api/' + this.value.url, {}, function (json) {
        cs.CrudCore.waitEnd()
        if (json.error) {
          cs.CrudCore.errorDialog(json.msg)
          return
        }
        //let prefix = cs.CrudVars.useApi?'/api':'';
        //document.location.href = prefix + json.result.link
        let ext = json.result['ext'] ? json.result['ext'] : '.pdf';
        let filename = json.result['name'] ? json.result['name'] : ('Allegato' + ext);
        cs.CrudHelpers.createRuntimeDownload(json.result['content'], json.result['mime'], filename);

        console.log(json)
      })
    },
    displayName() {
      return !Boolean(this.hideName);
    }
  }
}
</script>
