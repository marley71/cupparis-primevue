<template>
  <span>
    <template v-if="statusType==='icon'">
      <i :class="currentValue"></i>
    </template>
    <template v-else-if="statusType==='action'">
                    <span class="cursor-pointer" v-html="domainValuesHtml[value]" @click="executeFunc('w-status', value)" >

                    </span>
      <!--                    {{ currentValue }}-->
    </template>
    <template v-else>
      <span v-html="domainValuesHtml[value]"></span>
    </template>
  </span>
</template>

<script>

import _wStatus from '../../widgets/_wStatus.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wStatus",
  extends: _wStatus
}

</script>

