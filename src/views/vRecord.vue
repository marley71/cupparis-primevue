<template>

        <div v-if="loaded">
            <div>
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

                                    <label class="labelTop" :for="field" v-if="getWidgetLayout(field,'labelPosition')=='top'">
                                        {{ translateUc(widgetsConfig[field].label) }}
                                    </label>
                                    <div class="">
                                        <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
                                    </div>
                                    <label class="labelBottom" :for="field" v-if="getWidgetLayout(field,'labelPosition')=='bottom'">
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
                    <c-action ref="actions" :conf="recordActionsConf" layout="buttons" ></c-action>
                </div>
            </template>
            <template v-else>
                <form ref="form" enctype="multipart/form-data" @submit.prevent="handleSubmit(!v$.$invalid)" class="p-fluid" >
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

                                    <label class="labelTop" :for="field" v-if="getWidgetLayout(field,'labelPosition')=='top'">
                                        {{ translateUc(widgetsConfig[field].label) }}
                                    </label>
                                    <div class="">
                                        <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
                                    </div>
                                    <label class="labelBottom" :for="field" v-if="getWidgetLayout(field,'labelPosition')=='bottom'">
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

                </form>
                <div>
                    <c-action ref="actions" :conf="recordActionsConf" layout="buttons" ></c-action>
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
                };

                if (fieldsConfig[key]) {
                    fConf[key] = Object.assign(fConf[key],fieldsConfig[key]);
                }
                that.setFieldLabel(key,fConf[key]);
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

<style lang="scss" scoped>

label.labelTop {
    font-size:12px;
    color : var(--surface-text);
    position: relative;
    top: -0.25rem;
    left: 0.25rem;
}

</style>
