
<script>
import CrudComponent from "../CrudComponent.vue";
import global from "../confs/global";
import WrapperConf from "./WrapperConf";
export default {
    name: '_Bbase',
    extends : CrudComponent,
    //props:['conf'],
    beforeCreate() {
      //console.debug('wBase.beforeCreate ',this.conf);
        let that = this;

        //console.log('CREATEDDD',that)
        that.overwriteMethods = {};
        var __call = function (lk) {
            that[lk] = function () {
                var localk = new String(lk);
                return that.overwriteMethods[localk].apply(that, arguments);
            }
        }

        for (let k in that.conf) {
            //console.log('k',k,ext[k]);
            // se la funzione non e' tra i metodi sovrascribili allora la istanzio come una nuova funzione dell'oggetto
            // altrimenti ci pensano i singoli metodi sovrascribili a fare la chiamata
            if (global.overloadMethodsCheck) {  
              if ( (global.dialogOverloadMethods.indexOf(k) < 0) && that.conf[k] instanceof Function) {
                  //console.debug('wBase.created (',k,') metodo non fa parte dei sovrascribili')
                  that.overwriteMethods[k] = that.conf[k];
                  __call(k);
              }
            } else {
              if (that.conf[k] instanceof Function) {
                that.overwriteMethods[k] = that.conf[k];
                __call(k);
              } 
            }
        }
    },
    data() {
      return this._loadReactiveData(this.conf)
    },
    /*
    data() {
      let d = Object.assign({
          cBig : false,
          display : true,
          content: null,
          visible: true,
          message: '',
          title: '',
          width: '50vw',
          height : 'auto',
          callbacks: {},
          customClass:'',
          buttons: [],
      },this.conf);
      return d;
    },
    */
  methods: {
    show () {
        let that = this
        that.display = true;
        if (that.conf.show) {
            that.conf.show.apply(that);
        }
    },
    hide () {
        let that = this;
        console.debug('hide',that.conf);
        that.display = false;
        if (that.conf.hide) {
            that.conf.hide.apply(that);
        }
    },
    ok : function () {
        let that = this;
        let exist = that.callbacks['ok'] && {}.toString.call(that.callbacks['ok']) === '[object Function]'
        if (exist)
            return that.callbacks['ok'].apply(that);
        console.log('default ok');
        this.hide();
    },
    cancel : function () {
        let that = this;
        let exist = that.callbacks['cancel'] && {}.toString.call(that.callbacks['cancel']) === '[object Function]'
        if (exist)
            return that.callbacks['cancel'].apply(that);
        console.log('default cancel');
        this.hide();
    },

    callCb : function (key) {
        let that = this;
        that.callbacks[key].apply(that);
    },
    buttonCallback(index) {
        let that = this;
        if (that.buttons[index].callback) {
            that.buttons[index].callback.apply(that);
        } else {
            console.warning('button index',index,'non ha una callback',that.buttons);
        }
    },
    destroy() {
        let that = this;
        console.log('destroy dialog component', that.component);
        that.$destroy();
        that.jQe().html(' ');
        that.jQe().remove();
        if (that.component)
            that.component.unmount();
    },
    /**
       * questa funzione normalizza la configurazione che mi arriva e restituisco solo i dati che devono essere realmente reactive
       */
    _loadReactiveData(conf) {
        let wc = new WrapperConf();
        if (!conf.type) {
            conf.type = this.$options.name;
            console.debug('dBase con senza type name:' , this.$options.name);
        }
        let ext = wc.loadConf(conf);
        //console.debug('wBase conf,ext ', conf,ext)
        let dt = {};
        for (let k in ext) {
        if (!(ext[k] instanceof Function)) {
            dt[k] = ext[k];
        }
        }
        dt.errors = [];
        //console.debug('wBase.data ', dt)
        return dt;
    },
  }
}
</script>

<style scoped>

</style>
