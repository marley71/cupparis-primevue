<template>
  <span>
    <ColorPicker v-model="value" @change="change" v-bind="extraBind"/>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>

<script>

import _wColorPicker from '@cupparis-lib/widgets/_wColorPicker.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wColorPicker",
  extends: _wColorPicker,
  components : {RulesErrors}
}

</script>

