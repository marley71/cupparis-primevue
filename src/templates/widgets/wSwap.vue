<template>
    <span>
        <input :name="getFieldName()" type="hidden" :value="toggleValue?1:0">
        <ToggleSwitch v-model="toggleValue" @change="swap()" :disabled="extraBind.disabled?true:false"/>
        <RulesErrors :errors="errors"></RulesErrors>
    </span>
</template>

<script>
import _wSwap from '@cupparis-lib/widgets/_wSwap.vue';
import RulesErrors from "./RulesErrors.vue";
export default {
    name: "wSwap",
  components: {RulesErrors},
    extends: _wSwap,
}
</script>

<style scoped>

</style>
