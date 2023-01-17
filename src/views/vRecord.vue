<template>

        <div v-if="loaded">
            <h5 class="text-center">{{title}}</h5>
            <form ref="form" enctype="multipart/form-data" @submit.prevent="handleSubmit(!v$.$invalid)" class="p-fluid" >
                <template v-for="field in getHiddenFields()">
                    <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
                </template>
                <div class="grid">
                    <div v-for="field in getVisibleFields()" class="field" :class="layout.colClass" :key="field">
                        <div v-if="layout.labelPosition=='top'">{{ widgetsConfig[field].label}}</div>
                        <div class="">
                            <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
                            <!--                        <InputText :id="field" v-model="v$.name.$model" :class="{'p-invalid':v$.name.$invalid && submitted}" />-->
                            <!--                        <label :for="field" :class="{'p-error':v$.name.$invalid && submitted}">Name*</label>-->
                        </div>
                        <!--                    <small v-if="(v$.name.$invalid && submitted) || v$.name.$pending.$response" class="p-error">{{v$.name.required.$message.replace('Value', 'Name')}}</small>-->
                        <div v-if="layout.labelPosition=='bottom'">{{ widgetsConfig[field].label}}</div>
                    </div>
                </div>

<!--                <div class="field">-->
<!--                    <div class="p-float-label p-input-icon-right">-->
<!--                        <i class="pi pi-envelope" />-->
<!--                        <InputText id="email" v-model="v$.email.$model" :class="{'p-invalid':v$.email.$invalid && submitted}" aria-describedby="email-error"/>-->
<!--                        <label for="email" :class="{'p-error':v$.email.$invalid && submitted}">Email*</label>-->
<!--                    </div>-->
<!--                    <span v-if="v$.email.$error && submitted">-->
<!--                            <span id="email-error" v-for="(error, index) of v$.email.$errors" :key="index">-->
<!--                            <small class="p-error">{{error.$message}}</small>-->
<!--                            </span>-->
<!--                        </span>-->
<!--                    <small v-else-if="(v$.email.$invalid && submitted) || v$.email.$pending.$response" class="p-error">{{v$.email.required.$message.replace('Value', 'Email')}}</small>-->
<!--                </div>-->
<!--                <div class="field">-->
<!--                    <div class="p-float-label">-->
<!--                        <Password id="password" v-model="v$.password.$model" :class="{'p-invalid':v$.password.$invalid && submitted}" toggleMask>-->
<!--                            <template #header>-->
<!--                                <h6>Pick a password</h6>-->
<!--                            </template>-->
<!--                            <template #footer="sp">-->
<!--                                {{sp.level}}-->
<!--                                <Divider />-->
<!--                                <p class="mt-2">Suggestions</p>-->
<!--                                <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">-->
<!--                                    <li>At least one lowercase</li>-->
<!--                                    <li>At least one uppercase</li>-->
<!--                                    <li>At least one numeric</li>-->
<!--                                    <li>Minimum 8 characters</li>-->
<!--                                </ul>-->
<!--                            </template>-->
<!--                        </Password>-->
<!--                        <label for="password" :class="{'p-error':v$.password.$invalid && submitted}">Password*</label>-->
<!--                    </div>-->
<!--                    <small v-if="(v$.password.$invalid && submitted) || v$.password.$pending.$response" class="p-error">{{v$.password.required.$message.replace('Value', 'Password')}}</small>-->
<!--                </div>-->
<!--                <div class="field">-->
<!--                    <div class="p-float-label">-->
<!--                        <Calendar id="date" v-model="date" :showIcon="true" />-->
<!--                        <label for="date">Birthday</label>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="field">-->
<!--                    <div class="p-float-label">-->
<!--                        <Dropdown id="country" v-model="country" :options="countries" optionLabel="name" />-->
<!--                        <label for="country">Country</label>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="field-checkbox">-->
<!--                    <Checkbox id="accept" name="accept" value="Accept" v-model="v$.accept.$model" :class="{'p-invalid':v$.accept.$invalid && submitted}" />-->
<!--                    <label for="accept" :class="{'p-error': v$.accept.$invalid && submitted}">I agree to the terms and conditions*</label>-->
<!--                </div>-->
<!--                <Button type="submit" label="Submit" class="mt-2" />-->
            </form>
            <div>
                <c-action ref="actions" :conf="recordActionsConf" layout="buttons" ></c-action>
            </div>

    </div>
