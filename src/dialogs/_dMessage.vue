

<script>
import _dBase from './_dBase.vue'
export default {
    name: '_dMessage',
    extends: _dBase,
    mounted() {
        if (!this.title) {
            this.title = 'app.informazione'
        }
    }
}
</script>

<style scoped>

</style>
