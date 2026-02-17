<template>
  <span>
    <input type="hidden" v-model="value" :name="getFieldName()">
    <Message v-if="error" severity="error" :closable="false">{{ errorMessage }}</Message>
    <div class="flex items-center justify-start gap-4">
      <div class="ml-5">
        <div class="mt-3" v-if="fileInfo">
          <template v-if="['image/png','image/jpeg'].indexOf(fileInfo.mimetype) >= 0">

            <Image :src="dataImage(fileInfo)" alt="Image" width="100" preview />

            <!--                                <img :src="fileInfo.url"/>-->
          </template>
          <template v-else>
            <i class="fa fa-file fa-2xl cursor-pointer"
              @click="download(fileInfo)"
            ></i>
          </template>
        </div>
      </div>
      <FileUpload mode="basic" :chooseButtonProps="{'variant':(variant || 'outlined'),'size':'small','severity':severity}" chooseIcon="fa fa-upload" chooseLabel="Scegli File" :auto="true" :customUpload="true" @uploader="uploadFile"
                  :multiple="false" v-bind="extraBind"/>
    </div>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>
</template>

<script>

import _wUploadAjax from '@cupparis-lib/widgets/_wUploadAjax.vue'
import RulesErrors from "./RulesErrors.vue";
import {userApp} from '@/application/stores/userApp';
import cs from "@cupparis-lib";

export default {
  name: "wUploadAjax",
  extends: _wUploadAjax,
  components : {RulesErrors},

  methods: {

  }
}

</script>

