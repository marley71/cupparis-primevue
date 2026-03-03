<script>

import _wBase from "./_wBase.vue"
import cs from "@cupparis-lib";

export default {
  name: '_wAttachments',
  extends: _wBase,

  methods: {
    download(attachment) {
      let that = this;
      if (that.downloadType != 'download') {
        cs.CrudHelpers.createRuntimeLink(attachment.resource.url + '?inline=true', '_blank');
        return ;
      }
      cs.Server.get('/api/' + attachment.resource.url, {}, function (json) {
        cs.CrudCore.waitEnd()
        if (json.error) {
          cs.CrudCore.errorDialog(json.msg)
          return
        }
        //let prefix = cs.CrudVars.useApi?'/api':'';
        //document.location.href = prefix + json.result.link
        console.log('downloadType',json);
        let ext = json.result['ext'] ? json.result['ext'] : '.pdf';
        let filename = json.result['name'] ? json.result['name'] : ('Allegato' + ext);
        cs.CrudHelpers.createRuntimeDownload(json.result['content'], json.result['mime'], filename);
      })
    }
  },
  computed: {
    previewType() {
      return this.viewInstance.metadata.fields.previewType.value;
    }
  }
}
</script>
