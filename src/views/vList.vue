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
                <c-action v-else layout="menubar" :conf="collectionActions"></c-action>

<!--                <Menubar v-else model="menuCollection" class="w-full">-->
<!--                    <template  v-if="title" #start>-->
<!--                        <span>{{title}}</span>-->
<!--                    </template>-->
<!--&lt;!&ndash;                    <template #end>&ndash;&gt;-->
<!--&lt;!&ndash;                        <div v-if="!label" class="col-12">&ndash;&gt;-->
<!--&lt;!&ndash;                            <div class="p-inputgroup">&ndash;&gt;-->
<!--&lt;!&ndash;                                <InputText v-model="newTargetCase" placeholder="Enter target url or id to be added" style="width:300px"/>&ndash;&gt;-->
<!--&lt;!&ndash;                                <Button icon="pi pi-plus" class="p-button-secondary" @click="newTargetInput"/>&ndash;&gt;-->
<!--&lt;!&ndash;                            </div>&ndash;&gt;-->
<!--&lt;!&ndash;                        </div>&ndash;&gt;-->
<!--&lt;!&ndash;                    </template>&ndash;&gt;-->
<!--                </Menubar>-->
            </template>
            <Column :selection-mode="selectionMode"></Column>
            <Column :exportable="false" header="Actions">
                <template #body="slotProps">
                    <c-action :ref="'r'+slotProps.index" :conf="recordActionsConf[slotProps.index]" :layout="'simple'"></c-action>
                </template>
            </Column>
            <Column v-for="(col) in fields" :field="col" :header="col" :key="col" :sortable="isSortable(col)" :dir="sortDirection(col)">
                <template #body="slotProps">
<!--                    {{slotProps.data[col]}} {{ slotProps.index}}-->
                    <c-widget :ref="'w'+slotProps.index+'_'+col" :conf="getWidgetConf(slotProps.index,col,slotProps.data[col])"></c-widget>
<!--                    {{getW(slotProps.index,col,slotProps.data[col])}}-->
<!--                    <c-widget :conf="widgetsConfig[parseInt(slotProps.index)][col]"></c-widget>-->
                </template>
            </Column>
            <template #footer>
                In total there are {{value ? value.length : 0 }} rows.
            </template>

        </DataTable>
<!--        <ContextMenu :model="menuModel" ref="cm" />-->
<!--        <Dialog ></Dialog>-->
<!--        <c-widget :conf="{}"></c-widget>-->
    </div>
</template>

<script>
import cWidget from "../widgets/cWidget";
import cAction from "../actions/cAction";
import actionConfs from "../confs/actions";

import vBase from './vBase';

