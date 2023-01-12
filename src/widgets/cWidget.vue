<template>
    <template v-if="type=='w-hidden'">
        <input type="hidden" :name="name" v-model="value" v-bind="extraBind" @change="change"/>
    </template>
    <template v-if="type=='w-input'">
        <InputText class="w-full" :name="name" type="text" v-model="value" v-bind="extraBind" @change="change"></InputText>
    </template>
    <template v-else-if="type=='w-select'">
        <input type="hidden" :name="name" :value="value">
        <Dropdown class="w-full" :name="name" v-model="value" :options="options" option-label="label" option-value="id" :placeholder="placeholder"
                  v-bind="extraBind" @change="change"/>
    </template>
    <template v-else-if="type=='w-autocomplete'">
        <input type="hidden" :name="name" v-model="value">
        <AutoComplete class="w-full" :name="name" v-model="autocompleteValue" :suggestions="suggestions"
                      @complete="search" option-label="label" option-value="id"
                      v-bind="extraBind" @change="change" @item-select="itemSelect"/>
    </template>
    <template v-else-if="type=='w-checkbox'">
        <div class="w-full flex" :class="layout=='row'?'flex-row':'flex-column'">
            <div class="field-checkbox mr-2" v-for="(label,key) in domainValues" :key="key">
                <Checkbox :name="name" v-model="value" :value="key" v-bind="extraBind" @change="change"/>
                <label :for="key" v-html="label"></label>
            </div>
        </div>
    </template>
    <template v-else-if="type=='w-radio'">
        <div class="w-full flex" :class="layout=='row'?'flex-row':'flex-column'">
            <div class="field-radiobutton mr-2" v-for="(label,key) in domainValues" :key="key">
                <RadioButton :name="name" v-model="value" :value="key" v-bind="extraBind"  @change="change"/>
                <label :for="key" v-html="label"></label>
            </div>
        </div>
    </template>
    <template v-else-if="type=='w-text'">
        <span>{{value}}</span>
    </template>
    <template v-else-if="type=='w-hasmany'">
        <w-hasmany ref="wRef" :conf="conf" @change="change"></w-hasmany>
    </template>
    <template v-else-if="type=='w-belongsto'">
        <span v-for="(field,index) in labelFields" :key="index">
            <span v-if="(separator && (index !== 0))">{{separator}}</span>{{value[field]}}
        </span>
    </template>
    <template v-else-if="type=='w-custom'">
        <div v-html="value"></div>
    </template>
    <template v-else-if="type=='w-color-picker'">
        <ColorPicker v-model="value" @change="change"/>
    </template>
    <template v-else-if="type=='w-date-picker'">
        <Calendar v-model="value" @date-select="change" />
    </template>
    <template v-else-if="type=='w-date-text'">
        <span>{{getFormattedValue()}}</span>
    </template>
    <template v-else-if="type=='w-textarea'">
        <Textarea v-model="value" @change="change"></Textarea>
    </template>
    <template v-else-if="type=='w-multi-select'">
        <MultiSelect class="w-full" v-model="value" :options="options" optionLabel="name" optionValue="code"
                     :placeholder="placeholder" :filter="filter" @change="change()" >
<!--            <template #value="slotProps">-->
<!--                <template v-if="!slotProps.value || slotProps.value.length === 0">-->
<!--                    <div class="p-1">{{name}}</div>-->
<!--                </template>-->
<!--                <template v-else>-->
<!--                    <div class="inline-flex align-items-center py-1 px-2 border-round mr-2" v-for="option of slotProps.value" :key="option">-->
<!--                        <input type="hidden" :name="getFieldName()" :value="option">-->
<!--                        <div>{{getLabel(option)}}kk {{slotProps}}</div>-->
<!--                    </div>-->
<!--                </template>-->
<!--            </template>-->
        </MultiSelect>
    </template>
    <template v-else-if="type=='w-swap'">
        <w-swap  ref="wRef" :conf="wConf"></w-swap>
    </template>
    <template v-else-if="type=='w-status'">
        <span v-if="statusType=='icon'">
            <i :class="currentValue"></i>
        </span>
        <span v-else>
            {{currentValue}}
        </span>
    </template>
    <template v-else-if="type=='w-texthtml'">
        <Editor v-model="value" editorStyle="height: 320px" @text-change="change">
            <template v-if="toolbar" #toolbar>
                <span class="ql-formats">
                    <button v-for="(cssClass,index) in toolbar" :key="index" :class="cssClass"></button>
