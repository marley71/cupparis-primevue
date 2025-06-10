<template>
  <component :is="textTag" :class="textClass">
      <template v-if="iconPrefix || prefix">
          <i v-if="iconPrefix" :class="iconPrefix"></i>
          <span v-if="prefix">{{prefix}}</span>
      </template>
      <template v-if="numberFormat">
          {{new Intl.NumberFormat((numberFormat.language?numberFormat.language:'it-IT'), (numberFormat.options?numberFormat.options:{})).format(value)}}
      </template>
      <template v-else>
          {{ value }}
      </template>
      <i v-if="iconSuffix" :class="iconSuffix"></i>
      <span v-if="suffix">{{suffix}}</span>
  </component>
</template>

<script>

import _wText from '../../widgets/_wText.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wText",
  extends: _wText
}

</script>

