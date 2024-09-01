<template>
    <span>
        <template v-if="type==='w-hidden'">
            <input type="hidden" :name="name" v-model="value" v-bind="extraBind" @change="_change"/>
        </template>
        <template v-else-if="type==='w-image'">
            <Avatar v-if="imageType == 'avatar'" :image="value" v-bind="extraBind" shape="circle" :class="imageClass"></Avatar>
            <img v-else :src="value" v-bind="extraBind" :class="imageClass"/>
        </template>
        <template v-else-if="type==='w-table'">
<!--            <template v-if="value || value.length > 0">-->
<!--                <div class="flex" v-for="(item,index) in value" :key="index">-->
<!--                    <div class="flex" v-for="column in getKeys()" :field="column" :key="column">-->
<!--                        {{item[column]}}-->
<!--                    </div>-->
<!--                </div>-->

<!--            </template>-->

            <DataTable v-if="value || value.length > 0" :value="value">
                <Column v-for="column in getKeys()" :field="column" :key="column" :header="column">
                    <template #body="slotProps">
                        {{slotProps.data[column]}}
                    </template>
                </Column>
            </DataTable>
        </template>
        <template v-else-if="type=='w-input'">
            <Password v-if="inputType == 'password'" :inputProps="{'name':name}" :name="name" v-model="value" toggleMask
                      v-bind="extraBind"
                      @change="_change" :class="errors.length?'p-invalid':''"
                      :promptLabel="translate('app.scegli-password')" :weakLabel="translate('app.password-semplice')"
                      :mediumLabel="translate('app.password-media')"
                      :strongLabel="translate('app.password-complessa')"/>
            <InputText v-else class="w-full" :name="name" :type="inputType" v-model="value" v-bind="extraBind"
                       @change="_change" :class="errors.length?'p-invalid':''"></InputText>
        </template>
        <template v-else-if="type=='w-select'">
            <div>
                <input type="hidden" :name="name" :value="value">
                <Dropdown class="w-full" :name="name" v-model="value" :options="options"
                          option-label="label" option-value="id"
                          :placeholder="placeholder || translate('app.seleziona')"
                          v-bind="extraBind" @change="_change" :disabled="_disabled()">
                        <template #value="slotProps">
                            <div v-if="slotProps.value"
                                 :class="'select-button-option select-button-option-'+name+ ' select-button-option-'+name+'-'+slotProps.value"
                            >
                                {{ domainValues[slotProps.value]?domainValues[slotProps.value]:slotProps.value }}

                                <!--                    v-html="slotProps.value.label"-->
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div
                                :class="'select-button-option select-button-option-'+name+ ' select-button-option-'+name+'-'+slotProps.option.id"
                                v-html="slotProps.option.label">
                            </div>
                        </template>
                </Dropdown>
            </div>

        </template>
        <template v-else-if="type=='w-select-button'">
            <input type="hidden" :name="name" v-model="value">
            <SelectButton :name="name" v-model="value" :options="options"
                          option-label="label" option-value="id"
                          v-bind="extraBind" @change="_change">
                <template #option="slotProps">
                    <div
                        :class="'select-button-option select-button-option-'+name+ ' select-button-option-'+name+'-'+slotProps.option.id"
                        v-html="slotProps.option.label">
                    </div>
                </template>
            </SelectButton>
        </template>
        <template v-else-if="type=='w-autocomplete'">
            <div>
                <input type="hidden" :name="name" v-model="value">
                <div class="p-inputgroup">

                    <Button icon="fa fa-times" @click="_change($event,'clear')"/>
                    <AutoComplete class="w-full" :name="name" v-model="autocompleteValue" :suggestions="suggestions"
                                  @complete="search" :option-label="_getAutocompleteLabel" option-value="id"
                                  v-bind="extraBind" @item-select="itemSelect"/>
                </div>
            </div>
        </template>
        <template v-else-if="type=='w-checkbox'">
            <div class="w-full flex" :class="direction=='row'?'flex-row':'flex-column'">
                <div class="field-checkbox mr-2" v-for="(label,key) in domainValues" :key="key">
                    <Checkbox :name="getFieldName()" v-model="value" :value="key" v-bind="extraBind" @change="_change"/>
                    <label :for="key" v-html="label"></label>
                </div>
            </div>
        </template>
        <template v-else-if="type=='w-radio'">
            <div class="w-full flex border-1 border-round-sm surface-border p-2"
                 :class="direction=='row'?'flex-row':'flex-column'">
                <div class="field-radiobutton mr-2 mb-1" v-for="(label,key) in domainValues" :key="key">
                    <RadioButton :name="name" v-model="value" :value="key" v-bind="extraBind" @change="_change"/>
                    <label :for="key" v-html="label"></label>
                </div>
            </div>
        </template>
        <template v-else-if="type=='w-text'">
            <span :class="textClass">
                <template v-if="iconPrefix || prefix">
                    <i v-if="iconPrefix" :class="iconPrefix"></i>
                    <span v-if="prefix">{{prefix}}</span>
                </template>
                <template v-if="numberFormat">
                    {{new Intl.NumberFormat((numberFormat.language?numberFormat.language:'it-IT'), (numberFormat.options?numberFormat.options:{})).format(value)}}
                </template>
                <template v-else>
                    {{ value }}
                </template>
                <template v-if="iconSuffix || suffix">
                    <i v-if="iconSuffix" :class="iconSuffix"></i>
                    <span v-if="suffix">{{suffix}}</span>
                </template>
            </span>
        </template>
        <template v-else-if="type=='w-textdiv'">
            <div :class="textClass">{{ value }}</div>
        </template>
        <template v-else-if="type=='w-textp'">
            <p :class="textClass">{{ value }}</p>
        </template>
        <template v-else-if="type=='w-hasmany'">
            <w-hasmany ref="wRef" :conf="conf" @change="_change"></w-hasmany>
        </template>
        <template v-else-if="type=='w-belongsto'">
            <div v-if="value && Object.keys(value).length > 0">
                <a v-if="_hasHref()" :href="_href()">
                    <span v-for="(field,index) in labelFields" :key="index">
                        <span v-if="(separator && (index !== 0))">{{ separator }}</span>{{ value[field] }}
                    </span>
                </a>
                <template v-else-if="_hasClick">
                    <div  @click="_click">
                        <span v-for="(field,index) in labelFields" :key="index">
                            <span v-if="(separator && (index !== 0))">{{ separator }}</span>{{ value[field] }}
                        </span>
                    </div>
                </template>
                <template>
                    <span v-for="(field,index) in labelFields" :key="index">
                        <span v-if="(separator && (index !== 0))">{{ separator }}</span>{{ value[field] }}
                    </span>
                </template>

            </div>
            <div v-else>
                <template v-if="noDataLabel">{{translate(noDataLabel)}}</template>
                <!-- oggetto belongsto null -->
            </div>
        </template>
        <template v-else-if="type=='w-belongsto-many'">
            <template v-if="value">
                <div v-for="(item,key) in value" :key="key">
                    <span v-for="(field,index) in labelFields" :key="index">
                        <span v-if="(separator && (index !== 0))">{{ separator }}</span>{{ item[field] }}
                    </span>
                </div>
            </template>
            <div v-else>
                <!-- oggetto belongsto-mangy null -->
            </div>
        </template>
        <template v-else-if="type=='w-custom'">
            <div v-html="value"></div>
        </template>
        <template v-else-if="type=='w-color-picker'">
            <ColorPicker v-model="value" @change="_change" v-bind="extraBind"/>
        </template>
        <template v-else-if="type=='w-date-picker'">
            <div class="crud-datepicker">
                <input type="hidden" :name="name" v-model="value">
                <div class="p-inputgroup ">
                    <Button icon="fa fa-times" @click="_change($event,'clear')" v-if="buttonClear"/>
                    <Calendar class="w-full" :showButtonBar="true" v-model="dateValue" @date-select="_change"
                              inputDateFormat="YYYY-MM-DD" date-format="dd/mm/yy"
                              v-bind="extraBind"
                              @clear-click="_change($event,'clear')"/>
                </div>
            </div>
        </template>
        <template v-else-if="type=='w-date-range-picker'">
            <div class="crud-datepicker">
                <input type="hidden" :name="name" v-model="value">
                <div class="p-inputgroup">
                    <Button icon="fa fa-times" @click="_change($event,'clear')" v-if="buttonClear"/>
                    <Calendar class="w-full" :showButtonBar="true" v-model="dateValue" @date-select="_change"
                              inputDateFormat="YYYY-MM-DD" date-format="dd/mm/yy"
                              v-bind="extraBind" selectionMode="range"
                              @clear-click="_change($event,'clear')"/>
                </div>
            </div>
        </template>
        <template v-else-if="type=='w-date-text'">
            <template v-if="iconPrefix || prefix">
                <i v-if="iconPrefix" :class="iconPrefix"></i>
                <span v-if="prefix">{{prefix}}</span>
            </template>
            <span>{{ getFormattedValue() }}</span>
            <template v-if="iconSuffix || suffix">
                <i v-if="iconSuffix" :class="iconSuffix"></i>
                <span v-if="suffix">{{suffix}}</span>
            </template>
        </template>
        <template v-else-if="type=='w-textarea'">
            <Textarea v-model="value" :name="name" @change="_change" class="w-full"
                      :placeholder="placeholder"></Textarea>
        </template>
        <template v-else-if="type=='w-multi-select'">
            <MultiSelect class="w-full" v-model="value" :options="options" optionLabel="name" optionValue="code"
                         :placeholder="placeholder" :filter="filter" display="chip" @change="_change()">
                <template #value="slotProps">
                    <template v-if="!slotProps.value || slotProps.value.length === 0">
                        <div class="p-1">{{ name }}</div>
                    </template>
                    <template v-else>

                        <div class="inline-flex align-items-center py-1 border-round"
                             v-for="option of slotProps.value" :key="option">
                            <div class="p-multiselect-label-container" data-pc-section="labelcontainer">
                            <div class="p-multiselect-label" data-pc-section="label">
                            <div class="p-multiselect-token" data-pc-section="token">
                                <span class="p-multiselect-token-label"
                                      data-pc-section="tokenlabel">{{ getMultiSelectLabel(option) }}</span>
                                <svg @click="removeMultiSelect(option)" width="14" height="14" viewBox="0 0 14 14" fill="none"
                                     xmlns="http://www.w3.org/2000/svg" class="p-icon p-multiselect-token-icon"
                                     aria-hidden="true"
                                     data-pc-section="removetokenicon"><path fill-rule="evenodd" clip-rule="evenodd"
                                                                             d="M7 14C5.61553 14 4.26215 13.5895 3.11101 12.8203C1.95987 12.0511 1.06266 10.9579 0.532846 9.67879C0.00303296 8.3997 -0.13559 6.99224 0.134506 5.63437C0.404603 4.2765 1.07129 3.02922 2.05026 2.05026C3.02922 1.07129 4.2765 0.404603 5.63437 0.134506C6.99224 -0.13559 8.3997 0.00303296 9.67879 0.532846C10.9579 1.06266 12.0511 1.95987 12.8203 3.11101C13.5895 4.26215 14 5.61553 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14ZM7 1.16667C5.84628 1.16667 4.71846 1.50879 3.75918 2.14976C2.79989 2.79074 2.05222 3.70178 1.61071 4.76768C1.16919 5.83358 1.05367 7.00647 1.27876 8.13803C1.50384 9.26958 2.05941 10.309 2.87521 11.1248C3.69102 11.9406 4.73042 12.4962 5.86198 12.7212C6.99353 12.9463 8.16642 12.8308 9.23232 12.3893C10.2982 11.9478 11.2093 11.2001 11.8502 10.2408C12.4912 9.28154 12.8333 8.15373 12.8333 7C12.8333 5.45291 12.2188 3.96918 11.1248 2.87521C10.0308 1.78125 8.5471 1.16667 7 1.16667ZM4.66662 9.91668C4.58998 9.91704 4.51404 9.90209 4.44325 9.87271C4.37246 9.84333 4.30826 9.8001 4.2544 9.74557C4.14516 9.6362 4.0838 9.48793 4.0838 9.33335C4.0838 9.17876 4.14516 9.0305 4.2544 8.92113L6.17553 7L4.25443 5.07891C4.15139 4.96832 4.09529 4.82207 4.09796 4.67094C4.10063 4.51982 4.16185 4.37563 4.26872 4.26876C4.3756 4.16188 4.51979 4.10066 4.67091 4.09799C4.82204 4.09532 4.96829 4.15142 5.07887 4.25446L6.99997 6.17556L8.92106 4.25446C9.03164 4.15142 9.1779 4.09532 9.32903 4.09799C9.48015 4.10066 9.62434 4.16188 9.73121 4.26876C9.83809 4.37563 9.89931 4.51982 9.90198 4.67094C9.90464 4.82207 9.84855 4.96832 9.74551 5.07891L7.82441 7L9.74554 8.92113C9.85478 9.0305 9.91614 9.17876 9.91614 9.33335C9.91614 9.48793 9.85478 9.6362 9.74554 9.74557C9.69168 9.8001 9.62748 9.84333 9.55669 9.87271C9.4859 9.90209 9.40996 9.91704 9.33332 9.91668C9.25668 9.91704 9.18073 9.90209 9.10995 9.87271C9.03916 9.84333 8.97495 9.8001 8.9211 9.74557L6.99997 7.82444L5.07884 9.74557C5.02499 9.8001 4.96078 9.84333 4.88999 9.87271C4.81921 9.90209 4.74326 9.91704 4.66662 9.91668Z"
                                                                             fill="currentColor"></path></svg>
                            </div>
                            </div>
                            </div>

                            <input type="hidden" :name="getFieldName()" :value="option">
