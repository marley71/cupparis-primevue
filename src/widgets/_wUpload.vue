
<script>

import _wBase from "./_wBase.vue"

export default {
    name: '_wUpload',
    extends : _wBase,
  methods : {
    uploadFile(event) {
      this.files = event.files;
      console.log('uploadevent',event,this);
    },
    getFileValue() {
      return this.files;
    }
  }
}
</script>
