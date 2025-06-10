<template>
  <span>
    <input type="hidden" :name="name" v-model="value">
    <div class="p-inputgroup">
      <Button icon="fa fa-times" @click="clear"/>
      <AutoComplete class="w-full" :name="name" v-model="autocompleteValue" :suggestions="suggestions"
                    @complete="search" :option-label="getAutocompleteLabel" option-value="id"
                    v-bind="extraBind" @item-select="itemSelect"/>
    </div>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>
</template>

<script>

import _wAutocomplete from '../../widgets/_wAutocomplete.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wAutocomplete",
  extends: _wAutocomplete,
  components : {RulesErrors}
}

</script>

