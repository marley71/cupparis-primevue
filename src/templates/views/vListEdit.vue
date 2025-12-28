<template>
    <div v-if="loaded">
        <template v-for="(v,row) in value">
            <template v-for="col in getHiddenFields()" :key="col">
                <component :is="getWidgetType(row,col)" :ref="'w'+row+'_'+col" :conf="getWidgetConf(row,col,v[col])"></component>
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
                                <c-action :layout="actionsLayout"  :conf="collectionActions"></c-action>
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
              <Column v-show="false">
                <template #body="slotProps">
                  <template v-for="(col) in fields">
                    <!-- ci metto i campi nascosti per garantire l'invio di tutti i campi nel save della riga -->
                    <template v-if="isHiddenField(col)">
                      <div class="hidden">
                        <component :is="getWidgetType(slotProps.index,col)" v-if="!editMode[slotProps.index % getPerPage()]" :ref="'w'+slotProps.index % getPerPage()+'_'+col"
                                   :conf="getWidgetConf(slotProps.index % getPerPage(),col,slotProps.data[col])"></component>
                        <component :is="getWidgetEditType(slotProps.index,col)" v-if="editMode[slotProps.index % getPerPage()]" :ref="'we'+slotProps.index % getPerPage() +'_'+col"
                                   :conf="getWidgetEditConf(slotProps.index % getPerPage(),col,slotProps.data[col])"></component>
                      </div>
                    </template>
                  </template>
                </template>
              </Column>
                <!-- <Column v-if="getRecordActionsPosition() == 'start' && hasRecordActions()" :exportable="false" :header="translate('app.actions')">
                    <template #body="slotProps">
                        <c-action :ref="'r'+slotProps.index" :conf="recordActionsConf[slotProps.index % getPerPage()]"
                                    :layout="actionsLayout" :menubar-title="actionsLayoutTitle"></c-action>
                    </template>
                </Column> -->
                <Column :exportable="false" :header="translate('app.actions')">
                    <template #body="slotProps">
                        <c-action :ref="'r'+slotProps.index % getPerPage()" :conf="recordActionsConf[slotProps.index % getPerPage()]" :layout="actionsRecordLayout"></c-action>
                    </template>
                </Column>
                <Column v-for="(col) in getVisibleFields()" :field="col" :header="columnLabel(col)" :key="col" :sortable="isSortable(col)" :dir="sortDirection(col)">
                    <template #body="slotProps">

                        <component :is="getWidgetType(slotProps.index,col)" v-if="!editMode[slotProps.index % getPerPage()]" :ref="'w'+slotProps.index % getPerPage()+'_'+col"
                                :conf="getWidgetConf(slotProps.index % getPerPage(),col,slotProps.data[col])"></component>
                        <component :is="getWidgetEditType(slotProps.index,col)" v-if="editMode[slotProps.index % getPerPage()]" :ref="'we'+slotProps.index % getPerPage() +'_'+col"
                                :conf="getWidgetEditConf(slotProps.index % getPerPage(),col,slotProps.data[col])"></component>
                    </template>
                </Column>
            </DataTable>
        </slot>
        <slot name="footer">

        </slot>
    </div>
</template>

<script>
import _vListEdit from '@cupparis-lib/views/_vListEdit.vue'
//import cWidget from "../widgets/cWidget.vue";
import cAction from "../actions/cAction.vue";
export default {
  name : "v-list-edit",
  extends: _vListEdit,
  components: {cAction},
}

</script>

<style scoped>

</style>
