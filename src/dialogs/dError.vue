<template src="@templates/dialogs/d-error.html">

</template>

<script>
import dBase from './dBase.vue'
import Button from 'primevue/button';
import Dialog from "primevue/dialog";

export default {
  name: 'd-error',
  extends: dBase,
    components: {Button,Dialog},
  mounted () {
    if (!this.title) {
      this.title = 'app.errore'
    }
  }
}
</script>

<style scoped>

</style>
