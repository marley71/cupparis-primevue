<template>
  <span>
    <div class="crud-datepicker">
    <input type="hidden" :name="name" v-model="value">
    <div class="p-inputgroup">
      <Button icon="fa fa-times" @click="clear" v-if="buttonClear"/>
      <Calendar class="w-full" :showButtonBar="true" v-model="dateValue" @date-select="change"
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
  name: "wDateRangePicker",
  extends: _wDateRangePicker,
  components : {RulesErrors}
}

</script>

