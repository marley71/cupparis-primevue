<template>
  <Button :class="cssClass" @click="_click" :icon="_icon()"
          :disabled="_disabled()" :title="_title()">{{value}}</Button>
  <div v-if="errors && errors.length !== 0" class="overflow-hidden">
        <span class="text-red-400" v-for="(error,index) in errors" :key="index">
           {{ error }} <span v-if="parseInt(index) < (Object.keys(errors).length-1)">,&nbsp;</span>
        </span>
  </div>
</template>

<script>

import _wButton from '../../widgets/_wButton.vue'
import RulesErrors from "./RulesErrors.vue";

export default {
  name: "wButton",
  extends: _wButton
}

</script>

