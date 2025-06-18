<template>
  <span>
    <FileUpload mode="basic" name="ciaoo" :auto="true" :customUpload="true" @uploader="uploadFile"
                :multiple="false" v-bind="extraBind" :pt="{file:{attrs:{name:'ciccio'}}}" />
    <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>

<script>

import _wUpload from '../../widgets/_wUpload.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wUpload",
  extends: _wUpload,
  components : {RulesErrors}
}

</script>

