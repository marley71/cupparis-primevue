<template src="@templates/dialogs/d-warning.html">

</template>

<script>
import dBase from './dBase.vue'
import Button from 'primevue/button';
import Dialog from "primevue/dialog";

export default {
  name: 'd-warning',
  extends: dBase,
    components: {Button,Dialog},
  mounted () {
    if (!this.title) {
      this.title = 'app.attenzione'
    }
  }
}
</script>

<style scoped>

</style>
