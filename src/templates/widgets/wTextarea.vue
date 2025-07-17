<template>
  <span>
    <Textarea v-model="value" :name="name" @change="change" class="w-full"
              :placeholder="placeholder"></Textarea>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>

<script>

import _wTextarea from '@cupparis-lib/widgets/_wTextarea.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wTextarea",
  extends: _wTextarea,
  components : {RulesErrors}
}

</script>

