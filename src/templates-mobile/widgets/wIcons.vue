<template>
  <span>
    <div class="flex">
      <template v-for="(item,k) in domainValues">
        <i :class="item + value===k?' text-primary':''"></i>
      </template>
    </div>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>

<script>

import _wIcons from '@cupparis-lib/widgets/_wIcons.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wIcons",
  extends: _wIcons,
  components : {RulesErrors}
}

</script>

