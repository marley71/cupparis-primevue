<script>
import _dBase from './_dBase.vue'

export default {
  name: '_dConfirm',
  extends: _dBase,
  mounted () {
    if (!this.title) {
      this.title = 'app.richiesta-conferma'
    }
  }
}
</script>

<style scoped>

</style>
