<template>
  <Textarea v-model="value" :name="name" @change="change" class="w-full"
            :placeholder="placeholder"></Textarea>
</template>

<script>

import _wTextarea from '../../widgets/_wTextarea.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wTextarea",
  extends: _wTextarea
}

</script>

