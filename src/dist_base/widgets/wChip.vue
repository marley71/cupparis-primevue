<template>
  <span>
    <Chips v-model="value" @add="add" @remove="remove"/>
    <div v-if="errors && errors.length !== 0" class="overflow-hidden">
        <span class="text-red-400" v-for="(error,index) in errors" :key="index">
           {{ error }} <span v-if="parseInt(index) < (Object.keys(errors).length-1)">,&nbsp;</span>
        </span>
    </div>
  </span>

</template>

<script>

import _wChip from '../../widgets/_wChip.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wChip",
  extends: _wChip
}

</script>

