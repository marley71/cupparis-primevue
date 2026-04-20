
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
    methods: {
        getFieldValue(field) {
            if (this.conf.getFieldValue ) {
                return this.conf.getFieldValue.apply(this,[field]);
            }
            return this.value[field];
        },
        getFieldLabel(field) {
            if (this.conf.getFieldLabel ) {
                return this.translate(this.conf.getFieldLabel.apply(this,[field]));
            }
            if (this.viewInstance) {
                return this.viewInstance.getFieldLabel(field);
            }
            return this.translate(field);
        },
    },
}
</script>
