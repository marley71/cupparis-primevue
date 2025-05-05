<script>

import CrudComponent from "../CrudComponent.vue";
import moment from "moment/moment";
import Server from "../lib/Server";
import WrapperConf from "./WrapperConf";

export default {
    name: "wBase",
    extends : CrudComponent,
    emits: ['change'],
    // props: {
    //     conf: Object,
    // },
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
    },
    created() {
        let that = this;
        //console.log('CREATEDDD',that)
        that.overwriteMethods = {};
        var __call = function (lk) {
            that[lk] = function () {
                var localk = new String(lk);
                //console.debug('c-widget chiamo localK',localk);
                return that.overwriteMethods[localk].apply(that, arguments);
            }
        }

        for (let k in that.wConf) {
            //console.log('c-widget k',k,that.wConf[k]);

            if (that.wConf[k] instanceof Function) {
                //console.log('c-widget found method',k);
                that.overwriteMethods[k] = that.wConf[k];
                __call(k);
            }
        }
        this.Server = Server;
    },
    data() {
        let that = this;
        let wc = new WrapperConf()
        let ext = wc.loadConf(that.conf);
        let dt = {};
        for (let k in ext) {
            if (!(ext[k] instanceof Function)) {
                dt[k] = ext[k];
            }
        }
        dt.wConf = ext;
        dt.errors = [];
        return dt;
    },
    mounted() {
        setTimeout(this._ready, 10);
    },
    methods : {
        _ready() {
            if (this.ready) {
                this.ready.apply(this);
            }
        },
        _disabled(event) {
            if (this.disabled instanceof Function) {
                return this.disabled.apply(this,[event]);
            }
            return this.disabled;
        },
        _hasClick() {
            if (this.click && (this.click instanceof Function) ) {
                return true;
            }
            return false;
        },
        _click(event) {
            if (this.click) {
                this.click.apply(this,[event]);
            }
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
        _reset() {
            if (this.reset) {
                this.reset.apply(this);
            }
        },
        _change(event, type) {
            let that = this;
            let evt = event || {};
            evt.widget = this;
            switch (this.type) {
                case 'w-autocomplete':
                    if (type == 'clear') {
                        this.value = null;
                        this.autocompleteValue = null;
                    } else if (event) {
                        this.value = event.id;
                        this.referredData = event;
                    }
                    break;
                case 'w-date-picker':
                    if (type == 'clear') {
                        this.value = null;
                        this.dateValue = null;
                    } else if (event) {
                        let inputDateFormat = evt.widget.inputDateFormat || 'YYYY-MM-DD';
                        let date = event ? moment(event).format(inputDateFormat) : null;
                        //console.log("DATE",date, inputDateFormat)
                        //var date = new Date();
                        this.value = date;
                    }
                    break;
                case 'w-date-range-picker':
                    if (type == 'clear') {
                        this.value = null;
                        this.dateValue = null;
                    } else if (event) {
                        let inputDateFormat = evt.widget.inputDateFormat || 'YYYY-MM-DD';
                        if (this.dateValue) {
                            let d1 = this.dateValue[0]?moment(this.dateValue[0]).format(inputDateFormat) : null;
                            let d2 = this.dateValue[1]?moment(this.dateValue[1]).format(inputDateFormat) : null;
                            this.value = [d1,d2];
                        }

                        // let date = event ? moment(event).format(inputDateFormat) : null;
                        // console.log("DATE",date, inputDateFormat,this.dateValue);
                        // //var date = new Date();
                        // this.value = [date,date];
                    }
                    break;
                default:
                    break;
            }
            this.$emit('change', evt);
            if (this.change) {
                setTimeout(function () {
                    that.change(evt);
                },10)
            }

        },
        getFieldName() {
            if (['w-checkbox','w-multi-select'].indexOf(this.type) >= 0) {
                return this.name + '[]';
            }
            return this.name;
        },
        getValue() {
            let that = this;
            switch (that.conf.type) {
                case 'w-hasmany':
                    return that.$refs.wRef.getValue();
                default:
                    return that.value;
            }

        },
        setValue(val) {
            let that = this;
            that.value = val;
            this._change();
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
    }
}
</script>

