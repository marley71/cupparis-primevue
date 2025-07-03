<template>
  <span>
    <Chips v-model="value" @add="add" @remove="remove"/>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>

<script>

import _wChip from '@cupparis-lib/widgets/_wChip.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wChip",
  extends: _wChip,
  components : {RulesErrors}
}

</script>

