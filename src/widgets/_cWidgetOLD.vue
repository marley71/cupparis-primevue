<script>
import moment from "moment";
import Server from "../lib/Server";
import CrudVars from "../lib/CrudVars";

import WrapperConf from "./WrapperConf";
import CrudComponent from '../CrudComponent.vue';

export default {
    name: "_cWidget",
    extends: CrudComponent,
    filters: {
        decodeEntities: function (value) {
            if (!value) return '';
            value = value.toString();
            const parsed = new DOMParser().parseFromString(value, "text/html");
            return parsed.documentElement.textContent;
        }
    },
    watch: {
        conf: {
            handler() {
                //console.log('watch', oldValue,newValue);
                for (let k in this.conf) {
                    this[k] = this.conf[k];
                }
            },
            deep: true,
        },
        // autocompleValue() {
        //   console.log('autocompleete value',this.autocompleValue)
        //   this.value = this.autocompleValue;
        // }
    },
    // created() {
    //     let that = this;
    //     //console.log('CREATEDDD',that)
    //     that.overwriteMethods = {};
    //     var __call = function (lk) {
    //         that[lk] = function () {
    //             var localk = new String(lk);
    //             return that.overwriteMethods[localk].apply(that, arguments);
    //         }
    //     }
    //
    //     for (let k in that.wConf) {
    //         //console.log('k',k,ext[k]);
    //
    //         if (that.wConf[k] instanceof Function) {
    //             //console.log('found method',k);
    //             that.overwriteMethods[k] = that.wConf[k];
    //             __call(k);
    //         }
    //     }
    //     this.Server = Server;
    // },
    // data() {
    //     let that = this;
    //     let wc = new WrapperConf()
    //     let ext = wc.loadConf(that.conf);
    //     let dt = {};
    //     for (let k in ext) {
    //         if (!(ext[k] instanceof Function)) {
    //             dt[k] = ext[k];
    //         }
    //     }
    //     dt.wConf = ext;
    //     dt.errors = [];
    //     return dt;
    // },
    data() {
        return {
          errors : [],
        }
    },
    mounted() {
        setTimeout(this._ready, 10);
    },
    methods: {
        // _ready() {
        //     this.confLoaded = true;
        //     if (this.ready) {
        //         this.ready.apply(this);
        //     }
        // },

        _click(event) {
            if (this.click) {
                this.click.apply(this,[event]);
            }
        },
        // _change(event, type) {
        //     let that = this;
        //     let evt = event || {};
        //     evt.widget = this;
        //     switch (this.type) {
        //         case 'w-autocomplete':
        //             if (type == 'clear') {
        //                 this.value = null;
        //                 this.autocompleteValue = null;
        //             } else if (event) {
        //                 this.value = event.id;
        //                 this.referredData = event;
        //             }
        //             break;
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

        _title(event) {
            if (this.title instanceof Function) {
                return this.title.apply(this,[event]);
            }
            return this.title;
        },

        _icon(event) {
            if (this.icon instanceof Function) {
                return this.icon.apply(this,[event]);
            }
            return this.icon;
        },

        getParams(func) {

            // String representation of the function code
            var str = func.toString();

            // Remove comments of the form /* ... */
            // Removing comments of the form //
            // Remove body of the function { ... }
            // removing '=>' if func is arrow function
            str = str.replace(/\/\*[\s\S]*?\*\//g, '')
                .replace(/\/\/(.)*/g, '')
                .replace(/{[\s\S]*}/, '')
                .replace(/=>/g, '')
                .trim();

            // Start parameter names after first '('
            var start = str.indexOf("(") + 1;

            // End parameter names is just before last ')'
            var end = str.length - 1;

            var result = str.substring(start, end).split(", ");

            var params = [];

            result.forEach(element => {

                // Removing any default value
                element = element.replace(/=[\s\S]*/g, '').trim();

                if (element.length > 0)
                    params.push(element);
            });

            return params;
        },
        setValue(val) {
            let that = this;
            switch (that.conf.type) {
                case 'w-hasmany':
                    that.$refs.wRef.setValue(val);
                    break;
                case 'w-select':
                    // siccome i valori possono essere diversi prima del check li trasformo in stringa
                    var stringValues = that.options.map(a => a.id + "");
                    var index = stringValues.indexOf(val + "");
                    if (index >= 0) {
                        that.value = that.options[index].id
                    }
                    break;
                default:
                    that.value = val;
                    break;
            }
            this._change();
        },
        // getValue() {
        //     let that = this;
        //     switch (that.conf.type) {
        //         case 'w-hasmany':
        //             return that.$refs.wRef.getValue();
        //         default:
        //             return that.value;
        //     }
        //
        // },


        getFieldName() {
            if (['w-checkbox','w-multi-select'].indexOf(this.type) >= 0) {
                return this.name + '[]';
            }
            return this.name;
        },

        getLabel() {
            //console.log('options',options)
            return this.label;
        },



        instance() {
            if (this.$refs.wRef) {
                return this.$refs.wRef;
            }
            return this;
        },
        getRealUrl(url) {
            if (url.indexOf('http') == 0) {
                return url;
            }
            if (CrudVars.useApi) {
                return '/api' + url;
            }
        },
        executeFunc(widgetType,funcName) {
            switch (widgetType) {
                case 'w-status':
                    console.debug('funcName',funcName);
                    this.domainValues[funcName].apply(this);
                    break;
                default:
                    throw widgetType + "status widget non supportato funcName " + funcName
            }
        },


      bgUrl(url) {
        return 'background-image: url("' + url + '") !important;"';
      },
    }
}
</script>

<style scoped>

label {
    font-size: 12px;
}
.text-right {
    text-align:right;
}
.maximizable-div {
    width: 100%;
    height: 200px;
    transition: all 0.3s ease;
    position: relative;
    overflow:auto;
}

/* Stile per il div quando è massimizzato */
.maximizable-div-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    overflow:auto;
    background-color: white; /* Imposta un colore di sfondo per il div massimizzato */
}
</style>
