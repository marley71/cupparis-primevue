<template>
  <div class="w-full flex justify-start h-full my-[0.5rem] px-[2rem]">
    <ColorPicker v-model="value" :name="name" @change="change" :class="'w-1/2 m-auto'" v-bind="extraBind"/>
    <RulesErrors :errors="errors"></RulesErrors>
    <input type="hidden" :name="name" ref="ih" v-model="value">
  </div>

</template>

<script>

import _wColorPicker from '@cupparis-lib/widgets/_wColorPicker.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wColorPicker",
  extends: _wColorPicker,
  components : {RulesErrors},

  methods: {
  }
}

</script>

<style>
  .p-colorpicker {
    padding:0 !important;
  }
  .p-colorpicker-preview {
    width: 6rem !important;
    height: 100%;
    margin:0;
    padding:0;
  }
</style>

