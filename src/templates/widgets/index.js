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
import wImages from './wImages.vue';
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
import CrudCore  from "@cupparis-lib/lib/CrudCore";







export default {
    install (app) {
        app.component('w-autocomplete',wAutocomplete);
        CrudCore.componentItems['w-autocomplete'] = wAutocomplete;   // permette la visibilita' anche per le dialog
        app.component('w-belongsto',wBelongsto);
        CrudCore.componentItems['w-belongsto'] = wBelongsto;
        app.component('w-belongsto-many',wBelongstoMany);
        CrudCore.componentItems['w-belongsto-many'] = wBelongstoMany;
        app.component('w-checkbox', wCheckbox);
        CrudCore.componentItems['w-checkbox'] = wCheckbox;
        app.component('w-chip', wChip);
        CrudCore.componentItems['w-chip'] = wChip;
        app.component('w-color-picker', wColorPicker);
        CrudCore.componentItems['w-color-picker'] = wColorPicker;
        app.component('w-custom', wCustom);
        CrudCore.componentItems['w-custom'] = wCustom;
        app.component('w-date-picker', wDatePicker);
        CrudCore.componentItems['w-date-picker'] = wDatePicker;
        app.component('w-date-range-picker', wDateRangePicker);
        CrudCore.componentItems['w-date-range-picker'] = wDateRangePicker;
        app.component('w-date-text', wDateText);
        CrudCore.componentItems['w-date-text'] = wDateText;
        app.component('w-editor',wEditor);
        CrudCore.componentItems['w-editor'] = wEditor;
        app.component('w-hasmany', wHasmany);
        CrudCore.componentItems['w-hasmany'] = wHasmany;
        app.component('w-hidden', wHidden);
        CrudCore.componentItems['w-hidden'] = wHidden;
        app.component('w-image',wImage);
        CrudCore.componentItems['w-image'] = wImage;
        app.component('w-images',wImages);
        CrudCore.componentItems['w-images'] = wImages;
        app.component('w-input',wInput);
        CrudCore.componentItems['w-input'] = wInput;
        app.component('w-input-set',wInputSet);
        CrudCore.componentItems['w-input-set'] = wInputSet;
        app.component('w-leaf-let',wLeafLet);
        CrudCore.componentItems['w-leaf-let'] = wLeafLet;
        app.component('w-multi-select', wMultiSelect);
        CrudCore.componentItems['w-multi-select'] = wMultiSelect;
        app.component('w-object',wObject);
        CrudCore.componentItems['w-object'] = wObject;
        app.component('w-radio', wRadio);
        CrudCore.componentItems['w-radio'] = wRadio;
        app.component('w-select', wSelect);
        CrudCore.componentItems['w-select'] = wSelect;
        app.component('w-select-button', wSelectButton);
        CrudCore.componentItems['w-select-button'] = wSelectButton;
        app.component('w-table',wTable);
        CrudCore.componentItems['w-table'] = wTable;
        app.component('w-text',wText);
        CrudCore.componentItems['w-text'] = wText;
        app.component('w-textarea',wTextarea);
        CrudCore.componentItems['w-textarea'] = wTextarea;
        app.component('w-texthtml',wTexthtml);
        CrudCore.componentItems['w-texthtml'] = wTexthtml;
        app.component('w-status',wStatus);
        CrudCore.componentItems['w-status'] = wStatus;
        app.component('w-upload',wUpload);
        CrudCore.componentItems['w-upload'] = wUpload;
        app.component('w-upload-ajax',wUploadAjax);
        CrudCore.componentItems['w-upload-ajax'] = wUploadAjax;
        app.component('w-swap', wSwap);
        CrudCore.componentItems['w-swap'] = wSwap;
        app.component('w-swap-select', wSwapSelect);
        CrudCore.componentItems['w-swap-select'] = wSwapSelect;
    }
}
