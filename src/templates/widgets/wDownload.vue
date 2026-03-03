<template>
  <div @click="download()" class="flex gap-2 flex-wrap cursor-pointer text-center items-center">
    <div><i class="fal fa-file fa-xl"></i></div>
    <div v-if="displayName()" class="text-xs">{{ value.name }}</div>
  </div>

</template>

<script>

import _wDownload from '@cupparis-lib/widgets/_wDownload.vue'
import RulesErrors from "./RulesErrors.vue";

export default {
  name: "wDownload",
  extends: _wDownload,
  components: {RulesErrors},

}

</script>

