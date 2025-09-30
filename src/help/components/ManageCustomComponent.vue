<script>

import _wBase from "../../widgets/_wBase.vue";

export default {
    name: "ManageCustomComponent",
    extends: _wBase,
}
</script>

<template>
    <div class="text-3xl">{{titolo}}</div>
    <div>
        Questo componente e' completamente diverso da qualsiasi vista.. ho esteso un widget il _wBase ho inserito nella conf un titolo
        che posso modificare e aggiungere metodi e variabili dinamiche.
        <Button class="p-button-sm p-button-outlined"  @click="pulsante">metodo associato al pulsante definito in conf</Button>
        I componenti custom devono comunque essere registrati in fase di avvio dell'applicazione come nell'esempio,altrimenti non verranno visti dalla manage.
        <pre class="my-3 border-[1px] border-round">
            import ComponentExample from '...'
            app.component('component-example',ComponentExample);
        </pre>
        <div>
            <Button class="p-button-sm p-button-outlined" @click="back">Torna alla lista</Button>
        </div>
    </div>

</template>

<style scoped>

</style>
