<template>
  <span>
    <ColorPicker v-model="value" @change="_change" v-bind="extraBind"/>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>

<script>

import _wColorPicker from '../../widgets/_wColorPicker.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wColorPicker",
  extends: _wColorPicker,
  components : {RulesErrors}
}

</script>

