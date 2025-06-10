<template>
  <span>
   <div class="crud-datepicker">
    <input type="hidden" :name="name" v-model="value">
    <div class="p-inputgroup ">
      <Button icon="fa fa-times" @click="_change($event,'clear')" v-if="buttonClear"/>
      <Calendar class="w-full" :showButtonBar="true" v-model="dateValue" @date-select="_change"
                inputDateFormat="YYYY-MM-DD" date-format="dd/mm/yy"
                v-bind="extraBind"
                @clear-click="_change($event,'clear')"/>
    </div>
  </div>
    <div v-if="errors && errors.length !== 0" class="overflow-hidden">
        <span class="text-red-400" v-for="(error,index) in errors" :key="index">
           {{ error }} <span v-if="parseInt(index) < (Object.keys(errors).length-1)">,&nbsp;</span>
        </span>
    </div>
  </span>

</template>

<script>

import _wDatePicker from '../../widgets/_wDatePicker.vue'
import RulesErrors from "./RulesErrors.vue";

export default {
  name: "wDatePicker",
  extends: _wDatePicker
}

</script>

