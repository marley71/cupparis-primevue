<template>
  <span>
    <div v-html="value"></div>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>

<script>

import _wCustom from '@cupparis-lib/widgets/_wCustom.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wCustom",
  extends: _wCustom,
  components : {RulesErrors}
}

</script>

