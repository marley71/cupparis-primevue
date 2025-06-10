<template>
  <div class="flex">
    <template v-for="(item,k) in domainValues">
      <i :class="item + value===k?' text-primary':''"></i>
    </template>
  </div>
</template>

<script>

import _wIcons from '../../widgets/_wIcons.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wIcons",
  extends: _wIcons
}

</script>

