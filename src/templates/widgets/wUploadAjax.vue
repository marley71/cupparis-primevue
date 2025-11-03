<template>
  <span>
    <input type="hidden" v-model="value" :name="getFieldName()">
    <Message v-if="error" severity="error" :closable="false">{{ errorMessage }}</Message>
    <div class="flex items-center justify-start gap-4">
      <div class="ml-5">
        <div class="mt-3" v-if="fileInfo">
          <template
              v-if="['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].indexOf(fileInfo.mimetype) >= 0">
            <i class="fa fa-file-excel fa-2xl"></i>
          </template>
          <template v-else-if="['application/pdf'].indexOf(fileInfo.mimetype) >= 0">
            <i class="fa fa-file-pdf fa-2xl"></i>
          </template>
          <template v-else-if="['image/png','image/jpeg'].indexOf(fileInfo.mimetype) >= 0">

            <Image :src="srcUrl(fileInfo.url)" alt="Image" width="100" preview />

            <!--                                <img :src="fileInfo.url"/>-->
          </template>
          <template v-else>
            <i class="fa fa-file fa-2xl"></i>
          </template>
        </div>
      </div>
      <FileUpload mode="basic" class="p-button-sm p-button-outlined" chooseIcon="fa fa-upload" chooseLabel="Scegli File" :auto="true" :customUpload="true" @uploader="uploadFile"
                  :multiple="false" v-bind="extraBind"/>
    </div>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>
</template>

<script>

import _wUploadAjax from '@cupparis-lib/widgets/_wUploadAjax.vue'
import RulesErrors from "./RulesErrors.vue";

export default {
  name: "wUploadAjax",
  extends: _wUploadAjax,
  components : {RulesErrors}
}

</script>

