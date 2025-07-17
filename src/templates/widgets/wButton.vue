<template>
    <span>
        <Button :class="cssClass" @click="_click" :icon="_icon()"
                :disabled="_disabled()" :title="_title()">{{value}}</Button>
        <RulesErrors :errors="errors"></RulesErrors>
    </span>
</template>

<script>

import _wButton from '@cupparis-lib/widgets/_wButton.vue'
import RulesErrors from "./RulesErrors.vue";

export default {
  name: "wButton",
  extends: _wButton,
  components : {RulesErrors}
}

</script>

