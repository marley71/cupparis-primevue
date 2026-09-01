<template>
  <span>
    <div class="w-full flex flex-wrap border rounded-md surface-border p-2 [&>div:last-child]:mr-0"
         :class="direction==='row'?'flex-row':'flex-col'">
      <div class="field-radiobutton flex items-center mb-1"
           :class="rowType==='grid'?'w-12 md:w-6 xl:w-3':'mr-1 xl:mr-3'"
           v-for="(label,key) in domainValues" :key="key">
          <RadioButton
            :name="name"
            v-model="value"
            :value="normalizeKey(key)"
            v-bind="extraBind"
            @change="change"
          />
        <label :for="key" v-html="label" class="ml-1" :class="isSelected(key)?'font-bold':''"></label>
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
  components : {RulesErrors},
  methods: {
    
  }
}

</script>

