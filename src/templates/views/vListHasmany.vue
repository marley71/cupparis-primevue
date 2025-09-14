<template>
  <div>
        <div v-if="loaded">
            <template v-for="(v,row) in value" :key="row">
                <template v-for="(col) in getHiddenFields()" :key="col">
                    <component :is="getWidgetType(row,col)" :ref="'w'+row+'_'+col" :conf="getWidgetConf(row,col,v[col])"></component>
                </template>
            </template>
            <slot name="header" :collectionActions="collectionActions">

            </slot>
            <slot name="content" :value="value" :metadata="metadata" :widgetsConfig="widgetsConfig">
                <DataTable :value="value" responsiveLayout="scroll"
                        v-model:selection="selected"
                        :rows="getPerPage()"
                        :paginator="false"
                        :total-records="getTotal()"
                        :first="getFirst()"
                        :sortField="getSortField()"
                        :sortOrder="getSortOrder()"
                        dataKey="dataKey"

                >
                    <!--
                          contextMenu v-model:contextMenuSelection="selectedRow" @rowContextmenu="onRowContextMenu"
                          :scrollable="true" scrollHeight="100px"
                          -->

                    <template #header v-if="menuCollection.length > 0">

                        <Menubar  :model="menuCollection" class="w-full">
                            <template  v-if="title" #start>
                                <span>{{title}}</span>
                            </template>
                        </Menubar>
                    </template>
                    <Column v-if="selectionMode" :selection-mode="selectionMode"></Column>
                    <Column v-if="hasRecordActions()" :exportable="false" header="Actions">
                        <template #body="slotProps">
                            <c-action :ref="'r'+slotProps.index" :conf="recordActionsConf[slotProps.index]"
                                      :layout="'simple'"></c-action>
                        </template>
                    </Column>
                    <Column v-for="(col) in getVisibleFields()" :field="col" :header="columnLabel(col)" :key="col"
                            :sortable="isSortable(col)" :dir="sortDirection(col)">
                        <template #body="slotProps">
                            <!--                    {{slotProps.data[col]}} {{ slotProps.index}}-->
                            <component :is="getWidgetType(slotProps.index,col)" :ref="'w'+slotProps.index+'_'+col"
                                      :conf="getWidgetConf(slotProps.index,col,slotProps.data[col])"></component>
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
    <Popover ref="panel" :showCloseIcon="true" :dismissable="true">
        <div :class="'' + panelConf.classWidth">
            <component v-if="panelConf.componentName" :is="panelConf.componentName"
                       :conf="panelConf.componentConf"></component>
        </div>
    </Popover>
  </div>
</template>

<script>

import _vListHasmany from '@cupparis-lib/views/_vListHasmany.vue'

import cAction from "../actions/cAction.vue";

export default {
  name : "v-list-hasmany",
  extends: _vListHasmany,
  components: {cAction},
}

</script>

<style lang="scss" scoped>

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
