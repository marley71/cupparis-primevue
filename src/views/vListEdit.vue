<template>
    <div v-if="loaded">
        <template v-for="(v,row) in value">
            <template v-for="(col) in getHiddenFields()" :key="col">
                <c-widget :ref="'w'+row+'_'+col" :conf="getWidgetConf(row,col,v[col])"></c-widget>
            </template>
        </template>
        <slot name="header" :collectionActions="collectionActions">
            <div class="v-list-edit-header">
                <div class="surface-section px-4 py-5 md:px-6 lg:px-8">
                    <div class="flex align-items-start flex-column lg:justify-content-start lg:align-items-center lg:flex-row">
                        <div class="mr-5 pr-3 border-right-none lg:border-right-1">
                            <div class="font-medium text-3xl text-900">{{ translateUc(modelName + '.label', null,1) }}</div>
                            <div class="flex align-items-center text-700 flex-wrap">
                                <div class="mr-5 flex align-items-center mt-3">
                                    <!--                                    <i class="pi pi-users mr-2"></i>-->
                                    <span>{{
                                            translate('app.numero-records-lista', null, 0, [(value ? value.length : 0), getFirst() + 1, getFirst() + (value ? value.length : 0), getTotal()])
                                        }}</span>
                                </div>
                            </div>
                        </div>
                        <template v-if="Object.keys(collectionActions).length > 0">
                            <div class="mt-5 lg:mt-0">
                                <c-action layout="buttons" :conf="collectionActions"></c-action>
                            </div>

                        </template>
                    </div>
                </div>
            </div>

            

        </slot>
        <slot name="content" :value="value" :metadata="metadata" :widgetsConfig="widgetsConfig">
            <DataTable :value="value" responsiveLayout="scroll" v-model:selection="selected" 
                :rows="getPerPage()" 
                :paginator="paginator"
                :lazy="routeName==null?false:true" 
                @page="onPage($event)" @sort="onSort($event)"
                :total-records="getTotal()"
                :first="getFirst()"
                :sortField="getSortField()"
                :sortOrder="getSortOrder()"

            >
                <Column :selection-mode="selectionMode"></Column>
                <!-- <Column v-if="getRecordActionsPosition() == 'start' && hasRecordActions()" :exportable="false" :header="translate('app.actions')">
                    <template #body="slotProps">
                        <c-action :ref="'r'+slotProps.index" :conf="recordActionsConf[slotProps.index % getPerPage()]"
                                    :layout="actionsLayout" :menubar-title="actionsLayoutTitle"></c-action>
                    </template>
                </Column> -->
                <Column :exportable="false" header="Actions">
                    <template #body="slotProps">
                        <c-action :ref="'r'+slotProps.index % getPerPage()" :conf="recordActionsConf[slotProps.index % getPerPage()]" :layout="'simple'"></c-action>
                    </template>
                </Column>
                <Column v-for="(col) in fields" :field="col" :header="col" :key="col" :sortable="isSortable(col)" :dir="sortDirection(col)">
                    <template #body="slotProps">
    <!--                    {{getWidgetConf(slotProps.index,col,slotProps.data[col])}}-->
                        <c-widget v-if="!editMode[slotProps.index % getPerPage()]" :ref="'w'+slotProps.index % getPerPage()+'_'+col"
                                :conf="getWidgetConf(slotProps.index % getPerPage(),col,slotProps.data[col])"></c-widget>
                        <c-widget v-if="editMode[slotProps.index % getPerPage()]" :ref="'we'+slotProps.index % getPerPage() +'_'+col"
                                :conf="getWidgetEditConf(slotProps.index % getPerPage(),col,slotProps.data[col])"></c-widget>
                    </template>
                </Column>
                <template #footer>
                    In total there are {{value ? value.length : 0 }} rows.
                </template>

            </DataTable>
        </slot>
        <BlockUI :blocked="blocked" fullScreen />
<!--        <ContextMenu :model="menuModel" ref="cm" />-->
<!--        <Dialog ></Dialog>-->
<!--        <Widget :conf="{}"></Widget>-->
    </div>
</template>

<script>
//import cWidget from "../widgets/cWidget.vue";
import cAction from "../actions/cAction.vue";
import Server from "../lib/Server";

import vList from './vList.vue';

