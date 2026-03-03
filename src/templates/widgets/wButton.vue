<template>
  <div>
    <div v-if="isLink()">
      <Button :class="cssClass" :severity="severity" @click="_click" :icon="icon" :iconPos="iconPos || 'right'"
              :disabled="isDisabled()" :title="title || buttonLabel" :label="buttonLabel" :variant="variant"
              :size="size" as="a" :href="isLink()" target="_blank" rel="noopener"

      />
    </div>
    <div v-else>
      <Button :class="cssClass" :severity="severity" @click="click" :icon="icon" :iconPos="iconPos || 'right'"
              :disabled="isDisabled()" :title="title || buttonLabel" :label="buttonLabel" :variant="variant"
              :size="size"

      />
    </div>
    <RulesErrors :errors="errors"></RulesErrors>
  </div>
</template>

<script>

import _wButton from '@cupparis-lib/widgets/_wButton.vue'
import RulesErrors from "./RulesErrors.vue";

export default {
  name: "wButton",
  extends: _wButton,
  components: {RulesErrors}
}

</script>

