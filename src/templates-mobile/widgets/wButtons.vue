<template>
  <div >
      <div v-for="button in buttons">
        <w-button :conf="button"></w-button>
      </div>
  </div>
</template>

<script>

import _wButtons from '@cupparis-lib/widgets/_wButtons.vue'
import RulesErrors from "./RulesErrors.vue";

export default {
  name: "wButtons",
  extends: _wButtons,
  components: {RulesErrors}
}

</script>

