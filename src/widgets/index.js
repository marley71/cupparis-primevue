import cWidget from "./cWidget.vue";
import wHasmany from "./wHasmany.vue";
import wSwap from "./wSwap.vue";
import wInputSet from './wInputSet.vue';
export default {
    install (app) {
        app.component('c-widget',cWidget);
        app.component('w-hasmany', wHasmany);
        app.component('w-swap', wSwap);
        app.component('w-input-set',wInputSet);
    },
    cWidget, wHasmany, wSwap, wInputSet
}
