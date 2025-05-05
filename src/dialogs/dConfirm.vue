<template src="@templates/dialogs/d-confirm.html">

</template>

<script>
import dBase from './dBase.vue'

export default {
  name: 'd-confirm',
  extends: dBase,
  mounted () {
    if (!this.title) {
      this.title = 'app.richiesta-conferma'
    }
  }
}
</script>

<style scoped>

</style>
