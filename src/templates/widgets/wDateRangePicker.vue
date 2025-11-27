<template>
  <span>
    <div class="crud-datepicker">
    <input type="hidden" :name="name" v-model="value">
    <div class="flex">
      <Button icon="fa fa-times" @click="clear" v-if="clearButton"/>
      <DatePicker class="w-full cupparis-datepicker" :showButtonBar="true" v-model="dateValue" @date-select="change"
                :inputDateFormat="dateFormat" :date-format="displayFormat"
                v-bind="extraBind" selectionMode="range"  @show="onShow"
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
  components : {RulesErrors},
  methods: {
    onShow() {
      document.querySelector('.p-datepicker-panel').style['z-index'] = 10000;
    }
  }
}

</script>
<style>

</style>
