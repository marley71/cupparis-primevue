

<script>
import _dBase from './_dBase.vue'
export default {
    name: '_dInput',
    extends: _dBase,
    mounted() {
        if (!this.title) {
            this.title = 'app.richiesta-dati'
        }
    },
    methods: {
        ok : function () {
            let that = this;
            let exist = that.callbacks['ok'] && {}.toString.call(that.callbacks['ok']) === '[object Function]'
            if (exist)
                return that.callbacks['ok'].apply(that);
            console.log('default ok');
            this.hide();
        },
    }
}
</script>

<style scoped>

</style>
