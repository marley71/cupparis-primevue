<template>
    <span>
        <template v-if="type==='w-hidden'">
            <w-hidden ref="wRef" :conf="conf"></w-hidden>
        </template>
        <template v-else-if="type==='w-editor'">
            <w-editor ref="wRef" :conf="conf"></w-editor>
        </template>
        <template v-else-if="type==='w-leaf-let'">
            <w-leaf-let ref="wRef" :conf="conf" @change="_change"></w-leaf-let>
        </template>
        <template v-else-if="type==='w-image'">
            <w-image ref="wRef" :conf="conf" @change="_change"></w-image>
        </template>
        <template v-else-if="type==='w-table'">
            <w-table ref="wRef" :conf="conf" @change="_change"></w-table>
        </template>
        <template v-else-if="type==='w-object'" >
            <w-object ref="wRef" :conf="conf" @change="_change"></w-object>
        </template>
        <template v-else-if="type==='w-text'">
            <w-text ref="wRef" :conf="conf" @change="_change"></w-text>
        </template>
        <template v-else-if="type==='w-input'">
            <w-input ref="wRef" :conf="conf" @change="_change"></w-input>
        </template>
        <template v-else-if="type==='w-input-set'">
            <w-input-set ref="wRef" :conf="conf" @change="_change"></w-input-set>
        </template>
        <template v-else-if="type==='w-select'" >
            <w-select ref="wRef" :conf="conf" @change="_change"></w-select>
        </template>
        <template v-else-if="type==='w-select-button'" >
            <w-select-button ref="wRef" :conf="conf" @change="_change"></w-select-button>
        </template>
        <template v-else-if="type==='w-autocomplete'">
            <w-autocomplete ref="wRef" :conf="conf" @change="_change"></w-autocomplete>
        </template>
        <template v-else-if="type==='w-checkbox'">
            <w-checkbox ref="wRef" :conf="conf" @change="_change"></w-checkbox>
        </template>
        <template v-else-if="type==='w-radio'">
            <w-radio ref="wRef" :conf="conf" @change="_change"></w-radio>
        </template>
        <template v-else-if="type==='w-hasmany'">
            <w-hasmany ref="wRef" :conf="conf" @change="_change"></w-hasmany>
        </template>
        <template v-else-if="type==='w-belongsto'" >
            <w-belongsto ref="wRef" :conf="conf" @change="_change"></w-belongsto>
        </template>
        <template v-else-if="type==='w-belongsto-many'" >
            <w-belongsto-many ref="wRef" :conf="conf" @change="_change"></w-belongsto-many>
        </template>
        <template v-else-if="type==='w-custom'">
            <w-custom ref="wRef" :conf="conf" @change="_change"></w-custom>
        </template>
        <template v-else-if="type==='w-color-picker'">
            <w-color-picker ref="wRef" :conf="conf" @change="_change"></w-color-picker>
        </template>
        <template v-else-if="type==='w-date-picker'">
            <w-date-picker ref="wRef" :conf="conf" @change="_change"></w-date-picker>
        </template>
        <template v-else-if="type==='w-date-range-picker'">
            <w-date-range-picker ref="wRef" :conf="conf" @change="_change"></w-date-range-picker>
        </template>
        <template v-else-if="type==='w-date-text'" >
            <w-date-text ref="wRef" :conf="conf" @change="_change"></w-date-text>
        </template>
        <template v-else-if="type==='w-textarea'" >
            <w-textarea ref="wRef" :conf="conf" @change="_change"></w-textarea>
        </template>
        <template v-else-if="type==='w-multi-select'">
            <w-multi-select ref="wRef" :conf="conf" @change="_change"></w-multi-select>
        </template>
        <template v-else-if="type==='w-swap'">
            <w-swap ref="wRef" :conf="wConf"></w-swap>
        </template>
        <template v-else-if="type==='w-swap-select'">
            <w-swap-select ref="wRef" :conf="wConf"></w-swap-select>
        </template>
        <template v-else-if="type==='w-status'" >
            <w-status ref="wRef" :conf="conf" @change="_change"></w-status>
        </template>
        <template v-else-if="type==='w-texthtml'" >
            <w-texthtml ref="wRef" :conf="conf" @change="_change"></w-texthtml>
        </template>
        <template v-else-if="type==='w-upload'">
            <w-upload ref="wRef" :conf="conf" @change="_change"></w-upload>
        </template>
        <template v-else-if="type==='w-upload-ajax'" >
            <w-upload-ajax ref="wRef" :conf="conf" @change="_change"></w-upload-ajax>
        </template>
        <template v-else-if="type==='w-chip'">
            <w-chip ref="wRef" :conf="conf" @change="_change"></w-chip>
        </template>
        <template v-else-if="type==='w-preview'" >
            <w-preview ref="wRef" :conf="conf" @change="_change"></w-preview>
        </template>
        <template v-else-if="type==='w-button'" >
            <w-button ref="wRef" :conf="conf" @change="_change"></w-button>
        </template>
        <template v-else-if="type==='w-icons'" >
            <w-icons ref="wRef" :conf="conf" @change="_change"></w-icons>
        </template>
        <template v-else-if="type==='w-json'">
            <w-json ref="wRef" :conf="conf" @change="_change"></w-json>
        </template>
        <template v-else>
            <component :is="type" :conf="wConf"></component>
        </template>
        <div class="overflow-hidden">
            <span class="text-red-400" v-for="(error,index) in errors" :key="index">
               {{ error }} <span v-if="parseInt(index) < (Object.keys(errors).length-1)">,&nbsp;</span>
            </span>
        </div>
    </span>