export default {
    name: "vList",
    extends: vBase,
    props : ['conf'],
    components: {cWidget,cAction},
    mounted() {
        window.VLIST = this;
        this.load();
    },
    data() {
      return {
          rows:5,
          menuCollection : [],
      }
    },
    methods: {
        draw() {
            this.setActions();
            this.loaded = true;
        },

        onRowContextMenu(event) {
            this.$refs.cm.show(event.originalEvent);
        },
        onPage(event) {
            console.log('page event',event)
            if (this.routeName) {
                //let page = Math.floor(event.first / event.rows) +1;
                let page = event.page + 1;
                this.route.setParam('page',page);
                this.reload();
            }

        },
        onSort(event) {
            let that = this;
            console.log('sort event',event)
            if (that.routeName) {
                that.route.setParam('order_field',event.sortField);
                that.route.setParam('order_direction',event.sortOrder>0?'ASC':'DESC');
                that.reload();
            }

        },
        viewRow() {
            console.log('viewRow',this.selectedRow)
        },
        deleteRow() {
            console.log('deleteRow',this.selectedRow)
        },

        setActions() {
            let that = this;
            this.menuModel = [
                {label: 'View', icon: 'pi pi-fw pi-search', command: () => this.viewRow()},
                {label: 'Delete', icon: 'pi pi-fw pi-times', command: () => this.deleteRow()}
            ]

            let rActions = {};
            let gActions = {};
            for (let i in that.actions) {
                let aName = that.actions[i];
                let aConf = Object.assign({},actionConfs['default']);
                aConf = Object.assign(aConf,actionConfs[aName]);
                aConf = Object.assign(aConf,(that.actionsConfig[aName] || {}));
                if (aConf.type == 'record') {
                    rActions[aName] = aConf;
                } else {
                    gActions[aName] = aConf;
                }
            }
            that.recordActionsConf = [];
            that.collectionActions = {};


            //let rActions = ['action-delete','action-edit','action-view'];
            for (let i in that.value) {
                let rowActions = {};
                for (let aName in rActions) {
                    //let aName = rActions[k];
                    let aConf = Object.assign({},rActions[aName]);
                    aConf.modelData = that.value[i];
                    aConf.view = that;
                    aConf.index = i;
                    rowActions[ aName ] = aConf;
                }
                that.recordActionsConf.push({ actions:rowActions});
            }
            for (let aName in gActions) {
                let aConf = Object.assign({},gActions[aName]);
                aConf.modelData = that.value;
                aConf.view = that;
                that.collectionActions[ aName ] = aConf;
            }
            console.log('RECORDACTIONS',that.recordActionsConf)
            console.log('GLOBAL ACTIONS',that.collectionActions);
            this._setMenuCollection();
        },

        getWidgetConf(index,field,data) {
            let that = this;
            if (!that.widgetsConfig || !that.widgetsConfig[index] || !that.widgetsConfig[index][field]) {
                return {};
            }
            that.widgetsConfig[index][field].value = data;
            return that.widgetsConfig[index][field];
        },
        setWidgetsConfig() {
            this._setWidgetsConfig();
        },
        _setWidgetsConfig() {
            let that = this;
            // configurazioni widgets
            if (!that.fields && that.value.length) {
                that.fields = Object.keys(that.value[0]);
            }
            let fConf = {};
            let fieldsConfig = that.fieldsConfig || {};
            // configurazione base mergiata con la configurazione passata
            for (let f in that.fields) {
                let key = that.fields[f];
                fConf[ key ] = {
                    type : 'w-text',
                    label : that.getFieldLabel(key)
                }
                if (fieldsConfig[key]) {
                    fConf[key] = Object.assign(fConf[key],fieldsConfig[key]);
                }
            }
            // configurazione finale dei widgets
            let widgetsConfig = [];
            for (let i in that.value) {
                widgetsConfig.push({});
                for (let f in that.fields) {
                    let key = that.fields[f];
                    let val = that.value[i][key];
                    let md = Object.assign({},(that.metadata[key] || {}));
                    //console.log('field',key,'value',val);
                    widgetsConfig[i][key] = Object.assign(md,fConf[key]);
                    widgetsConfig[i][key].value = val;
                    widgetsConfig[i][key].name = that.getFieldName(key);
                    widgetsConfig[i][key].modelData = that.value[i];
                    //widgetsConfig[i][key].label = that.getFieldLabel(key);
                }
            }
            //that.fields = Object.assign([],that.fields);
            //console.log('vList value',that.value)
            //console.log('vList setWidgetsConfig',widgetsConfig)
            that.widgetsConfig = widgetsConfig;
        },
        isSortable(field) {
            var that = this;
            if (that.orderFields[field])
                return true;
            return false;

            //return (Object.key(this.orderFields).indexOf(field) >= 0);
        },
        sortDirection(field) {
            let that =this;
            var order = that.metadata.order || {};
            if (order.field == field) {
                if (order.direction.toLowerCase() == 'asc')
                    return 1;
                return -1
            }
            return null;
        },
        getFirst() {
            let first = 0;
            if (this.routeName)
                first = (this.pagination.current_page-1) * this.pagination.per_page;
            console.log('first',first);
            return first;
        },
        getTotal() {
            if (this.routeName)
                return this.pagination.total;
            return this.value?this.value.length:0;
        },
        getSortField() {
            return (this.metadata.order && this.metadata.order.field) || null;
        },
        getSortOrder() {
            return (this.metadata.order && this.metadata.order.direction)?(this.metadata.order.direction.toLowerCase()=='asc'?1:-1):null;
        },
        getPerPage() {
            if (this.routeName)
                return this.pagination.per_page;
            let pagination = this.pagination || {};
            return (pagination.per_page?pagination.per_page:this.getTotal());
            //return this.getTotal();
        },
        getRecordAction(index,name) {
            console.log('getRecordAction',index,name);
            return this.$refs['r'+index].instance(name);
        },
        selectedRows() {
            let that = this;
            let ids = [];
            for (let i in that.selected) {
                console.log('selected',that.selected[i],that.selected[i][that.primaryKey])
                ids.push(that.selected[i][that.primaryKey])
            }
            return ids;
        },
        _setMenuCollection() {
            let that = this;
            let items = [];
            for (let name in that.collectionActions) {
                items.push({
                    label : that.collectionActions[name].text,
                    icon : that.collectionActions[name].icon,
                    command: () => that.collectionActions[name].execute(),
                    disabled : that.collectionActions[name].disabled,
                    action : name,
                })
            }
            that.menuCollection = items;
            // that.menuCollection.push({
            //     label : 'Actions',
            //     items : items,
            // })
        }
    }
}
</script>

<style scoped>

</style>