</template>

<script>
import cWidget from "../widgets/cWidget.vue";
import vBase from './vBase.vue';
import cAction from "../actions/cAction.vue";
import actionConfs from "../confs/actions";
import Server from "../lib/Server";
import viewConfs from "../confs/views";

export default {
    name: "vRecord",
    extends: vBase,
    props : ['conf'],
    components: {cWidget,cAction},
    mounted() {
        window.RECORD = this;
        if (this.autoload)
            this.load();
    },
    data() {
        console.log('vRecord',this.conf);
      let ly = this.conf.layout || {};
      if (ly instanceof String) {
          ly = viewConfs.recordLayouts[ly] || viewConfs.recordLayouts.default;
      } else {
          let tmp = Object.assign({},viewConfs.recordLayouts.default);
          ly = Object.assign(tmp,ly);
      }
      ly.colClass = this.getColClass(ly.cols);
      //console.log('layout',ly);
      return {
          layout : ly
      }
    },
    methods: {
        getColClass(col) {
          switch (col) {
              case 1:
                  return 'col-12'
              case 2:
                  return 'col-12 md:col-6'
              case 3:
                  return 'col-12 md:col-4'
              case 4:
                  return 'col-3'
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
                actions :{}
            };
            let rActions = that.actions;
            console.log('actionsConfig',that.actionsConfig)
            for (let k in rActions) {
                let aName = rActions[k];
                let aConf = Object.assign({},actionConfs['default']);
                aConf = Object.assign(aConf,(actionConfs[aName] || {}));
                if (that.actionsConfig[aName]) {
                    aConf = Object.assign(aConf,that.actionsConfig[aName]);
                }
                //aConf = Object.assign(actionConfs[aName],vConf);
                aConf.modelData = that.value;
                aConf.view = that;
                that.recordActionsConf.actions[ aName ] = aConf;
            }
            console.log('recordActionsConf',that.recordActionsConf)
        },
        getWidgegConf(index,field,data) {
            let that = this;
            that.widgetsConfig[index][field].value = data;
            return Object.assign({},that.widgetsConfig[index][field]);
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
                fConf[ key ] = {
                    type : that.defaultWidgetType,
                    label : that.getFieldLabel(key)
                };

                if (fieldsConfig[key]) {
                    fConf[key] = Object.assign(fConf[key],fieldsConfig[key]);
                }

            }
            let widgetsConfig = {};
            for (let f in that.fields) {
                let key = that.fields[f];
                let val = that.value[key];
                let md = that.metadata[key] || {};
                widgetsConfig[key] = Object.assign(md,fConf[key]);
                widgetsConfig[key].value = val;
                widgetsConfig[key].name = that.getFieldName(key);
                widgetsConfig[key].modelData = that.value;
                widgetsConfig[key].view = that;
                //widgetsConfig[key].label = that.getFieldLabel(key);
            }
            console.log('vRecord setWidgetsConfig',widgetsConfig)
            that.widgetsConfig = widgetsConfig;

        },
        save(callback) {
            var that = this;
            let route = null;
            if (that.type == 'v-edit') {
                route = that.createRoute('update');
                var pk = that.cPk || that.pk || 0;
                route.setValues({
                    modelName: that.modelName,
                    pk : pk
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
        },
        getViewData() {
            let that = this;
            const formData = new FormData(that.$refs.form);
            console.log('formData',formData);
            return formData;
        },
        getWidget(field) {
            return this.$refs[field];
        },
        getAction(name) {
            //console.log('getAction',name,this.recordActionsConf);
            return this.$refs.actions.instance(name);
        },
        // isHiddenField: function (key) {
        //     let type = this.defaultWidgetType;
        //     if (this.fieldsConfig[key]) {
        //         if (this.widgetsConfig.type == 'w-hidden') {
        //             return true;
        //         }
        //     }
        //     return (type == 'w-hidden');
        // },
    }
}
</script>

<style scoped>

</style>
