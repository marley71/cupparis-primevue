<template>
  <div>
    <div v-if="layout==='basic'">
      <div>
        <div v-if="mode==='list'">
          <template v-if="!hideSearch">
            <component :is="searchComponentName" :conf="search" ref="vSearch" @search="searchList"></component>
          </template>
          <component :is="listComponentName" :conf="list" ref="vList"></component>
        </div>
        <template v-if="mode==='edit'">
          <component :is="editComponentName" :conf="edit" ref="vRecord"></component>
        </template>
        <template v-else-if="mode==='insert'">
          <component :is="insertComponentName" :conf="insert" ref="vRecord"></component>
        </template>
        <template v-else-if="mode==='custom'">
          <component :is="customComponentName" :conf="custom" ref="vRecord"></component>
        </template>
      </div>
    </div>
    <Panel v-else class="managePanel mt-5" ref="manage">
      <template #header>
        <h5 class="p-panel-title">
                <span v-if="title">
                    {{ title }}
                </span>
          <span v-else>
                    {{ translate('app.gestione') }} {{ translate(modelName + '.label', null, 1) }}
                </span>
        </h5>
      </template>
      <div v-if="sectionTitle" class="p-card-subtitle">
        {{ sectionTitle }}
      </div>
      <div>
        <div v-if="mode==='list'">
          <template v-if="!hideSearch">
            <component :is="searchComponentName" :conf="search" ref="vSearch" @search="searchList"></component>
          </template>
          <component :is="listComponentName" :conf="list" ref="vList"></component>
        </div>
        <template v-if="mode==='edit'">
          <component :is="editComponentName" :conf="edit" ref="vRecord"></component>
        </template>
        <template v-else-if="mode==='insert'">
          <component :is="insertComponentName" :conf="insert" ref="vRecord"></component>
        </template>
        <template v-else-if="mode==='custom'">
          <component :is="customComponentName" :conf="custom" ref="vRecord"></component>
        </template>
      </div>
    </Panel>
    <Dialog class="p-dialog" v-model:visible="viewDisplay" :modal="true" :style="{width: '50vw'}">
      <template #header>
        <h3>{{ translate(viewTitle) }}</h3>
      </template>

      <template v-if="viewDisplay">
        <component :is="viewComponentName" :conf="view" ref="vView"></component>
      </template>
      <div class="modal-footer">
        <Button :label="translate('app.ok')" icon="pi pi-check" autofocus @click="viewDisplay=false"/>
      </div>
    </Dialog>
  </div>

</template>

<script>
import _cManage from "@cupparis-lib/app/_cManage.vue";

export default {
  name: "c-manage",
  extends: _cManage,
}

</script>

<style lang="scss" scoped>

.managePanel {

  :deep(.p-panel-header) {

    background-color: var(--p-background-color);


    .p-panel-title {
      color: var(--p-primary-color);

      &:where([class~="app-dark"], [class~="app-dark"] *) {
        color: var(--p-primary-contrast-color);

      }

    }


    h5.p-panel-title {
      margin-bottom: .5rem;
    }
  }


  :deep(.p-panel-content) {
    border: 1px solid;
    border-color: var(--p-primary-600);
    border-radius: 0 0 10px 10px;
    &:where([class~="app-dark"], [class~="app-dark"] *) {
      border-color: var(--p-primary-400);

    }
  }

  :deep(.p-panel-header) {
    border: 1px solid;
    border-bottom: none;
    border-color: var(--p-primary-600);
    &:where([class~="app-dark"], [class~="app-dark"] *) {
      border-color: var(--p-primary-400);

    }
    border-radius: 10px 10px 0 0;
  }

  border: none;

}

.listDivider.p-divider-horizontal:before {
  border-color: var(--p-primary-700);
}
</style>
