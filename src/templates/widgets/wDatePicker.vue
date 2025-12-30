<template>
  <span>
   <div class="crud-datepicker">
    <input type="hidden" :name="name" v-model="value">
    <InputGroup>
      <Button icon="fa fa-times" @click="clear" v-if="clearButton" class="p-button-sm" />
      <DatePicker class="w-full cupparis-datapicker" :showButtonBar="true" v-model="dateValue" @date-select="change"
                @update:modelValue="change"
                :inputDateFormat="dateFormat" :date-format="displayFormat" inputClass="w-full"
                v-bind="extraBind" @show="onShow" :invalid="(errors &&errors.length > 0)"
                @clear-click="clear"/>
    </InputGroup>
  </div>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>

<script>

import _wDatePicker from '@cupparis-lib/widgets/_wDatePicker.vue'
import RulesErrors from "./RulesErrors.vue";

export default {
  name: "w-date-picker",
  extends: _wDatePicker,
  components : {RulesErrors},
  methods: {
    onShow() {
      // in popup  devo aumentare lo z-index altrimenti capita di sotto
      if (this.inPopup) {
        document.querySelector('.p-datepicker-panel').style['z-index'] = this.zIndexPopup;
      }
      
    }
  }
}

</script>

<style scoped>

</style>
