<script>

import CrudComponent from "../CrudComponent.vue";
import moment from "moment/moment";
import Server from "../lib/Server";
import WrapperConf from "./WrapperConf";
import global from '../confs/global';

export default {
    name: "_wBase",
    extends : CrudComponent,
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
            if ( (global.widgetOverloadMethods.indexOf(k) < 0) && that.conf[k] instanceof Function) {
                //console.debug('wBase.created (',k,') metodo non fa parte dei sovrascribili')
                that.overwriteMethods[k] = that.conf[k];
                __call(k);
            }
        }
        this.Server = Server;
    },
    created() {
      let that = this;
      //console.debug('wBase.created ',that.conf);
    },
  mounted() {
    setTimeout(this.ready, 10);
  },
    data() {
      return this._loadReactiveData(this.conf)
    },

    methods : {
      ready() {
        if (this.conf.ready) {
          this.conf.ready.apply(this);
        }
      },
      reset() {
        let that = this;

        if (this.conf.reset) {
          this.conf.reset.apply(this);
          return ;
        }
        that.value = null;
      },
        clear(event) {
            console.debug('clear',event)
            if (this.conf.clear) {
                this.conf.clear.apply(this,[event]);
            }
            this.value = null;
        },
      getFieldName() {
        if (this.conf.getFieldName) {
          return this.conf.getFieldName.apply(this)
        }

        if (['w-checkbox','w-multi-select'].indexOf(this.type) >= 0) {
          return this.name + '[]';
        }
        return this.name;
      },

      change(event) {
        if (this.conf.change) {
          return this.conf.change.apply(this,[event])
        }

      },

      disabled(event) {
          if (this.conf.disabled) {
              return this.conf.disabled.apply(this,[event])
          }
          return false;
      },

      _hasClick() {
        if (this.click && (this.click instanceof Function) ) {
          return true;
        }
        return false;
      },
      _hasHref() {
        if (this.href) {
          return true;
        }
        return false;
      },
      _href(event) {
        if (this.href instanceof Function) {
          return this.href.apply(this,[event]);
        }
        return this.href;
      },

        // _change(event, type) {
        //     let that = this;
        //     let evt = event || {};
        //     evt.widget = this;
        //     switch (this.type) {
        //         case 'w-date-picker':
        //             if (type == 'clear') {
        //                 this.value = null;
        //                 this.dateValue = null;
        //             } else if (event) {
        //                 let inputDateFormat = evt.widget.inputDateFormat || 'YYYY-MM-DD';
        //                 let date = event ? moment(event).format(inputDateFormat) : null;
        //                 //console.log("DATE",date, inputDateFormat)
        //                 //var date = new Date();
        //                 this.value = date;
        //             }
        //             break;
        //         case 'w-date-range-picker':
        //             if (type == 'clear') {
        //                 this.value = null;
        //                 this.dateValue = null;
        //             } else if (event) {
        //                 let inputDateFormat = evt.widget.inputDateFormat || 'YYYY-MM-DD';
        //                 if (this.dateValue) {
        //                     let d1 = this.dateValue[0]?moment(this.dateValue[0]).format(inputDateFormat) : null;
        //                     let d2 = this.dateValue[1]?moment(this.dateValue[1]).format(inputDateFormat) : null;
        //                     this.value = [d1,d2];
        //                 }
        //
        //                 // let date = event ? moment(event).format(inputDateFormat) : null;
        //                 // console.log("DATE",date, inputDateFormat,this.dateValue);
        //                 // //var date = new Date();
        //                 // this.value = [date,date];
        //             }
        //             break;
        //         default:
        //             break;
        //     }
        //     this.$emit('change', evt);
        //     if (this.change) {
        //         setTimeout(function () {
        //             that.change(evt);
        //         },10)
        //     }
        //
        // },
        getValue() {
            let that = this;
            switch (that.conf.type) {
                case 'w-hasmany':
                    return that.$refs.wRef.getValue();
                default:
                    return that.value;
            }

        },
        setValue(value) {
          console.debug('_wBase.setValue',value);
          this.value = value;
        },
      setErrors(errors) {
        this.errors = errors;
      },
      /**
       * questa funzione normalizza la configurazione che mi arriva e restituisco solo i dati che devono essere realmente reactive
       */
        _loadReactiveData(conf) {
          let wc = new WrapperConf()
          let ext = wc.loadConf(conf);
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
      bgUrl(url) {
        return 'background-image: url("' + url + '") !important;"';
      },

    }
}
</script>

