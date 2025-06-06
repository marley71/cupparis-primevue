<template>
    <span>
        <template v-if="type==='w-hidden'">
            <input type="hidden" :name="name" v-model="value" v-bind="extraBind" @change="_change"/>
        </template>
        <template v-else-if="type==='w-editor'">
            <w-editor ref="wRef" :conf="conf"></w-editor>
        </template>
        <template v-else-if="type==='w-leaf-let'">
            <w-leaf-let ref="wRef" :conf="conf" @change="_change"></w-leaf-let>
        </template>
        <template v-else-if="type==='w-image'">
            <Avatar v-if="imageType == 'avatar'" :image="value" v-bind="extraBind" shape="circle" :class="imageClass"></Avatar>
            <img v-else :src="value" v-bind="extraBind" :class="imageClass"/>
        </template>
        <template v-else-if="type==='w-table'">
            <DataTable v-if="value || value.length > 0" :value="value">
                <Column v-for="column in getKeys()" :field="column" :key="column" :header="column">
                    <template #body="slotProps">
                        {{slotProps.data[column]}}
                    </template>
                </Column>
            </DataTable>
        </template>
        <template v-else-if="type==='w-object'">
            <div class="card  w-full">
                <h2 v-if="title">{{title}}</h2>
                <table class="card-body w-full">
                    <tr class="" v-for="(item,key) in value" :key="key">
                        <td>{{key}}</td>
                        <td>{{ item }}</td>
                    </tr>
                </table>
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
        <template v-else-if="type=='w-input-set'">
            <w-input-set ref="wRef" :conf="conf" @change="_change"></w-input-set>
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
            <div class="w-full flex flex-wrap border-1 border-round-sm surface-border p-2"
                 :class="direction=='row'?'flex-row':'flex-column'">
                <div class="field-checkbox mb-1"
                     :class="rowType=='grid'?'w-12 md:w-6 xl:w-3':'mr-2 '" v-for="(label,key) in domainValues" :key="key">
                    <Checkbox :name="getFieldName()" v-model="value" :value="key" v-bind="extraBind" @change="_change"/>
                    <label :for="key" v-html="label"></label>
                </div>
            </div>
        </template>
        <template v-else-if="type=='w-radio'">
            <div class="w-full flex flex-wrap border-1 border-round-sm surface-border p-2"
                 :class="direction=='row'?'flex-row':'flex-column'">
                <div class="field-radiobutton mb-1"
                     :class="rowType=='grid'?'w-12 md:w-6 xl:w-3':'mr-2 '"
                     v-for="(label,key) in domainValues" :key="key">
                    <RadioButton :name="name" v-model="value" :value="key" v-bind="extraBind" @change="_change"/>
                    <label :for="key" v-html="label" :class="value==key?'font-bold':''"></label>
                </div>
            </div>
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
<!--                    <span class="ql-formats">-->
<!--                        <button v-for="(cssClass,index) in toolbar" :key="index" :class="cssClass"></button>-->
<!--                    </span>-->
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
                            <template v-else-if="['image/png','image/jpeg'].indexOf(fileInfo.mimetype) >= 0">

                              <div class='w-5rem h-4rem m-auto bg-contain bg-no-repeat' :style="bgUrl(fileInfo.url)"></div>

<!--                                <img :src="fileInfo.url"/>-->
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
        <template v-else-if="type=='w-icons'">
            <div class="flex">
                <template v-for="(item,k) in domainValues">
                    <i :class="item + value===k?' text-primary':''"></i>
                </template>
            </div>
        </template>
        <template v-else-if="type=='w-json'">
            <div :class="jsonClass" >
                <div><a title="Espandi" @click="jsonClass=(jsonClass=='maximizable-div'?'maximizable-div-fullscreen':'maximizable-div')"><i class="fa fa-window-maximize"></i></a></div>
                <pre v-html="JSON.stringify(value, null, 2)" ></pre>

            </div>
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
import _cWidget from '../../widgets/_cWidget.vue'

import wBase from './wBase.vue';
import wHasmany from "./wHasmany.vue";
import wSwap from "./wSwap.vue";
import wSwapSelect from "./wSwapSelect.vue";
import wInputSet from './wInputSet.vue';
import wLeafLet from './wLeafLet.vue';
import wEditor from './wEditor.vue';


export default {
    name: "c-widget",
    extends: _cWidget,
    components: {wSwap, wSwapSelect, wHasmany,wInputSet,wLeafLet,wEditor},
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