<!--                            <div>{{ getMultiSelectLabel(option) }}</div>-->
                        </div>
                    </template>
                </template>
            </MultiSelect>
        </template>
        <template v-else-if="type=='w-swap'">
            <w-swap ref="wRef" :conf="wConf"></w-swap>
        </template>
        <template v-else-if="type=='w-swap-select'">
            <w-swap-select ref="wRef" :conf="wConf"></w-swap-select>
        </template>
        <template v-else-if="type=='w-status'">
            <div>
                <template v-if="statusType=='icon'">
                    <i :class="currentValue"></i>
                </template>
                <template v-else-if="statusType=='action'">
                    <span class="cursor-pointer" v-html="domainValuesHtml[value]" @click="executeFunc('w-status', value)" >

                    </span>
<!--                    {{ currentValue }}-->
                </template>
                <template v-else>
                    <span v-html="domainValuesHtml[value]"></span>
                </template>
            </div>
        </template>
        <template v-else-if="type=='w-texthtml'">
            <input type="hidden" :name="name" v-model="value"/>
            <Editor v-model="value" editorStyle="height: 320px" @text-change="_change">
                <template v-if="toolbar" #toolbar>
                    <span class="ql-formats">
                        <button v-for="(cssClass,index) in toolbar" :key="index" :class="cssClass"></button>
                    </span>
                </template>
            </Editor>
        </template>
        <template v-else-if="type=='w-upload'">
            <FileUpload mode="basic" name="ciaoo" :auto="true" :customUpload="true" @uploader="uploadFile"
                        :multiple="false" v-bind="extraBind" :pt="{file:{attrs:{name:'ciccio'}}}" />
        </template>
        <template v-else-if="type== 'w-upload-ajax' ">
            <div>
                <input type="hidden" v-model="value" :name="getFieldName()">
                <Message v-if="error" severity="error" :closable="false">{{ errorMessage }}</Message>
                <div class="flex">
                    <FileUpload mode="basic" :auto="true" :customUpload="true" @uploader="uploadFile"
                                :multiple="false" v-bind="extraBind"/>
                    <div class="ml-5">
                        <div class="mt-3" v-if="fileInfo">
                            <template
                                v-if="['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].indexOf(fileInfo.mimetype) >= 0">
                                <i class="fa fa-file-excel fa-2xl"></i>
                            </template>
                            <template v-else-if="['application/pdf'].indexOf(fileInfo.mimetype) >= 0">
                                <i class="fa fa-file-pdf fa-2xl"></i>
                            </template>
                            <template v-else-if="['image/jpeg'].indexOf(fileInfo.mimetype) >= 0">
                                <img :src="fileInfo.url"/>
                            </template>
                            <template v-else>
                                <i class="fa fa-file fa-2xl"></i>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else-if="type=='w-chip'">
            <Chips v-model="value" @add="add" @remove="remove"/>
        </template>
        <template v-else-if="type=='w-preview'">
            <div>
                <div class="mt-3" v-if="value">
                    <template
                        v-if="['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].indexOf(value.mimetype) >= 0">
                        <i class="fa fa-file-excel fa-2xl"></i>
                    </template>
                    <template v-else-if="['application/pdf'].indexOf(value.mimetype) >= 0">
                        <i class="fa fa-file-pdf fa-2xl"></i>
                    </template>
                    <template v-else-if="['image/jpeg'].indexOf(value.mimetype) >= 0">
                        <img :src="getRealUrl(value.url)" :height="height"/>
                    </template>
                    <template v-else>
                        <i class="fa fa-file fa-2xl"></i>
                    </template>
                </div>
            </div>
        </template>
        <template v-else-if="type=='w-button'">
            <Button :class="cssClass" @click="_click" :icon="_icon()"
                    :disabled="_disabled()" :title="_title()">{{value}}</Button>
        </template>
        <template v-else>
            <component :is="type" :conf="wConf"></component>
