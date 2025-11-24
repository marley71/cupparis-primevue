<template>
  <span>
    <div class="crud-datepicker">
    <input type="hidden" :name="name" v-model="value">
    <div class="flex">
      <Button icon="fa fa-times" @click="clear" v-if="clearButton"/>
      <DatePicker class="w-full my-datapicker" :showButtonBar="true" v-model="dateValue" @date-select="change"
                :inputDateFormat="dateFormat" :date-format="displayFormat"
                v-bind="extraBind" selectionMode="range"
                @clear-click="clear"/>
    </div>
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
  components : {RulesErrors}
}

</script>
<style>
.my-datapicker {
  z-index: 100001 !important;
}
</style>
