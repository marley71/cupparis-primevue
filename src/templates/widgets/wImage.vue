<template>
  <span>
    <Avatar v-if="imageType == 'avatar'" :image="value" v-bind="extraBind" shape="circle" :class="imageClass"></Avatar>
    <Image v-else :src="srcUrl(value)" alt="Image" width="100" preview v-bind="extraBind" :class="imageClass"/>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>

<script>

import _wImage from '@cupparis-lib/widgets/_wImage.vue'
import RulesErrors from "./RulesErrors.vue";

export default {
  name: "wImage",
  extends: _wImage,
  components : {RulesErrors}
}

</script>

