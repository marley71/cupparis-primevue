<template>
  <span>
    <Knob v-model="value" :valueTemplate="prefix+ '{value}' +suffix" v-bind="extraBind" :size="size" />
    <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>

<script>

import _wKnob from '@cupparis-lib/widgets/_wKnob.vue'
import RulesErrors from "./RulesErrors.vue";

export default {
  name: "wKnob",
  extends: _wKnob,
  components : {RulesErrors}
}

</script>

