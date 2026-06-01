<template>
  <div class="">
    <div v-if="loaded">
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
        <slot name="content" :value="value" :errors="errors" :metadata="metadata" :widgetsConfig="widgetsConfig">
          <div class="p-6  flex-1 overflow-auto">

            <div class="card">

              <DataTable :value="value" v-model:selection="selected"
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
                         stripedRows
                         :rowClass="rowClass"
              >
              <Column v-if="selectionMode" :selection-mode="selectionMode" headerStyle="width: 3rem">
                <template #body="slotProps">
                  <Checkbox v-if="!hasRowErrors(slotProps.index)"                  
                  :modelValue="isRowSelected(slotProps.data)"
                    binary
                    @update:modelValue="(checked) => toggleRowSelection(slotProps.data, checked)"
                  />
                </template>
              </Column>
                <Column v-if="getRecordActionsPosition() == 'start' && hasRecordActions()" :exportable="false"
                        :header="translate('app.actions')">
                  <template #body="slotProps">
                    <c-action :ref="'r'+slotProps.index" :conf="recordActionsConf[slotProps.index % getPerPage()]"
                              :layout="actionsRecordLayout" :menubar-title="actionsRecordLayoutTitle"></c-action>
                  </template>
                </Column>
                <Column v-for="(col) in getVisibleFields()" :field="col" :header="columnLabel(col)" :key="col"
                        :sortable="isSortable(col)" :dir="sortDirection(col)" :class="'field-'+col">
                  <template #body="slotProps">
                    <div>
                      <component :is="getWidgetType(slotProps.index,col)" :ref="'w'+slotProps.index+'_'+col"
                                 :conf="getWidgetConf(slotProps.index,col,slotProps.data[col])"></component>
                      <div v-if="hasColumnErrors(slotProps.index,col)">
                        <div class="text-xs text-red-600" v-for="error in getColumnErrors(slotProps.index,col)">
                          <span v-html="error"></span>
                        </div>
                      </div>
                    </div>
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
            </div>

          </div>
        </slot>
        <slot name="footer">

        </slot>
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
import _vDatafileList from '@cupparis-lib/views/_vDatafileList.vue'
import cAction from "../actions/cAction.vue";
import DataTable from "primevue/datatable";
import Card from 'primevue/card';

export default {
  name: "v-datafile-list",
  extends: _vDatafileList,
  components: {cAction},
  methods: {
    rowClass(rowData, rowIndex) {
      if (rowData.has_errors) {
        return '!bg-red-100';
      }
      return rowIndex % 2 === 0 ? 'p-highlight' : ''; // Aggiunge la classe p-highlight a righe alternate
    },
    hasColumnErrors(index,field) {
      var errorRow = this.errors[index];
      if (!typeof errorRow === 'object' || !Array.isArray(errorRow[field])) {
        return false;
      }
      return errorRow[field].length > 0;
    },
    hasRowErrors(index) {
      var errorRow = this.errors[index];
      if (!typeof errorRow === 'object') {
        return false;
      }
      for (let field in errorRow) {
        if (!Array.isArray(errorRow[field])) {
          continue;
        }
        if (errorRow[field].length > 0) {
          return true;
        }
      }
      return false;
    },
    isRowSelected(rowData) {
      if (this.selectionMode === 'multiple') {
        return (this.selected || []).some(r => r.id === rowData.id);
      }
      return this.selected?.id === rowData.id;
    },
    toggleRowSelection(rowData, checked) {
    if (this.selectionMode === 'multiple') {
      const selected = [...(this.selected || [])];
      const idx = selected.findIndex(r => r.id === rowData.id);
      if (checked && idx === -1) selected.push(rowData);
      if (!checked && idx !== -1) selected.splice(idx, 1);
      this.selected = selected;
    } else {
      this.selected = checked ? rowData : null;
    }
  },
    getColumnErrors(index,field) {
      var errorRow = this.errors[index];
      if (!typeof errorRow === 'object' || !Array.isArray(errorRow[field])) {
        return [];
      }
      return errorRow[field];
    },
    // rowStyle(rowData, rowIndex) {
    //   if (data.quantity === 0) {
    //     return { fontWeight: 'bold', fontStyle: 'italic' };
    //   }
    // }
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
