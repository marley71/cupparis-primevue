<template>
    <div>
        <div v-if="loaded">
            <template v-for="(v,row) in value">
                <template v-for="(col) in getHiddenFields()" :key="col">
                    <c-widget :ref="'w'+row+'_'+col" :conf="getWidgetConf(row,col,v[col])"></c-widget>
                </template>
            </template>
            <slot name="header" :collectionActions="collectionActions">
                <div class="v-list-header">
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
                           :paginator="paginator" :paginatorPosition="paginatorPosition"
                           :lazy="routeName==null?false:true"
                           @page="onPage($event)" @sort="onSort($event)"
                           :total-records="getTotal()"
                           :first="getFirst()"
                           :sortField="getSortField()"
                           :sortOrder="getSortOrder()"


                >
                    <Column v-if="selectionMode" :selection-mode="selectionMode"></Column>
                    <Column v-if="getRecordActionsPosition() == 'start' && hasRecordActions()" :exportable="false" :header="translate('app.actions')">
                        <template #body="slotProps">
                            <c-action :ref="'r'+slotProps.index" :conf="recordActionsConf[slotProps.index % getPerPage()]"
                                      :layout="actionsLayout" :menubar-title="actionsLayoutTitle"></c-action>
                        </template>
                    </Column>
                    <Column v-for="(col) in getVisibleFields()" :field="col" :header="columnLabel(col)" :key="col"
                            :sortable="isSortable(col)" :dir="sortDirection(col)">
                        <template #body="slotProps">
                            <!--                    {{slotProps.data[col]}} {{ slotProps.index}}-->
                            <c-widget :ref="'w'+slotProps.index+'_'+col"
                                      :conf="getWidgetConf(slotProps.index,col,slotProps.data[col])"></c-widget>
                            <!--                    {{getW(slotProps.index,col,slotProps.data[col])}}-->
                            <!--                    <c-widget :conf="widgetsConfig[parseInt(slotProps.index)][col]"></c-widget>-->
                        </template>
                    </Column>
<!--                    <template #footer>-->
<!--&lt;!&ndash;                        {{&ndash;&gt;-->
<!--&lt;!&ndash;                            translate('app.numero-records-lista', null, 0, [(value ? value.length : 0), getFirst() + 1, getFirst() + (value ? value.length : 0), getTotal()])&ndash;&gt;-->
<!--&lt;!&ndash;                        }}&ndash;&gt;-->
<!--                        &lt;!&ndash;                        Ci sono {{value ? value.length : 0 }} record, da {{getFirst()+1}} a {{getFirst() + (value ? value.length : 0) }} su {{getTotal()}}&ndash;&gt;-->
<!--                    </template>-->
                    <Column v-if="getRecordActionsPosition() == 'end' && hasRecordActions()" :exportable="false" :header="translate('app.actions')">
                        <template #body="slotProps">
                            <c-action :ref="'r'+slotProps.index" :conf="recordActionsConf[slotProps.index % getPerPage()]"
                                      :layout="actionsLayout" :menubar-title="actionsLayoutTitle"></c-action>
                        </template>
                    </Column>

                    <template #empty>
                        {{ translate('app.no_records_found') }}
                    </template>
                </DataTable>

            </slot>
            <slot name="footer">

            </slot>
        </div>
        <OverlayPanel ref="panel" :showCloseIcon="true" :dismissable="true" @hide="panelConf.hide()" :class="panelConf.panelClass">
            <div class="w-full">
                <component v-if="panelConf.componentName" :is="panelConf.componentName"
                        :conf="panelConf.componentConf" ></component>
            </div>
        </OverlayPanel>
        <BlockUI :blocked="blocked" fullScreen />
    </div>
</template>

<script>
import cWidget from "../widgets/cWidget.vue";
import cAction from "../actions/cAction.vue";
import actionConfs from "../confs/actions";
import vBase from './vBase.vue';
import CrudCore from "../lib/CrudCore";
const defaultPanelConf = () => {
    return {
        componentName: null,
        componentConf: {},
        panelClass: 'w-8',
        hide() {
            Function.prototype();
        }
    }
}

