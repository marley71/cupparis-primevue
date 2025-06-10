<template>
  <span>
    <input type="hidden" :name="name" :value="value">
    <Dropdown class="w-full" :name="name" v-model="value" :options="options"
              option-label="label" option-value="id"
              :placeholder="placeholder || translate('app.seleziona')"
              v-bind="extraBind" @change="_change" :disabled="_disabled()">
      <template #value="slotProps">
        <div v-if="slotProps.value"
             :class="'select-button-option select-button-option-'+name+ ' select-button-option-'+name+'-'+slotProps.value"
        >
          {{ domainValues[slotProps.value]?domainValues[slotProps.value]:slotProps.value }}

          <!--                    v-html="slotProps.value.label"-->
        </div>
        <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
      </template>
      <template #option="slotProps">
        <div
            :class="'select-button-option select-button-option-'+name+ ' select-button-option-'+name+'-'+slotProps.option.id"
            v-html="slotProps.option.label">
        </div>
      </template>
    </Dropdown>
  </span>
</template>

<script>

import _wSelect from '../../widgets/_wSelect.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wSelect",
  extends: _wSelect
}

</script>

