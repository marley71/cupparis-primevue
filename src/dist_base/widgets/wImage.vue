<template>
  <span>
    <Avatar v-if="imageType == 'avatar'" :image="value" v-bind="extraBind" shape="circle" :class="imageClass"></Avatar>
    <img v-else :src="value" v-bind="extraBind" :class="imageClass"/>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>

<script>

import _wImage from '../../widgets/_wImage.vue'
import RulesErrors from "./RulesErrors.vue";

export default {
  name: "wImage",
  extends: _wImage,
  components : {RulesErrors}
}

</script>

