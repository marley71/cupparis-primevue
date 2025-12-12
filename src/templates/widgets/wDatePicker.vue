<template>
  <span>
   <div class="crud-datepicker">
    <input type="hidden" :name="name" v-model="value">
    <div class="flex ">
      <Button icon="fa fa-times" @click="clear" v-if="clearButton"/>
      <DatePicker class="w-full cupparis-datapicker" :showButtonBar="true" v-model="dateValue" @date-select="change"
                :inputDateFormat="dateFormat" :date-format="displayFormat"
                v-bind="extraBind" @show="onShow"
                @clear-click="clear"/>
    </div>
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
        document.querySelector('.p-datepicker-panel').style['z-index'] = 10000;
      }
      
    }
  }
}

</script>

<style scoped>

</style>
