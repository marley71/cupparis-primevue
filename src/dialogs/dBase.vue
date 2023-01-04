
<script>
import CrudComponent from "../CrudComponent.vue";

export default {
    name: 'd-base',
    extends : CrudComponent,
    props:['conf'],
    data() {
      let d = Object.assign({
          cBig : false,
          display : true,
          content: null,
          visible: true,
          message: '',
          title: '',
          typeSize: 'w-1/2',
          callbacks: {},
          customClass:'',
      },this.conf);
      return d;
    },
  methods: {
    show () {
        let that = this
        that.display = true;
    },
    hide () {
        let that = this
        that.display = false;
    },
        ok : function () {
            var that = this;
            var exist = that.callbacks['ok'] && {}.toString.call(that.callbacks['ok']) === '[object Function]'
            if (exist)
                return that.callbacks['ok'].apply(that);
            console.log('default ok');
            this.hide();
        },
        cancel : function () {
            var that = this;
            var exist = that.callbacks['cancel'] && {}.toString.call(that.callbacks['cancel']) === '[object Function]'
            if (exist)
                return that.callbacks['cancel'].apply(that);
            console.log('default cancel');
            this.hide();
        },

        callCb : function (key) {
            var that = this;
            that.callbacks[key].apply(that);
        },
        destroy() {
            let that = this;
            console.log('destroy dialog component', that.component);
            that.$destroy();
            that.jQe().html(' ');
            that.jQe().remove();
            if (that.component)
                that.component.unmount();
        }
    }
}
</script>

<style scoped>

</style>