export default {
    name: "vListEdit",
    extends: vList,
    props : ['conf'],
    components: {cAction},
    mounted() {
        window.VLISTEDIT = this;
        this.load();
    },
    data() {
      return {
          rows:5,
          menuCollection : [],
          editMode : {},
      }
    },
    methods: {
        // draw: function () {
        //     var that = this;
        //     that.editMode = new Array(that.value.length).fill(false);
        //     that.createWidgets();
        //     that.createWidgetsEdit();
        //     that.checkValidActions();
        //     that.createActionsConf();
        //     that.loading = false;
        //     //window.COLLECTION = this;
        //     setTimeout(function () {
        //         that.completed();
        //     }, 10);
        // },
        setWidgetsConfig() {
            this._setWidgetsConfig();
            this._setWidgetsEditConfig();
        },
        _setWidgetsEditConfig: function () {
            let that = this;
            let fConf = {};
            let fieldsEditConfig = that.fieldsEditConfig || {};
            for (let f in that.fields) {
                let key = that.fields[f];
                fConf[ key ] = {
                    type : 'w-input',
                }
                if (fieldsEditConfig[key]) {
                    fConf[key] = Object.assign(fConf[key],fieldsEditConfig[key]);
                }
                that.setFieldLabel(key,fConf[key]);
                that.labelCols[key] = fConf[key].label;
            }

            // configurazione finale dei widgets
            let widgetsEditConfig = [];
            for (let i in that.value) {
                widgetsEditConfig.push({});
                for (let f in that.fields) {
                    let key = that.fields[f];
                    let val = that.value[i][key];
                    let md = Object.assign({},(that.metadata[key] || {}));
                    //console.log('field',key,'value',val);
                    widgetsEditConfig[i][key] = Object.assign(md,fConf[key]);
                    widgetsEditConfig[i][key].value = val;
                    widgetsEditConfig[i][key].name = that.getFieldName(key);
                    widgetsEditConfig[i][key].modelData = that.value[i];
                    //widgetsConfig[i][key].label = that.getFieldLabel(key);
                }
            }

            that.widgetsEditConfig = widgetsEditConfig;


            // that.setKeys();
            // //console.log('Vlist-create widgets',that.data);
            // var widgetsEdit = [];
            // //var data = that.data;
            // //var keys = that.getKeys();
            // for (var i in that.value) {
            //     widgetsEdit.push({});
            //     for (var k in that.keys) {
            //         var key = that.keys[k];
            //         var dconf = that._defaultWidgetConfig(key, 'fieldsConfigEditMode');
            //         // se non c'e' la configurazione in modalità edit lo forzo ad essere un w-input
            //         if (!that.fieldsConfigEditMode || !that.fieldsConfigEditMode[key])
            //             dconf.type = 'w-input';
            //         dconf.cRef = that.getRefId(that.uid, 'redit', i, key);
            //         dconf.modelData = that.value[i];
            //         dconf.value = that.value[i][key];
            //         dconf.name = that.getFieldName(key);
            //         if (!('label' in dconf)) {
            //             dconf.label = key;
            //             dconf.label = that.translate(dconf.label + '.label', that.langContext);
            //         } else {
            //             dconf.label = that.translate(dconf.label);
            //         }
            //         widgetsEdit[i][key] = dconf;
            //     }
            // }
            // that.widgetsEdit = widgetsEdit;
        },
        getWidgetEditConf(index,field,data) {
            let that = this;
            if (!that.widgetsEditConfig || !that.widgetsEditConfig[index] || !that.widgetsEditConfig[index][field]) {
                return {};
            }
            that.widgetsEditConfig[index][field].value = data;
            return that.widgetsEditConfig[index][field];
        },
        setEditMode: function (index) {
            var that = this;
            //console.log('edit mode',index);
            if (that.actions.indexOf('action-delete') >= 0)
                that.hideRA(index, 'action-delete');
            if (that.actions.indexOf('action-edit-mode') >= 0)
                that.hideRA(index, 'action-edit-mode');
            if (that.actions.indexOf('action-view') >= 0)
                that.hideRA(index, 'action-view');

            if (that.actions.indexOf('action-view-mode') >= 0)
                that.showRA(index, 'action-view-mode');
            if (that.actions.indexOf('action-save-row') >= 0)
                that.showRA(index, 'action-save-row');
            //that.recordActions[index]['action-delete'].setVisible(false);
            that.editMode[index] = true;
        },
        setViewMode: function (index) {
            var that = this;
            that.editMode[index] = false;
            if (that.actions.indexOf('action-delete') >= 0)
                that.showRA(index, 'action-delete');
            if (that.actions.indexOf('action-edit-mode') >= 0)
                that.showRA(index, 'action-edit-mode');
            if (that.actions.indexOf('action-view') >= 0)
                that.showRA(index, 'action-view');

            if (that.actions.indexOf('action-view-mode') >= 0)
                that.hideRA(index, 'action-view-mode');
            if (that.actions.indexOf('action-save-row') >= 0)
                that.hideRA(index, 'action-save-row');
        },
        hideRA: function (index, name) {
            var that = this;
            var a = that.getRecordAction(index, name);
            a.setVisible(false);
        },
        showRA (index, name) {
            var that = this;
            var a = that.getRecordAction(index, name);
            a.setVisible(true);
        },
        getWidgetEdit (row, key) {
            var wConf = this.widgetsEdit[row][key];
            return this.store.cRefs[wConf.cRef];
        },
        setRowData (index,values) {
            var that = this;
            console.log('fields',that.fields,'values',values);
            for (var i in that.fields) {
                var key = that.fields[i];
                var we = that.getWidgetEdit(index,key);
                var w = that.getWidget(index,key);
                if (we) we.setValue(values[key]);
                if (w) w.setValue(values[key]);
            }
        },
        getRowEditData (index) {
            let that = this;
            let values = {};
            for (let i in that.fields) {
                let field = that.fields[i];
                console.log('prendo ' +index + ' ' + field,that.$refs['we'+index+'_'+field]);
                let w = that.$refs['we'+index+'_'+field];
                if (Array.isArray(w)) {
                    w = w[0];
                }
                if (w) {
                    values[field] = w.getValue()
                }
            }
            console.log('rowEditData values',values);
            return values;
        },
        /**
         * salva una riga
         * @param {indice della row da salvare} index 
         */
        save(index) {
            let that = this;
            var values = that.getRowEditData(index);
            //var id = that.view.value[that.index][that.view.primaryKey];
            var r = that.createRoute('update');
            r.setValues({
                modelName: that.modelName,
                pk : that.value[index][that.primaryKey]
            });

            //that.setRouteValues(r);
            r.setParams(values);
            Server.route(r, function (json) {
                if (json.error) {
                    that.errorDialog(json.msg);
                    return;
                }
                var msg = json.msg?json.msg:that.translate('app.salvataggio-ok');
                that.alertSuccess(msg,3000);
                var values = json.result;
                that.setRowData(that.index,values);
                that.setViewMode(that.index);
                //that.view.reload();
            })
            console.log('values', values);
        }
    }
}
</script>

<style scoped>

</style>
