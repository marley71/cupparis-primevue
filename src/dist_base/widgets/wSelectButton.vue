<template>
  <span>
    <input type="hidden" :name="name" v-model="value">
    <SelectButton :name="name" v-model="value" :options="options"
                  option-label="label" option-value="id"
                  v-bind="extraBind" @change="change">
        <template #option="slotProps">
            <div
                :class="'select-button-option select-button-option-'+name+ ' select-button-option-'+name+'-'+slotProps.option.id"
                v-html="slotProps.option.label">
            </div>
        </template>
    </SelectButton>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>
</template>

<script>

import _wSelectButton from '@cupparis-lib/widgets/_wSelectButton.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wSelectButton",
  extends: _wSelectButton,
  components : {RulesErrors}
}

</script>