<!--            <div>Widget non riconosciuto {{ type }}</div>-->
        </template>
        <div class="overflow-hidden">
            <span class="text-red-400" v-for="(error,index) in errors" :key="index">
               {{ error }} <span v-if="parseInt(index) < (Object.keys(errors).length-1)">,&nbsp;</span>
            </span>
        </div>
    </span>
</template>

<script>
import WrapperConf from "../widgets/WrapperConf";
import Server from "../lib/Server";
import CrudComponent from "../CrudComponent.vue";
import wHasmany from "../widgets/wHasmany.vue";
import moment from "moment";
import wSwap from "../widgets/wSwap.vue";
import wSwapSelect from "../widgets/wSwapSelect.vue";
import CrudVars from "../lib/CrudVars";

export default {
    name: "c-widget",
    components: {wSwap, wSwapSelect, wHasmany},
    extends: CrudComponent,
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
            if (!(ext[k] instanceof Function)) {
                dt[k] = ext[k];
            }
        }
        dt.wConf = ext;
        dt.errors = [];
        //console.debug('widget conf',dt);
        return dt;
    },
    mounted() {
        setTimeout(this._ready, 10);
    },
    methods: {
        _ready() {
            if (this.ready) {
                this.ready.apply(this);
            }
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
        _change(event, type) {
            let that = this;
            let evt = event || {};
            evt.widget = this;
            //console.log('EVENTSSS', evt);
            // if (evt && (type != 'clear')) {
            //     // valore invariato, non emetto il change
            //     if (evt.value == this.value) {
            //         return ;
            //     }
            // }
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
                        let date = event ? moment(event).format(inputDateFormat) : null;
                        //console.log("DATE",date, inputDateFormat)
                        //var date = new Date();
                        this.value = [date,date];
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

        _disabled(event) {
            if (this.disabled instanceof Function) {
                return this.disabled.apply(this,[event]);
            }
            return this.disabled;
        },
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
        getValue() {
            let that = this;
            switch (that.conf.type) {
                case 'w-hasmany':
                    return that.$refs.wRef.getValue();
                default:
                    return that.value;
            }

        },
        setErrors(errors) {
            this.errors = errors;
        },
        getFormattedValue() {
            let that = this;
            //return that.translate(that.invalidDateString)
            var md = moment(that.value);
            //console.log('displayFormat',that.displayFormat);
            if (md.isValid()) {
                return md.format(that.displayFormat)
            } else {
                return that.translate(that.invalidDateString)+ '*' ;
            }
        },
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
        getMultiSelectLabel(option) {
            // console.log('option', option, this.options, this.domainValues);
            return this.domainValues[option];
        },
        removeMultiSelect(option) {
            var id = this.value.indexOf(option);
            this.value.splice(id,1);
        },
        itemSelect() {
            this.instance().setValue(this.autocompleteValue.id)
            //let that = this;

            // that.value = that.autocompleteValue.id;
            // setTimeout(function () {
            //     that._change();
            // },100)

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
        /**
         * ritorna il valore dell'autocomplete in base alla configurazione di labelFields
         * @param event
         * @private
         */
        _getAutocompleteLabel(event) {
            return this.instance().getAutocompleteLabel.apply(this,[event]);
        },

    }
}
</script>

<style scoped>

label {
    font-size: 12px;

}

</style>
