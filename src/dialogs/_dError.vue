

<script>
import _dBase from './_dBase.vue'
export default {
  name: '_dError',
  extends: _dBase,
  mounted () {
    if (!this.title) {
      this.title = 'app.errore'
    }
  }
}
</script>

<style scoped>

</style>