export default {
    name: "v-list",
    extends: vBase,
    props: ['conf'],
    components: {cAction,cWidget},
    mounted() {
        if (this.autoload)
            this.load();
    },
    data() {
        return {
            rows: 5,
            menuCollection: [],
            panelConf: defaultPanelConf(),
            labelCols : {}
        }
    },
    methods: {
        draw() {
            this.setActions();
            if (this.getPerPage() >= this.getTotal()) {
                this.paginator = false;
            }
            this.loaded = true;

        },

        onRowContextMenu(event) {
            this.$refs.cm.show(event.originalEvent);
        },
        onPage(event) {
            console.log('page event', event)
            if (this.routeName) {
                //let page = Math.floor(event.first / event.rows) +1;
                let page = event.page + 1;
                this.route.setParam('page', page);
                this.reload();
            }

        },
        onSort(event) {
            let that = this;
            console.log('sort event', event)
            if (that.routeName) {
                that.route.setParam('order_field', event.sortField);
                that.route.setParam('order_direction', event.sortOrder > 0 ? 'ASC' : 'DESC');
                that.reload();
            }

        },
        viewRow() {
            console.log('viewRow', this.selectedRow)
        },
        deleteRow() {
            console.log('deleteRow', this.selectedRow)
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
                let aConf = Object.assign({}, actionConfs['default']);
                aConf = Object.assign(aConf, actionConfs[aName]);
                aConf = Object.assign(aConf, (that.actionsConfig[aName] || {}));
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
                    let aConf = Object.assign({}, rActions[aName]);
                    aConf.modelData = that.value[i];
                    aConf.view = that;
                    aConf.index = i;
                    rowActions[aName] = aConf;
                }
                that.recordActionsConf.push({actions: rowActions});
            }
            that.collectionActions.actions = {};
            for (let aName in gActions) {
                let aConf = Object.assign({}, gActions[aName]);
                aConf.modelData = that.value;
                aConf.view = that;
                that.collectionActions.actions[aName] = aConf;
            }
            // console.log('RECORDACTIONS', that.recordActionsConf)
            // console.log('GLOBAL ACTIONS', that.collectionActions);
            this._setMenuCollection();
        },

        getWidgetConf(index, field, data) {
            let that = this;
            index = index % that.getPerPage();
            //console.log('GETWIDGETCONF',index,field,data);
            if (!that.widgetsConfig || !that.widgetsConfig[index] || !that.widgetsConfig[index][field]) {
                console.log('conf non trovata',field,index);
                return {};
            }
            
            if (that.widgetsConfig[index][field] instanceof String) {
                that.widgetsConfig[index][field] = {
                    type : that.widgetsConfig[index][field]
                }
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
            //console.log('FIEDLS CONFIG',fieldsConfig,that.defaultWidgetType);
            // configurazione base mergiata con la configurazione passata
            for (let f in that.fields) {
                let key = that.fields[f];
                fConf[key] = {
                    type: that.defaultWidgetType,
                }
                if (fieldsConfig[key]) {
                    fConf[key] = Object.assign(fConf[key], fieldsConfig[key]);
                }
                that.setFieldLabel(key,fConf[key]);
                that.labelCols[key] = fConf[key].label;
            }
            // configurazione finale dei widgets
            let widgetsConfig = [];
            for (let i in that.value) {
                widgetsConfig.push({});
                for (let f in that.fields) {
                    let key = that.fields[f];
                    let val = that.value[i][key];
                    let md = Object.assign({}, (that.metadata[key] || {}));
                    //console.log('field',key,'value',val);
                    widgetsConfig[i][key] = Object.assign(md, fConf[key]);
                    widgetsConfig[i][key].value = val;
                    widgetsConfig[i][key].name = that.getFieldName(key);
                    widgetsConfig[i][key].modelData = that.value[i];
                    widgetsConfig[i][key].view = that;
                    //widgetsConfig[i][key].label = that.getFieldLabel(key);
                }
            }
            //that.fields = Object.assign([],that.fields);
            //console.log('vList value',that.value)
            //console.log('vList _setWidgetsConfig',widgetsConfig,fieldsConfig)
            that.widgetsConfig = widgetsConfig;
        },
        columnLabel(col) {
          return this.labelCols[col];
        },
        isSortable(field) {
            var that = this;
            if (that.orderFields[field])
                return true;
            return false;

            //return (Object.key(this.orderFields).indexOf(field) >= 0);
        },
        sortDirection(field) {
            let that = this;
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
            if (this.routeName) {
                if (this.pagination && this.pagination.current_page) {
                    first = (this.pagination.current_page - 1) * this.pagination.per_page;
                }
            }
            //console.log('first', first, this.pagination);
            return first;
        },
        getTotal() {
            if (this.routeName)
                return this.pagination.total;
            return this.value ? this.value.length : 0;
        },
        getSortField() {
            return (this.metadata.order && this.metadata.order.field) || null;
        },
        getSortOrder() {
            return (this.metadata.order && this.metadata.order.direction) ? (this.metadata.order.direction.toLowerCase() == 'asc' ? 1 : -1) : null;
        },
        getPerPage() {
            if (this.routeName)
                return this.pagination.per_page;
            let pagination = this.pagination || {};
            return (pagination.per_page ? pagination.per_page : this.getTotal());
            //return this.getTotal();
        },
        getPage() {
            console.log('pagination',this.pagination);
            if (this.routeName)
                return this.pagination.current_page;
            return parseInt(Math.floor(this.getTotal()/this.getPerPage()));
        },
        getRecordAction(index, name) {
            console.log('getRecordAction', index, name,);
            return this.$refs['r' + index].instance(name);
        },
        selectedRows() {
            let that = this;
            let ids = [];
            for (let i in that.selected) {
                console.log('selected', that.selected[i], that.selected[i][that.primaryKey])
                ids.push(that.selected[i][that.primaryKey])
            }
            return ids;
        },
        hasCollectionActions() {
            let that = this;
            //console.log('hasRecordActions',that.recordActionsConf);
            if (that.collectionActions && that.collectionActions.length && (Object.keys(that.collectionActions[0].actions).length > 0))
                return true;
            return false;
        },
        hasRecordActions() {
            let that = this;
            //console.log('hasRecordActions',that.recordActionsConf);
            if (that.recordActionsConf && that.recordActionsConf.length && (Object.keys(that.recordActionsConf[0].actions).length > 0))
                return true;
            return false;
        },
        getRecordActionsPosition() {
            let that = this;
            //console.log('getRecordActionsPosition, hasRecordActions',that.recordActionsConf,that.recordActionsPosition);
            switch (that.recordActionsPosition) {
                case 'end':
                    return 'end';
                default:
                    return 'start';
            }
        },
        _setMenuCollection() {
            let that = this;
            let items = [];
            for (let name in that.collectionActions.actions) {
                items.push({
                    label: CrudCore.translate(that.collectionActions.actions[name].text),
                    icon: that.collectionActions.actions[name].icon,
                    command: () => that.collectionActions.actions[name].execute(),
                    disabled: that.collectionActions.actions[name].disabled,
                    action: name,
                })
            }
            that.menuCollection = items;
            console.log('menuCollection',that.menuCollection,that.collectionActions)
        },
        showPanel(event, conf) {
            if (conf) {
                this.panelConf = Object.assign(defaultPanelConf(),conf);
            } else {
                //this.panelConf.componentName = null;
                this.panelConf = defaultPanelConf();
            }
            this.$refs.panel.show(event);
        },
        hidePanel() {
            this.$refs.panel.hide();
        },

        getValue() {
            let that = this;
            let vs = [];
            for (let i in that.value) {
                let r = that.getRowData(i);
                vs.push(r);
            }
            return vs;
        },

        getRowData (index) {
            var that = this;
            var values = {};
            for (var k in that.fields) {
                let field = that.fields[k];
                //console.log('w ref','w'+index+'_'+field)
                let w = that.$refs['w'+index+'_'+field];
                if (w) {
                    //WW = w;
                    //console.log('w',w);
                    values[field] = w[0].instance().getValue()
                }
            }
            //console.log('rowData values',values);
            return values;
        },
        getVisibleFields() {
            var that = this;
            var visible = [];
            for (let i in that.fields) {
                let keyField = that.fields[i];
                if ( (that.hiddenColumns.indexOf(keyField) < 0) &&
                    (!that.isHiddenField(keyField)) ){
                    visible.push(keyField)
                }
            }
            //console.log('VISIBLE FIELDS',visible);
            return visible;
        },
        hideColumn(field) {
            if (this.hiddenColumns.indexOf(field) < 0) {
                this.hiddenColumns.push(field)
            }
        },
        showColumn(field) {
            let idx = this.hiddenColumns.indexOf(field);
            if ( idx >= 0) {
                this.hiddenColumns.splice(idx,1);
            } else {
                console.warn('widget',field,'is not hidden column');
            }
        }
    }
}
</script>

<style lang="scss" scoped>

.v-list-header {
    border-bottom: 2px solid var(--primary-color);
}

.p-datatable {
    :deep(.p-datatable-header) {
        background-color: transparent;
        padding: 1.25rem 0;
        margin-top: 0;
        margin-bottom: 1rem;
        border-top: 2px solid var(--primary-color);
    }

    :deep(.p-datatable-header .surface-section) {
        padding-left: 0.75rem !important;
        padding-right: 0.75rem !important;
    }

    :deep(.p-datatable-wrapper) {
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

}


</style>
