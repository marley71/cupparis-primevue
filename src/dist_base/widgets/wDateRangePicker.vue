<template>
  <span>
    <div class="crud-datepicker">
    <input type="hidden" :name="name" v-model="value">
    <div class="p-inputgroup">
      <Button icon="fa fa-times" @click="_change($event,'clear')" v-if="buttonClear"/>
      <Calendar class="w-full" :showButtonBar="true" v-model="dateValue" @date-select="_change"
                inputDateFormat="YYYY-MM-DD" date-format="dd/mm/yy"
                v-bind="extraBind" selectionMode="range"
                @clear-click="_change($event,'clear')"/>
    </div>
  </div>
  </span>

</template>

<script>

import _wDateRangePicker from '../../widgets/_wDateRangePicker.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wDateRangePicker",
  extends: _wDateRangePicker
}

</script>

