<template>
    <div v-if="loaded">
        <DataTable :value="value" responsiveLayout="scroll" v-model:selection="selected" :rows="getPerPage()" :paginator="paginator"
            :lazy="routeName==null?false:true" @page="onPage($event)" @sort="onSort($event)"
                   :total-records="getTotal()"
                   :first="getFirst()"
                   :sortField="getSortField()"
                   :sortOrder="getSortOrder()"

        >
            <!--
                  contextMenu v-model:contextMenuSelection="selectedRow" @rowContextmenu="onRowContextMenu"
                  :scrollable="true" scrollHeight="100px"
                  -->

            <template #header>
                <template v-if="Object.keys(collectionActions).length == 0">
                    <div class="table-header">
                        {{title}}
                    </div>
                </template>

                <Menubar v-else :model="menuCollection" class="w-full">
                    <template  v-if="title" #start>
                        <span>{{title}}</span>
                    </template>
<!--                    <template #end>-->
<!--                        <div v-if="!label" class="col-12">-->
<!--                            <div class="p-inputgroup">-->
<!--                                <InputText v-model="newTargetCase" placeholder="Enter target url or id to be added" style="width:300px"/>-->
<!--                                <Button icon="pi pi-plus" class="p-button-secondary" @click="newTargetInput"/>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </template>-->
                </Menubar>
            </template>
            <Column :selection-mode="selectionMode"></Column>
            <Column :exportable="false" header="Actions">
                <template #body="slotProps">
                    <c-action :ref="'r'+slotProps.index" :conf="recordActionsConf[slotProps.index]" :layout="'simple'"></c-action>
                </template>
            </Column>
            <Column v-for="(col) in fields" :field="col" :header="col" :key="col" :sortable="isSortable(col)" :dir="sortDirection(col)">
                <template #body="slotProps">
<!--                    {{getWidgetConf(slotProps.index,col,slotProps.data[col])}}-->
                    <c-widget :conf="getWidgetConf(slotProps.index,col,slotProps.data[col])"></c-widget>
                </template>
            </Column>
            <template #footer>
                In total there are {{value ? value.length : 0 }} rows.
            </template>

        </DataTable>
<!--        <ContextMenu :model="menuModel" ref="cm" />-->
<!--        <Dialog ></Dialog>-->
<!--        <Widget :conf="{}"></Widget>-->
    </div>
</template>

<script>
import cWidget from "../widgets/cWidget";
import cAction from "../actions/cAction";
//import actionConfs from "../confs/actions";

import vList from './vList';

export default {
    name: "vListEdit",
    extends: vList,
    props : ['conf'],
    components: {cWidget,cAction},
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

        setWidgetsEditConfig: function () {
            let that = this;
            let fConf = {};
            let fieldsEditConfig = that.fieldsEditConfig || {};
            for (let f in that.fields) {
                let key = that.fields[f];
                fConf[ key ] = {
                    type : 'w-input',
                    label : that.getFieldLabel(key)
                }
                if (fieldsEditConfig[key]) {
                    fConf[key] = Object.assign(fConf[key],fieldsEditConfig[key]);
                }
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
            var that = this;
            var values = {};
            for (var k in that.widgetsEdit[index]) {
                //values[k] = that.getWidgetEdit(index,k);
                //console.log('edit r',that.view.widgetsEdit[that.index][k])
                var sref = that.widgetsEdit[index][k].cRef; //  're-' + that.index + '-' +  k;
                if (that.store.cRefs[sref])
                    values[k] = that.getWidgetEdit(index,k).getValue();
            }
            console.log('rowEditData values',values);
            return values;
        },
        getRowData (index) {
            var that = this;
            var values = {};
            for (var k in that.widgets[index]) {
                //values[k] = that.getWidget(index,k);
                //console.log('edit r',that.view.widgetsEdit[that.index][k])
                var sref = that.widgets[index][k].cRef; //  're-' + that.index + '-' +  k;
                if (that.store.cRefs[sref])
                    values[k] = that.getWidget(index,k).getValue();
            }
            console.log('rowData values',values);
            return values;
        }
    }
}
</script>

<style scoped>

</style>
