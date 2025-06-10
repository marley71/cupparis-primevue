//import cWidget from "./cWidget.vue";

import wAutocomplete from './wAutocomplete.vue';
import wBelongsto from './wBelongsto.vue';
import wBelongstoMany from './wBelongstoMany.vue';
import wCheckbox from './wCheckbox.vue';
import wChip from './wChip.vue';
import wColorPicker from './wColorPicker.vue';
import wCustom from './wCustom.vue';
import wDatePicker from './wDatePicker.vue';
import wDateRangePicker from './wDateRangePicker.vue';
import wDateText from './wDateText.vue'
import wEditor from './wEditor.vue';
import wHasmany from "./wHasmany.vue";
import wHidden from './wHidden.vue'
import wImage from './wImage.vue';
import wInput from './wInput.vue';
import wInputSet from './wInputSet.vue';
import wLeafLet from './wLeafLet.vue';
import wMultiSelect from './wMultiSelect.vue'
import wObject from './wObject.vue';
import wRadio from './wRadio.vue';
import wSelect from './wSelect.vue';
import wSelectButton from './wSelectButton.vue';
import wTable from './wTable.vue';
import wText from './wText.vue';
import wTextarea from './wTextarea.vue';
import wTexthtml from './wTexthtml.vue';
import wStatus from './wStatus.vue';
import wUpload from './wUpload.vue'
import wUploadAjax from './wUploadAjax.vue';
import wSwap from "./wSwap.vue";
import wSwapSelect from './wSwapSelect.vue';








export default {
    install (app) {
        //app.component('c-widget',cWidget);
        app.component('w-autocomplete',wAutocomplete);
        app.component('w-belongsto',wBelongsto);
        app.component('w-belongsto-many',wBelongstoMany);
        app.component('w-checkbox', wCheckbox);
        app.component('w-chip', wChip);
        app.component('w-color-picker', wColorPicker);
        app.component('w-custom', wCustom);
        app.component('w-date-picker', wDatePicker);
        app.component('w-date-range-picker', wDateRangePicker);
        app.component('w-date-text', wDateText);
        app.component('w-editor',wEditor);
        app.component('w-hasmany', wHasmany);
        app.component('w-hidden', wHidden);
        app.component('w-image',wImage);
        app.component('w-input',wInput);
        app.component('w-input-set',wInputSet);
        app.component('w-leaf-let',wLeafLet);
        app.component('w-multi-select', wMultiSelect);
        app.component('w-object',wObject);
        app.component('w-radio', wRadio);
        app.component('w-select', wSelect);
        app.component('w-select-button', wSelectButton);
        app.component('w-table',wTable);
        app.component('w-text',wText);
        app.component('w-textarea',wTextarea);
        app.component('w-texthtml',wTexthtml);
        app.component('w-status',wStatus);
        app.component('w-upload',wUpload);
        app.component('w-upload-ajax',wUploadAjax);
        app.component('w-swap', wSwap);
        app.component('w-swap-select', wSwapSelect);








    },
    //cWidget,
    wAutocomplete, wHasmany, wSwap, wInputSet,wLeafLet,wEditor,wImage,wTable,wObject,wText,wInput
}
