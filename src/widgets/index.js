import cWidget from "./cWidget.vue";
import wHasmany from "./wHasmany.vue";
import wSwap from "./wSwap.vue";

export default {
    install (app) {
        app.component('c-widget',cWidget);
        app.component('w-hasmany', wHasmany);
        app.component('w-swap', wSwap);
    },
    cWidget, wHasmany, wSwap,
}
