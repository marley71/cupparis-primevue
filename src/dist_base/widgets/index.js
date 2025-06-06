import cWidget from "./cWidget.vue";
import wHasmany from "./wHasmany.vue";
import wSwap from "./wSwap.vue";
import wInputSet from './wInputSet.vue';
import wLeafLet from './wLeafLet.vue';
import wEditor from './wEditor.vue';

export default {
    install (app) {
        app.component('c-widget',cWidget);
        app.component('w-hasmany', wHasmany);
        app.component('w-swap', wSwap);
        app.component('w-input-set',wInputSet);
        app.component('w-leaf-let',wLeafLet);
        app.component('w-editor',wEditor);
    },
    cWidget, wHasmany, wSwap, wInputSet,wLeafLet,wEditor
}
