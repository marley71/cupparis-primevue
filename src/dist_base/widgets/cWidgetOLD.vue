<template>
    <span>
        <template v-if="conf.type==='w-hidden'">
            <input type="hidden" :name="name" v-model="value" v-bind="extraBind" @change="change"/>
        </template>

        <template v-else-if="conf.type==='w-autocomplete'">
            <w-autocomplete ref="wRef" :conf="conf"></w-autocomplete>
        </template>
        <template v-else-if="conf.type==='w-belongsto'">
          <w-belongsto ref="wRef" :conf="conf" @change="_change"></w-belongsto>
        </template>
        <template v-else-if="conf.type==='w-belongsto-many'">
          <w-belongsto-many ref="wRef" :conf="conf" @change="_change"></w-belongsto-many>
        </template>
        <template v-else-if="conf.type==='w-button'">
          <w-button ref="wRef" :conf="conf" @change="_change"></w-button>
        </template>
        <template v-else-if="conf.type==='w-checkbox'">
            <w-checkbox ref="wRef" :conf="conf" @change="_change"></w-checkbox>
        </template>
        <template v-else-if="conf.type==='w-chip'">
          <w-chip ref="wRef" :conf="conf" @change="_change"></w-chip>
        </template>
        <template v-else-if="conf.type==='w-color-picker'">
          <w-color-picker ref="wRef" :conf="conf" @change="_change"></w-color-picker>
        </template>
        <template v-else-if="conf.type==='w-custom'">
            <w-custom ref="wRef" :conf="conf" @change="_change"></w-custom>
        </template>
        <template v-else-if="conf.type==='w-date-picker'">
          <w-date-picker ref="wRef" :conf="conf" @change="_change"></w-date-picker>
        </template>
        <template v-else-if="conf.type==='w-date-range-picker'">
          <w-date-range-picker ref="wRef" :conf="conf" @change="_change"></w-date-range-picker>
        </template>
        <template v-else-if="conf.type==='w-date-text'">
          <w-date-text ref="wRef" :conf="conf" @change="_change"></w-date-text>
        </template>
        <template v-else-if="conf.type==='w-editor'">
            <w-editor ref="wRef" :conf="conf" @change="_change"></w-editor>
        </template>
        <template v-else-if="conf.type==='w-hasmany'">
            <w-hasmany ref="wRef" :conf="conf" @change="_change"></w-hasmany>
        </template>
        <template v-else-if="conf.type==='w-icons'">
          <w-icons ref="wRef" :conf="conf" @change="_change"></w-icons>
        </template>
        <template v-else-if="conf.type==='w-image'">
          <w-image ref="wRef" :conf="conf" @change="_change"></w-image>
        </template>
        <template v-else-if="conf.type==='w-input'">
          <w-input ref="wRef" :conf="conf" @change="_change"></w-input>
        </template>
        <template v-else-if="conf.type==='w-input-set'">
            <w-input-set ref="wRef" :conf="conf" @change="_change"></w-input-set>
        </template>
        <template v-else-if="conf.type==='w-json'">
            <w-json ref="wRef" :conf="conf" @change="_change"></w-json>
        </template>
        <template v-else-if="conf.type==='w-leaf-let'">
            <w-leaf-let ref="wRef" :conf="conf" @change="_change"></w-leaf-let>
        </template>
        <template v-else-if="conf.type==='w-multi-select'">
          <w-multi-select ref="wRef" :conf="conf" @change="_change"></w-multi-select>
        </template>
        <template v-else-if="conf.type==='w-object'">
          <w-object ref="wRef" :conf="conf" @change="_change"></w-object>
        </template>
        <template v-else-if="conf.type==='w-preview'">
          <w-preview ref="wRef" :conf="conf" @change="_change"></w-preview>
        </template>
        <template v-else-if="conf.type==='w-radio'">
          <w-radio ref="wRef" :conf="conf" @change="_change"></w-radio>
        </template>
        <template v-else-if="conf.type==='w-select'">
          <w-select ref="wRef" :conf="conf" @change="_change"></w-select>
        </template>
        <template v-else-if="conf.type==='w-select-button'">
            <w-select-button ref="wRef" :conf="conf" @change="_change"></w-select-button>
        </template>
        <template v-else-if="conf.type==='w-status'">
          <w-status ref="wRef" :conf="conf" @change="_change"></w-status>
        </template>
        <template v-else-if="conf.type==='w-swap'">
            <w-swap ref="wRef" :conf="conf"></w-swap>
        </template>
        <template v-else-if="conf.type==='w-swap-select'">
            <w-swap-select ref="wRef" :conf="conf"></w-swap-select>
        </template>
        <template v-else-if="conf.type==='w-table'">
          <w-table ref="wRef" :conf="conf" @change="_change"></w-table>
        </template>
        <template v-else-if="conf.type==='w-text'">
            <w-text ref="wRef" :conf="conf" @change="_change"></w-text>
        </template>
        <template v-else-if="conf.type==='w-textarea'">
          <w-textarea ref="wRef" :conf="conf" @change="_change"></w-textarea>
        </template>
        <template v-else-if="conf.type==='w-texthtml'">
          <w-texthtml ref="wRef" :conf="conf" @change="_change"></w-texthtml>
        </template>
        <template v-else-if="conf.type==='w-upload'">
          <w-upload ref="wRef" :conf="conf" @change="_change"></w-upload>
        </template>
        <template v-else-if="conf.type==='w-upload-ajax' ">
          <w-upload-ajax ref="wRef" :conf="conf" @change="_change"></w-upload-ajax>
        </template>
        <template v-else>
            <component :is="type" :conf="conf"></component>
