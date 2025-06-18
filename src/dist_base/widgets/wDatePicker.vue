<template>
  <span>
   <div class="crud-datepicker">
    <input type="hidden" :name="name" v-model="value">
    <div class="p-inputgroup ">
      <Button icon="fa fa-times" @click="_change($event,'clear')" v-if="buttonClear"/>
      <Calendar class="w-full" :showButtonBar="true" v-model="dateValue" @date-select="_change"
                :inputDateFormat="dateFormat" :date-format="displayFormat"
                v-bind="extraBind"
                @clear-click="_change($event,'clear')"/>
    </div>
  </div>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>

<script>

import _wDatePicker from '../../widgets/_wDatePicker.vue'
import RulesErrors from "./RulesErrors.vue";

export default {
  name: "wDatePicker",
  extends: _wDatePicker,
  components : {RulesErrors}
}

</script>

