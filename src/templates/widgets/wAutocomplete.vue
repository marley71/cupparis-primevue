<template>
  <span>
    <input type="hidden" :name="name" v-model="value">
    <div class="flex">
      <Button icon="fa fa-times" @click="clear" v-if="clearButton"/>
      <AutoComplete class="w-full" v-model="autocompleteValue" :suggestions="suggestions" @show="onShow"
                    @complete="search" :option-label="getAutocompleteLabel" option-value="id"
                    v-bind="extraBind" @item-select="itemSelect" input-class="w-full"/>
    </div>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>
</template>

<script>

import _wAutocomplete from '@cupparis-lib/widgets/_wAutocomplete.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wAutocomplete",
  extends: _wAutocomplete,
  components : {RulesErrors},
  methods: {
    onShow() {
      // in popup  devo aumentare lo z-index altrimenti capita di sotto
      if (this.inPopup) {
        document.querySelector('.p-autocomplete-overlay').style['z-index'] = 10000;
      }
    }
  }
}

</script>

