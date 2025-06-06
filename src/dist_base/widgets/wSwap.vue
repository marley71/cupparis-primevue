<template>
    <div>
        <input :name="getFieldName()" type="hidden" :value="toggleValue?1:0">
        <InputSwitch v-model="toggleValue" @change="swap()" :disabled="extraBind.disabled?true:false"/>
    </div>
</template>

<script>
import _wSwap from '../../widgets/_wSwap.vue';
export default {
    name: "wSwap",
    extends: _wSwap,
}
</script>

<style scoped>

</style>
