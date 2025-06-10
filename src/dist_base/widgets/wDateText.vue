<template>
  <span>
    <template v-if="iconPrefix || prefix">
        <i v-if="iconPrefix" :class="iconPrefix"></i>
        <span v-if="prefix">{{prefix}}</span>
    </template>
    <span>{{ getFormattedValue() }}</span>
    <template v-if="iconSuffix || suffix">
        <i v-if="iconSuffix" :class="iconSuffix"></i>
        <span v-if="suffix">{{suffix}}</span>
    </template>
  </span>
</template>

<script>

import _wDateText from '../../widgets/_wDateText.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wDateText",
  extends: _wDateText
}

</script>

