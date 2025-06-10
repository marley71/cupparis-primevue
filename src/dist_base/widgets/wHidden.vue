<template>
  <input type="hidden" :name="name" v-model="value" v-bind="extraBind" @change="change"/>
</template>

<script>

import _wInput from '../../widgets/_wInput.vue'
export default {
  name: "wHidden",
  extends: _wInput
}

</script>