<!--            <div>Widget non riconosciuto {{ type }}</div>-->
        </template>
        <div class="overflow-hidden">
            <span class="text-red-400" v-for="(error,index) in errors" :key="index">
               {{ error }} <span v-if="parseInt(index) < (Object.keys(errors).length-1)">,&nbsp;</span>
            </span>
        </div>
    </span>
</template>

<script>
import _cWidget from '@cupparis-lib/widgets/_cWidget.vue'
import wHasmany from "./wHasmany.vue";
import wSwap from "./wSwap.vue";
import wSwapSelect from "./wSwapSelect.vue";
import wInputSet from './wInputSet.vue';
import wLeafLet from './wLeafLet.vue';
import wEditor from './wEditor.vue';
import wImage from './wImage.vue';
import wObject from './wObject.vue';
import wText from './wText.vue'
import wInput from './wInput.vue'
import wTable from './wTable.vue'
import wSelect from './wSelect.vue'
import wSelectButton from './wSelectButton.vue'
import wAutocomplete from './wAutocomplete.vue'
import wCheckbox from './wCheckbox.vue'
import wRadio from './wRadio.vue'
import wBelongsto from './wBelongsto.vue'
import wBelongstoMany from './wBelongstoMany.vue'
import wCustom from './wCustom.vue'
import wColorPicker from './wColorPicker.vue'
import wDatePicker from './wDatePicker.vue'
import wDateRangePicker from './wDateRangePicker.vue'
import wDateText from './wDateText.vue'
import wTextarea from './wTextarea.vue'
import wMultiSelect from './wMultiSelect.vue'
import wStatus from './wStatus.vue'
import wButton from './wButton.vue'
import wChip from './wChip.vue'
import wIcons from './wIcons.vue'
import wJson from './wJson.vue'
import wPreview from './wPreview.vue'
import wTexthtml from './wTexthtml.vue'
import wUpload from './wUpload.vue'
import wUploadAjax from './wUploadAjax.vue'

export default {
    name: "c-widget",
    extends: _cWidget,
    components: {
      wAutocomplete,wBelongsto,wBelongstoMany,wButton,wCheckbox,wChip,wColorPicker,wCustom,
      wDatePicker,wDateRangePicker,wDateText,wEditor,wHasmany, wIcons, wImage, wInput,wInputSet,
      wJson, wLeafLet,wMultiSelect, wObject,wPreview,wRadio, wSelect,wSelectButton,wTable,wText,
      wTextarea,wTexthtml,wStatus, wUpload,wUploadAjax, wSwap, wSwapSelect,
    },
}

</script>

<style scoped>

label {
    font-size: 12px;
}
.text-right {
    text-align:right;
}
.maximizable-div {
    width: 100%;
    height: 200px;
    transition: all 0.3s ease;
    position: relative;
    overflow:auto;
}

/* Stile per il div quando è massimizzato */
.maximizable-div-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    overflow:auto;
    background-color: white; /* Imposta un colore di sfondo per il div massimizzato */
}
</style>