<!--                    <button class="ql-bold"></button>-->
<!--                    <button class="ql-italic"></button>-->
<!--                    <button class="ql-underline"></button>-->
                </span>
            </template>
        </Editor>
    </template>
    <template v-else-if="type=='w-upload'">
        <FileUpload mode="basic" :name="getFieldName()" :auto="true"  :customUpload="true" @uploader="uploadFile"  :multiple="false" />
    </template>

    <template v-else-if="type=='w-upload-ajax'">
        <FileUpload mode="basic" :name="getFieldName()" :auto="true" :customUpload="true" @uploader="uploadFile"  :multiple="false" />
    </template>
    <template v-else-if="type=='w-chip'">
        <Chips v-model="value" @add="add" @remove="remove"/>
    </template>
    <template v-else>
        <div>Widget non riconosciuto {{type}}</div>
    </template>
</template>

<script>
import WrapperConf from "../widgets/WrapperConf";
import Server from "../lib/Server";
import CrudComponent from "../CrudComponent.vue";
import wHasmany from "../widgets/wHasmany.vue";
//import moment from "moment";
import wSwap from "../widgets/wSwap.vue";

export default {
    name: "c-widget",
    components: {wSwap, wHasmany},
    extends: CrudComponent,
    props : {
        conf : Object,
    },
    watch : {
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
    created() {
        let that = this;
        //console.log('CREATEDDD',that)
        that.overwriteMethods = {};
        var __call = function (lk) {
            that[lk] = function () {
                var localk = new String(lk);
                return that.overwriteMethods[localk].apply(that, arguments);
            }
        }

        for (let k in that.wConf) {
            //console.log('k',k,ext[k]);

            if (that.wConf[k] instanceof Function) {
                //console.log('found method',k);
                that.overwriteMethods[k] = that.wConf[k];
                __call(k);
            }
        }
        this.Server = Server;
    },
    data() {
        let that = this;
        window.WW = this;
        let wc = new WrapperConf();
        let ext = wc.loadConf(that.conf);
        let dt = {};
        for (let k in ext) {
            if (!(ext[k] instanceof Function) ) {
                dt[k] = ext[k];
            }
        }
        dt.wConf = ext;
        //console.log('widget finalData',dt);
        return dt;
    },
    mounted() {
      setTimeout(this.ready,10);
    },
    methods : {
        ready() {

        },
        change(event) {
            let evt = event || {};
            evt.widget = this;
            console.log('EVENTSSS',evt);
            switch (this.type) {
                case 'w-complete':
                    this.value = event.id;
                    break;
                default:
                    break;
            }
            this.$emit('change',evt);
        },
        add(event) {
            console.log('add event',event)
            this.change(event);
        },
        remove(event) {
            console.log('remove',event);
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

                if(element.length > 0)
                    params.push(element);
            });

            return params;
        },
        setValue(val) {
          this.value = val;
        },
        getValue() {
            return this.value;
        },
        getFormattedValue() {
            let that = this;
            return that.translate(that.invalidDateString)
            // var md = moment(that.value);
            // console.log('displayFormat',that.displayFormat);
            // if (md.isValid()) {
            //     return md.format(that.displayFormat)
            // } else {
            //     return that.translate(that.invalidDateString) ;
            // }
        },
        getFieldName() {
            return this.name;
        },

        getLabel() {
            //console.log('options',options)
            return this.label;
        },
        itemSelect() {
            this.value = this.autocompleteValue.id;
        },
        instance() {
            if (this.$refs.wRef) {
                return this.$refs.wRef;
            }
            return this;
        }
        // uploadFile(event) {
        //     console.log('uploadevent22',event,this);
        // }
    }
}
</script>

<style scoped>

</style>
