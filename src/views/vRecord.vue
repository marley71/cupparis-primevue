<template>
    <div>
        <template v-if="inlist && loaded">
        <slot name="content">
            <tr role="row" v-if="isInlist">
                <td class="" role="columnheader">
    <!--                <Button icon="fa fa-trash" class="p-button-outlined p-button-danger"-->
    <!--                    @click="inlistAction(indexInlist,'delete')">-->
    <!--                </Button>-->
                    <Button icon="fa fa-trash" class="p-button-outlined p-button-danger"
                            @click="removeFromList()">
                    </Button>
                    <template v-for="field in getHiddenFields()">
                        <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
                    </template>
                </td>


                <td v-for="(field,indexV) in getVisibleFields()" :key="field" class="" role="cell">

                    <div class="">
                        <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
                    </div>

                </td>
            </tr>
        </slot>
        </template>
        <template v-if="loaded && !inlist">

            <div v-if="loaded">
                <slot name="content">
                    <div v-if="hasActionsDivider()">
                        <Divider align="center" class="actionsDivider">
                                        <span class="p-tag text-white">
                                            {{ title }}
                                        </span>

                        </Divider>
                    </div>

                    <template v-if="type==='v-view'">

                        <template v-for="field in getHiddenFields()">
                            <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
                        </template>
                        <div class="grid">
                            <template v-for="field in getVisibleFields()" :key="field">
                                <div class="py-3" :class="getWidgetLayout(field,'colClass')">
                                    <template v-if="getWidgetLayout(field,'labelPosition')==='float'">
                                            <span class="p-float-label">
                                            <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
                                            <label :for="field">{{ widgetsConfig[field].label }}</label>
                                            </span>
                                    </template>
                                    <template v-else>

                                        <label class="labelTop" :for="field"
                                            v-if="getWidgetLayout(field,'labelPosition')=='top'">
                                            {{ translateUc(widgetsConfig[field].label) }}
                                        </label>
                                        <div class="">
                                            <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
                                        </div>
                                        <label class="labelBottom" :for="field"
                                            v-if="getWidgetLayout(field,'labelPosition')=='bottom'">
                                            {{ translateUc(widgetsConfig[field].label) }}
                                        </label>
                                    </template>
                                </div>

                                <template v-if="getWidgetLayout(field,'hasDivider')">
                                    <Divider align="center" class="col-10 col-offset-1">
                                            <span v-if="getWidgetLayout(field,'dividerLabel')"
                                                class="p-tag text-white">{{ getWidgetLayout(field, 'dividerLabel') }}</span>
                                    </Divider>

                                </template>
                                <template v-else-if="getWidgetLayout(field,'lastInRow')">
                                    <div class="col-12 max-h-0 p-0">&nbsp;</div>
                                </template>
                            </template>
                        </div>
                        <div>
                            <c-action ref="actions" :conf="recordActionsConf" layout="buttons"></c-action>
                        </div>
                    </template>
                    <template v-else>
                        
                    <form ref="form" enctype="multipart/form-data" @submit="handleSubmit" class="p-fluid">
                            <template v-for="field in getHiddenFields()">
                                <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
                            </template>
                            <div class="grid">
                                <template v-for="field in getVisibleFields()" :key="field">
                                    <div class="py-3" :class="getWidgetLayout(field,'colClass')">
                                        <template v-if="getWidgetLayout(field,'labelPosition')==='float'">
                                            <span class="p-float-label">
                                            <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
                                            <label :for="field">{{ widgetsConfig[field].label }}{{ isRequired(field) }}</label>
                                            </span>
                                        </template>
                                        <template v-else>

                                            <label class="labelTop" :for="field"
                                                v-if="getWidgetLayout(field,'labelPosition')=='top'">
                                                {{ translateUc(widgetsConfig[field].label) }}{{ isRequired(field) }}
                                            </label>
                                            <div class="">
                                                <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
                                            </div>
                                            <label class="labelBottom" :for="field"
                                                v-if="getWidgetLayout(field,'labelPosition')=='bottom'">
                                                {{ translateUc(widgetsConfig[field].label) }}{{ isRequired(field) }}
                                            </label>
                                        </template>
                                    </div>

                                    <template v-if="getWidgetLayout(field,'hasDivider')">
                                        <Divider align="center" class="col-10 col-offset-1">
                                            <span v-if="getWidgetLayout(field,'dividerLabel')"
                                                class="p-tag text-white">{{ getWidgetLayout(field, 'dividerLabel') }}</span>
                                        </Divider>

                                    </template>
                                    <template v-else-if="getWidgetLayout(field,'lastInRow')">
                                        <div class="col-12 max-h-0 p-0">&nbsp;</div>
                                    </template>
                                </template>
                            </div>
                        </form>
                        <div class="w-full">
                            <c-action ref="actions" :conf="recordActionsConf" layout="buttons"></c-action>
                        </div>
                    </template>
                </slot>
            </div>
        </template>
    </div>
