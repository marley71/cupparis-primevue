<template>
  <span>
    <div class="crud-datepicker">
    <input type="hidden" :name="name" v-model="value">
    <InputGroup>
      <Button icon="fa fa-times" @click="clear" v-if="clearButton" class="p-button-sm" />
      <DatePicker class="w-full cupparis-datepicker" :showButtonBar="true" v-model="dateValue" @date-select="change"
                @update:modelValue="change"
                :inputDateFormat="dateFormat" :date-format="displayFormat"
                v-bind="extraBind" selectionMode="range"  @show="onShow"
                @clear-click="clear"/>
    </InputGroup>
  </div>
      <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>

<script>

import _wDateRangePicker from '@cupparis-lib/widgets/_wDateRangePicker.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "w-date-range-picker",
  extends: _wDateRangePicker,
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
<style>

</style>
