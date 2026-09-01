<template>
  <div class="">
    <div v-if="loaded">
      <template v-if="layout=='default'">
        <template v-for="(v,row) in value">
          <template v-for="(col) in getHiddenFields()" :key="col">
            <component :is="getWidgetType(row,col)" :ref="'w'+row+'_'+col"
                       :conf="getWidgetConf(row,col,v[col])"></component>
          </template>
        </template>
        <slot name="header" :collectionActions="collectionActions">
          <div class="v-list-header">
            <div class="surface-section px-4 py-5 md:px-6 lg:px-8">
              <div
                  class="flex align-items-start flex-col gap-3  lg:justify-content-start lg:align-items-center lg:flex-row" :class="headerClass">
                <div class="mr-5 pr-3 border-right-none lg:border-right-1">
                  <div class="font-medium text-3xl text-900" v-html="getTitleMsg()">
                  </div>
                  <div class="flex align-items-center text-700 flex-wrap">
                    <div class="mr-5 flex align-items-center mt-3">
                      <!--                                    <i class="pi pi-users mr-2"></i>-->
                      <span>{{
                          translate('app.numero-records-lista', null, 0, [(value ? value.length : 0), getFirst() + 1, getFirst() + (value ? value.length : 0), getTotal(), translateUc(modelName + '.label', null, 1)])
                        }}</span>
                    </div>
                  </div>
                </div>
                <template v-if="Object.keys(collectionActions).length > 0">
                  <div class="mt-5 lg:mt-0">
                    <c-action :layout="actionsLayout" :conf="collectionActions"></c-action>
                  </div>

                </template>
              </div>
              <template v-if="getHeaderParagraph()">
                <div class="my-3" v-html="getHeaderParagraph()">

                </div>
              </template>
            </div>
          </div>


        </slot>
        <slot name="content" :value="value" :metadata="metadata" :widgetsConfig="widgetsConfig" :instance="instance">
          <div class="w-full flex justify-center @container">

          <div class="py-6 px-4 flex-1 overflow-auto">

              <DataTable :value="value" v-model:selection="selected"
                         ref="dataTable"
                         :rows="getPerPage()"
                         :paginator="paginator" :paginatorPosition="paginatorPosition"
                         :lazy="routeName==null?false:true"
                         @page="onPage($event)" @sort="onSort($event)"
                         :total-records="getTotal()"
                         :first="getFirst()"
                         :sortField="getSortField()"
                         :sortOrder="getSortOrder()"
                         :loading="!loaded"
                         scrollable
                         :key="tableKey"
                         :rowClass="rowClass"
                         :class="datatableClass"
                         :stripedRows="true"
              >
                <Column v-if="selectionMode" :selection-mode="selectionMode"></Column>
                <Column v-if="getRecordActionsPosition() == 'start' && hasRecordActions()" :exportable="false"
                        :header="translate('app.actions')">
                  <template #body="slotProps">
                    <c-action :ref="'r'+slotProps.index" :conf="recordActionsConf[slotProps.index % getPerPage()]"></c-action>
                  </template>
                </Column>
                <Column v-for="(col) in getVisibleFields()" :field="col" :header="columnLabel(col)" :key="col"
                        :sortable="isSortable(col)" :dir="sortDirection(col)" :class="'field-'+col">
                  <template #body="slotProps">
                    <component :is="getWidgetType(slotProps.index,col)" :ref="'w'+slotProps.index+'_'+col"
                               :conf="getWidgetConf(slotProps.index,col,slotProps.data[col])"></component>
                  </template>
                </Column>
                <Column v-if="getRecordActionsPosition() == 'end' && hasRecordActions()" :exportable="false"
                        :header="translate('app.actions')">
                  <template #body="slotProps">
                    <c-action :ref="'r'+slotProps.index" :conf="recordActionsConf[slotProps.index % getPerPage()]" :rowIndex="slotProps.index"></c-action>
                  </template>
                </Column>

                <template #empty>
                  {{ translate('app.no_records_found') }}
                </template>
              </DataTable>
            </div>
          </div>

        </slot>
        <slot name="footer">

        </slot>
      </template>
      <template v-if="layout=='simple'">
        <template v-for="(v,row) in value">
          <template v-for="(col) in getHiddenFields()" :key="col">
            <component :is="getWidgetType(row,col)" :ref="'w'+row+'_'+col"
                       :conf="getWidgetConf(row,col,v[col])"></component>
          </template>
        </template>
        <slot name="header" :collectionActions="collectionActions">
          <div>{{ translate('app.records') }} : {{ getTotal() }}</div>
        </slot>
        <slot name="content" :value="value" :metadata="metadata" :widgetsConfig="widgetsConfig">
          <Card>
            <template #content>
              <DataTable :value="value" responsiveLayout="scroll" v-model:selection="selected"
                         ref="dataTable"
                         :rows="getPerPage()"
                         :paginator="paginator" :paginatorPosition="paginatorPosition"
                         :lazy="routeName===null?false:true"
                         @page="onPage($event)" @sort="onSort($event)"
                         :total-records="getTotal()"
                         :first="getFirst()"
                         :sortField="getSortField()"
                         :sortOrder="getSortOrder()"
                         :loading="!loaded"
                         :key="tableKey"
                         :rowClass="rowClass"
                          :stripedRows="true"

              >
                <Column v-if="selectionMode" :selection-mode="selectionMode"></Column>
                <Column v-if="getRecordActionsPosition() == 'start' && hasRecordActions()" :exportable="false"
                        :header="translate('app.actions') + actionsRecordLayout">
                  <template #body="slotProps">
                    <c-action :ref="'r'+slotProps.index" :conf="recordActionsConf[slotProps.index % getPerPage()]"
                              :layout="actionsRecordLayout" :menubar-title="actionsRecordLayoutTitle"></c-action>
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
                <Column v-if="getRecordActionsPosition() == 'end' && hasRecordActions()" :exportable="false"
                        :header="translate('app.actions')">
                  <template #body="slotProps">
                    <c-action :ref="'r'+slotProps.index" :conf="recordActionsConf[slotProps.index % getPerPage()]"
                              :layout="actionsRecordLayout" :menubar-title="actionsRecordLayoutTitle"></c-action>
                  </template>
                </Column>

                <template #empty>
                  {{ translate('app.no_records_found') }}
                </template>
              </DataTable>
            </template>

          </Card>

        </slot>
        <slot name="footer">

        </slot>
      </template>
    </div>
    <Popover ref="panel" :showCloseIcon="true" :dismissable="true" @hide="panelConf.hide()"
             :class="panelConf.panelClass">
      <div class="w-full">
        <component v-if="panelConf.componentName" :is="panelConf.componentName"
                   :conf="panelConf.componentConf"></component>
      </div>
    </Popover>
  </div>
</template>

<script>
import _vList from '@cupparis-lib/views/_vList.vue'
import cAction from "../actions/cAction.vue";
import DataTable from "primevue/datatable";
import Card from 'primevue/card';
import { nextTick } from 'vue';

export default {
  name: "v-list",
  extends: _vList,
  components: {cAction},
  async mounted() {

    await nextTick()

  // elemento radice del DataTable
  console.log('datatable', this.$refs)
    if (this.$refs.dataTable) {
      const el = this.$refs.dataTable.value?.$el
      const height = el?el.offsetHeight:200;

      console.log('Altezza DataTable:', height)
    }
  },
  methods: {
    rowClass(rowData, rowIndex) {
      return rowIndex % 2 === 0 ? 'p-highlight' : ''; // Aggiunge la classe p-highlight a righe alternate
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

  .p-highlight {
    background-color: var(--primary-color) !important; /* Colore di sfondo chiaro */
  }

  .p-even-row {
  background-color: #f3f4f6 !important; /* Colore di sfondo per righe pari */
}

.p-odd-row {
  background-color: #ffffff !important; /* Colore di sfondo per righe dispari */
}

}


</style>