</template>

<script>
import WrapperConf from "./WrapperConf";
import Server from "../lib/Server";
import wBase from './wBase.vue';
import wHidden from './wHidden.vue'
import wSwap from "./wSwap.vue";
import wSwapSelect from "./wSwapSelect.vue";
import wInput from './wInput.vue';
import wInputSet from './wInputSet.vue';
import wSelect from './wSelect.vue'
import wSelectButton from './wSelectButton.vue'
import wAutocomplete from './wAutocomplete.vue'
import wCheckbox from './wCheckbox.vue';
import wRadio from './wRadio.vue';
import wHasmany from "./wHasmany.vue";
import wBelongsto from "./wBelongsto.vue";
import wBelongstoMany from "./wBelongstoMany.vue";
import wCustom from './wCustom.vue';
import wColorPicker from './wColorPicker.vue';
import wDatePicker from './wDatePicker.vue';
import wDateRangePicker from './wDateRangePicker.vue';
import wDateText from './wDateText.vue';
import wTextarea from './wTextarea.vue';
import wMultiSelect from './wMultiSelect.vue';
import wStatus from  './wStatus.vue';
import wTexthtml from './wTexthtml.vue';
import wUpload from './wUpload.vue';
import wUploadAjax from './wUploadAjax.vue';
import wChip from './wChip.vue';
import wPreview from './wPreview.vue';
import wButton from './wButton.vue';
import wIcons from './wIcons.vue';
import wJson from './wJson.vue';
import wLeafLet from './wLeafLet.vue';
import wEditor from './wEditor.vue';
import wTable from './wTable.vue';
import wImage from './wImage.vue';
import wObject from './wObject.vue'
import wText from './wText.vue'


import CrudVars from "../lib/CrudVars";

export default {
    name: "c-widget",
    components: {
        wHidden,wSwap, wSwapSelect, wHasmany,wInputSet,wLeafLet,wEditor,wTable,wImage,wObject,wText,
        wInput, wSelect,wSelectButton,wAutocomplete,wCheckbox,wRadio,wBelongsto,wBelongstoMany,
        wCustom,wColorPicker,wDatePicker,wDateRangePicker,wDateText,wTextarea,
        wMultiSelect,wStatus,wTexthtml,wUpload,wUploadAjax,wChip,wPreview,
        wButton,wIcons,wJson
    },
    //extends: CrudComponent,
    extends: wBase,
    emits: ['change'],
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
    },
    /**
     * da togliere quando tutti sono widget essterni
     */
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
    // mounted() {
    //     setTimeout(this._ready, 10);
    // },
    methods: {
        // _ready() {
        //     this.confLoaded = true;
        //     if (this.ready) {
        //         this.ready.apply(this);
        //     }
        // },

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

        add(event) {
            console.log('add event', event)
            this.change(event);
        },
        remove(event) {
            console.log('remove', event);
            this.change(event);
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
        setErrors(errors) {
            this.errors = errors;
        },

        getLabel() {
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
