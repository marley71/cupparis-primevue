
<script>

import _wBase from "./_wBase.vue"

export default {
    name: '_wObject',
    extends : _wBase,
    methods: {
        getFields() {
            return this.fields || Object.keys(this.value);
            // var that = this;
            // if (that.fields) {
            //     let obj = {}
            //     for (var i in that.fields) {
            //         let field = that.fields[i];
            //         obj[field] = that.value[field];
            //     }
            //     return obj;
            // }
            
            // return that.value;
        }
    }
}
</script>
