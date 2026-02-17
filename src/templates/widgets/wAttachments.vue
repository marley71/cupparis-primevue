<template>
  <div v-if="Array.isArray(value)" class="flex gap-2 flex-wrap">
    <div v-for="(attachment) in value" >
        <div @click="download(attachment)" class="cursor-pointer text-center">
          <i class="fa fa-file fa-xl"></i>
          <div class="text-xs mt-1">{{attachment.nome}}</div>
        </div>
    </div>
  </div>
<!--  <span>-->
<!--    <Avatar v-if="imageType == 'avatar'" :image="value" v-bind="extraBind" shape="circle" :class="imageClass"></Avatar>-->
<!--    <Image v-else :src="srcUrl(value)" alt="Image" width="100" preview v-bind="extraBind" :class="imageClass"/>-->
<!--    <RulesErrors :errors="errors"></RulesErrors>-->
<!--  </span>-->

</template>

<script>

import _wAttachments from '@cupparis-lib/widgets/_wAttachments.vue'
import RulesErrors from "./RulesErrors.vue";

export default {
  name: "wAttachments",
  extends: _wAttachments,
  components : {RulesErrors},

}

</script>

