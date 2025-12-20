
<script>

import _wBase from "./_wBase.vue"

export default {
    name: '_wObject',
    extends : _wBase,
    mounted() {
        if (!this.fields) {
            this.fields = Object.keys(this.value);
        }
    },
}
</script>
