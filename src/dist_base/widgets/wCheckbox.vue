<template>
  <span>
    <div class="w-full flex flex-wrap border-1 border-round-sm surface-border p-2"
         :class="direction=='row'?'flex-row':'flex-column'">
    <div class="field-checkbox mb-1"
         :class="rowType=='grid'?'w-12 md:w-6 xl:w-3':'mr-2 '" v-for="(label,key) in domainValues" :key="key">
      <Checkbox :name="getFieldName()" v-model="value" :value="key" v-bind="extraBind" @change="_change"/>
      <label :for="key" v-html="label"></label>
    </div>
  </div>
    <div v-if="errors && errors.length !== 0" class="overflow-hidden">
        <span class="text-red-400" v-for="(error,index) in errors" :key="index">
           {{ error }} <span v-if="parseInt(index) < (Object.keys(errors).length-1)">,&nbsp;</span>
        </span>
    </div>
  </span>

</template>

<script>

import _wCheckbox from '../../widgets/_wCheckbox.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wCheckbox",
  extends: _wCheckbox
}

</script>

