<template>
  <span>
    <div class="w-full flex flex-wrap border-1 border-round-sm surface-border p-2"
           :class="direction=='row'?'flex-row':'flex-column'">
      <div class="field-radiobutton mb-1"
           :class="rowType=='grid'?'w-12 md:w-6 xl:w-3':'mr-2 '"
           v-for="(label,key) in domainValues" :key="key">
        <RadioButton :name="name" v-model="value" :value="key" v-bind="extraBind" @change="change"/>
        <label :for="key" v-html="label" :class="value==key?'font-bold':''"></label>
      </div>
    </div>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>

<script>

import _wRadio from '@cupparis-lib/widgets/_wRadio.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wRadio",
  extends: _wRadio,
  components : {RulesErrors}
}

</script>

