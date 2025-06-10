<template>
    <div>
        <span v-html="_labelTop()"></span>
        <input type="hidden" :name=getFieldName() :value="value">
        <Dropdown class="w-full" :name=getFieldName() v-model="value" :options="options"
                  option-label="label" option-value="id" :placeholder="placeholder || translate('app.seleziona')"
                   @change="swap()" v-bind="extraBind" :disabled="_disabled()">
            <template #value="slotProps">
                <div v-if="slotProps.value"
                    :class="'select-button-option select-button-option-'+name+ ' select-button-option-'+name+'-'+slotProps.value"
                    >
                    {{ domainValues[slotProps.value]?domainValues[slotProps.value]:slotProps.value }}

<!--                    v-html="slotProps.value.label"-->
                </div>
                <span v-else>
                    {{ slotProps.placeholder }}
                </span>
            </template>
            <template #option="slotProps">
                <div
                    :class="'select-button-option select-button-option-'+name+ ' select-button-option-'+name+'-'+slotProps.option.id"
                    v-html="slotProps.option.label">
                </div>
            </template>
        </Dropdown>
        <span v-html="_labelBottom()"></span>
    </div>
</template>

<script>

import _wSwapSelect from '../../widgets/_wSwapSelect.vue';
import RulesErrors from "./RulesErrors.vue";
export default {
    name: "wSwapSelect",
    extends: _wSwapSelect,
}
</script>

<style scoped>

</style>
