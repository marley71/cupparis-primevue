<template>
    <div>
      <div class="w-full flex flex-wrap border border-round-sm surface-border p-2 gap-2"
           :class="direction==='row'?'flex-row':'flex-col'">
        <div class="field-checkbox flex items-center mb-1"
             :class="rowType==='grid'?'w-12 md:w-6 xl:w-3':'mr-2 '" v-for="(label,key) in domainValues" :key="key">
          <Checkbox :name="getFieldName()" v-model="value" :value="key" v-bind="extraBind" @change="change"/>
          <label :for="key" v-html="label" class="ml-1"></label>
        </div>
      </div>
    </div>
    <RulesErrors :errors="errors"></RulesErrors>
</template>

<script>

import _wCheckbox from '@cupparis-lib/widgets/_wCheckbox.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wCheckbox",
  extends: _wCheckbox,
  components : {RulesErrors}
}

</script>

