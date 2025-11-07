<template>
  <span>
   <div class="crud-datepicker">
    <input type="hidden" :name="name" v-model="value">
    <div class="flex ">
      <Button icon="fa fa-times" @click="clear" v-if="clearButton"/>
      <DatePicker class="w-full" :showButtonBar="true" v-model="dateValue" @date-select="change"
                :inputDateFormat="dateFormat" :date-format="displayFormat"
                v-bind="extraBind"
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
  name: "wDatePicker",
  extends: _wDatePicker,
  components : {RulesErrors}
}

</script>

