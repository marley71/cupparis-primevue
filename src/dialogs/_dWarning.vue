<script>
import _dBase from './_dBase.vue'
export default {
  name: '_dWarning',
  extends: _dBase,
  mounted() {
    if (!this.title) {
      this.title = 'app.attenzione'
    }
  }
}
</script>

<style scoped>

</style>
