<template>
  <FileUpload mode="basic" name="ciaoo" :auto="true" :customUpload="true" @uploader="uploadFile"
              :multiple="false" v-bind="extraBind" :pt="{file:{attrs:{name:'ciccio'}}}" />
</template>

<script>

import _wUpload from '../../widgets/_wUpload.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wUpload",
  extends: _wUpload
}

</script>

