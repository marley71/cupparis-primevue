<template src="@templates/dialogs/d-message.html">

</template>

<script>
import dBase from './dBase.vue'
import Button from 'primevue/button';
import Dialog from "primevue/dialog";

export default {
    name: 'd-message',
    components: {Button,Dialog},
    extends: dBase,
    mounted() {
        if (!this.title) {
            this.title = 'app.informazione'
        }
    }
}
</script>

<style scoped>

</style>
