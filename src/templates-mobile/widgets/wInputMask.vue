<template>
  <span>
    <InputMask class="w-full" :name="name" :mask="mask" :placeholder="mask" :autoClear=false slotChar="" :type="inputType" v-model="value" v-bind="extraBind"
             @change="change" :class="errors && errors.length?'p-invalid':''"></InputMask>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>

<script>

import _wInputMask from '@cupparis-lib/widgets/_wInputMask.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wInputMask",
  extends: _wInputMask,
  components : {RulesErrors}
}

</script>