</template>

<script>
import cWidget from "../widgets/cWidget.vue";
import vBase from './vBase.vue';
import cAction from "../actions/cAction.vue";
import actionConfs from "../confs/actions";
import Server from "../lib/Server";
import viewConfs from "../confs/views";
import { defineRule,validate } from 'vee-validate';
//import { localize,setLocale } from '@vee-validate/i18n';

import AllRules from '@vee-validate/rules';

// configure({
//   // Generates an English message locale generator
//   generateMessage: localize('en', {
//     messages: {
//       required: 'This {field} is required aaaaaa',
//     },
//   }),
// });
// setLocale('en');

export default {
    name: "vRecord",
    extends: vBase,
    props: ['conf', 'inlist', 'indexInlist'],
    emits: ['deleteInlist'],
    components: {cWidget, cAction},
    mounted() {
        window.RECORD = this;
        if (this.autoload)
            this.load();
    },
    data() {
        console.log('vRecord', this.conf);
        let ly = this.conf.layout || {};
        if (ly instanceof String) {
            ly = viewConfs.recordLayouts[ly] || viewConfs.recordLayouts.default;
        } else {
            let tmp = Object.assign({}, viewConfs.recordLayouts.default);
            ly = Object.assign(tmp, ly);
        }
        ly.colClass = this.getColClass(ly.cols);
        //console.log('layout',ly);
        // const { handleSubmit, resetForm } = useForm();
        // const { value, errorMessage } = useField('value', this.validateField);
        return {
            layout: ly,
            isInlist: true,
        }
    },
    methods: {
        // validateField(value) {
        //     if (!value) {
        //         return 'Password is required.';
        //     }
        //     return true;
        // },
        // handleSubmit(values) {
        //     console.log('values',values);
        //     // if (values.value && values.value.length > 0) {
        //     //     //toast.add({ severity: 'info', summary: 'Form Submitted', detail: values.value, life: 3000 });
        //     //     //resetForm();
        //     // }
        //     return false;
        // },
        removeFromList() {
          this.isInlist = false;
        },
        inlistAction(index, action) {
            console.log('EMIT---ACTIONINLIST::: ',index,action);
            this.$emit('actionInlist',index,action);
        },
        hasActionsDivider() {
            return this.actionDivider;
        },
        getColClass(col) {
            switch (col) {
                case 1:
                    return 'col-12'
                case 2:
                    return 'col-12 md:col-6'
                case 3:
                    return 'col-12 md:col-4'
                case 4:
                    return 'col-3 md:col-3'
                case 6:
                    return 'col-2'
                case 12:
                    return 'col-1'
                default:
                    return 'col-12'
            }
        },
        setActions() {
            let that = this;
            // this.menuModel = [
            //     {label: 'View', icon: 'pi pi-fw pi-search', command: () => this.viewRow()},
            //     {label: 'Delete', icon: 'pi pi-fw pi-times', command: () => this.deleteRow()}
            // ]
            that.recordActionsConf = {
                actions: {}
            };
            let rActions = that.actions;
            console.log('actionsConfig', that.actionsConfig)
            for (let k in rActions) {
                let aName = rActions[k];
                let aConf = Object.assign({}, actionConfs['default']);
                aConf = Object.assign(aConf, (actionConfs[aName] || {}));
                if (that.actionsConfig[aName]) {
                    aConf = Object.assign(aConf, that.actionsConfig[aName]);
                }
                //aConf = Object.assign(actionConfs[aName],vConf);
                aConf.modelData = that.value;
                aConf.view = that;
                that.recordActionsConf.actions[aName] = aConf;
            }
            console.log('recordActionsConf', that.recordActionsConf)
        },
        getWidgegConf(index, field, data) {
            let that = this;
            that.widgetsConfig[index][field].value = data;
            return Object.assign({}, that.widgetsConfig[index][field]);
        },
        setWidgetsConfig() {
            let that = this;
            // configurazioni widgets
            if (!that.fields && that.value) {
                that.fields = Object.keys(that.value);
            }

            let fConf = {};
            let fieldsConfig = that.fieldsConfig || {};
            for (let f in that.fields) {
                let key = that.fields[f];
                fConf[key] = {
                    type: that.defaultWidgetType,
                };

                if (fieldsConfig[key]) {
                    fConf[key] = Object.assign(fConf[key], fieldsConfig[key]);
                }
                that.setFieldLabel(key, fConf[key]);
            }
            let widgetsConfig = {};
            for (let f in that.fields) {
                let key = that.fields[f];
                let val = that.value[key];
                let md = that.metadata[key] || {};
                widgetsConfig[key] = Object.assign(md, fConf[key]);
                widgetsConfig[key].value = val;
                widgetsConfig[key].name = that.getFieldName(key);
                widgetsConfig[key].modelData = that.value;
                widgetsConfig[key].view = that;
                widgetsConfig[key].rules = fConf[key].rules || '';
            }
            console.log('vRecord setWidgetsConfig', widgetsConfig)
            that.widgetsConfig = widgetsConfig;

        },
        save(callback) {
            var that = this;
            let route = null;
            that.validate().then((res) => {
                if (!res) {
                    return ;
                }
                if (that.type == 'v-edit') {
                    route = that.createRoute('update');
                    var pk = that.cPk || that.pk || 0;
                    route.setValues({
                        modelName: that.modelName,
                        pk: pk
                    });
                } else {
                    route = that.createRoute('create');
                    route.setValues({
                        modelName: that.modelName,
                    });
                }
                route.setParams(that.getViewData());
                Server.route(route, function (json) {
                    callback(json);
                })
            })
            
            
        },
        getViewData(ref) {
            let that = this;
            let form = ref || 'form';
            const formData = new FormData(that.$refs[form]);
            console.log('formData', formData);
            return formData;
        },
        getWidget(field) {
            return Array.isArray(this.$refs[field])?this.$refs[field][0]:this.$refs[field];
        },
        getAction(name) {
            //console.log('getAction',name,this.recordActionsConf);
            return this.$refs.actions.instance(name);
        },
        getValue() {
            var that = this;
            var values = {};
            for (var k in that.fields) {
                let field = that.fields[k];
                let w = that.getWidget(field);
                if (!w) {
                    console.warn('vRecord.getValue widget not found',field);
                } else {
                    values[field] = w.getValue();
                }
            }
            console.log('rowData ',that.value);
            return values;
        },
        setValue(values) {
            let that = this;
            for (let key in values) {
                if (that.fields.indexOf(key) >= 0) {
                    let w = that.getWidget(key);
                    console.log('set Value w',w,key);
                    if (w ) {
                        //WW = w;
                        
                        w.setValue(values[key]);
                    }
                }
            }
        },
        async validate() {
            console.log(AllRules)
            let that = this;
            console.log('widgetsConfig',that.widgetsConfig);
            
            that.defineRules();
            let isValid = true;
            for (let name in that.widgetsConfig) {
                if (that.widgetsConfig[name].rules) {
                    let widget = that.getWidget(name);
                    console.log('name',name,widget.getValue());
                    let res = await validate(widget.getValue(),
                    that.widgetsConfig[name].rules,{
                        name : name,
                        label : widget.label,
                        bails : false,
                    });
                    console.log(name,'res',res);                      
                    isValid = isValid && res.valid;
                    console.log('ISVALID',isValid);
                    that.getWidget(name).setErrors(res.errors);                          
                }
            }
            console.log('isValid',isValid)
            return isValid;
        },
        defineRules() {
            let that = this;
            let rules = Object.values(that.widgetsConfig).map(a => a.rules).join('|');
            let rulesArray = rules.split('|');
            for (let i in rulesArray) {
                let ruleName = rulesArray[i].split(':')[0];
                if (ruleName) {
                    defineRule(ruleName,AllRules[ruleName]);
                }
            }
        },
        isRequired(field) {
            console.log('widgetsConfig',field,this.widgetsConfig[field].rules)
            if (this.widgetsConfig[field].rules.indexOf('required') >= 0) {
                return ' *';
            }
            return ''
        }
    }
}
</script>

<style lang="scss" scoped>

label.labelTop {
    font-size: 12px;
    color: var(--surface-text);
    position: relative;
    top: -0.25rem;
    left: 0.25rem;
}

</style>
