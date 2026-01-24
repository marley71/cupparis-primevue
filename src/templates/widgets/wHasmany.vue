<template>
  <span>
    <template v-if="hasmanyType==='list'">
              <template v-if="wrapperType() === 'fieldset'">
                  <Fieldset ref="el" class="mb-3 border border-surface-300">
                                  <template #legend>
                                      {{ titleMsg() }}
                                  </template>
                          <div class="py-2 pt-5">
                              <component is="v-list-hasmany" ref="listViewHasmany" :conf="getHasmanyList()"></component>
                          </div>
                  </Fieldset>
              </template>
              <template v-else>
                          <div>
                              <component is="v-list-hasmany" ref="listViewHasmany" :conf="getHasmanyList()"></component>
                          </div>
              </template>
    </template>
    <template v-else-if="hasmanyType==='record'">
        <template v-if="wrapperType() === 'card'">

            <Card ref="el" class="mb-3 border border-surface-300">
                <template #header>

                </template>
                <template #title v-if="hasDisplayTitle()">
                    {{ titleMsg() }}
                </template>
                <template #content>

                            <div class="flex flex-col gap-4 mb-4 gap-y-6">
                                <div v-for="(dataKey, index) in vForKeys" :key="dataKey"
                                     class="flex items-center overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
    <!--                              <div class="sm:block hidden w-2.5 min-h-20" :class="'bg-green-500'">&nbsp;</div>-->
                                    <div
                                        class="flex items-center justify-start p-2 gap-4 hasmany-border rounded-xl w-full">
                                        <Button class="mx-3 p-button-outlined p-button-danger" icon="fa fa-times"
                                                @click="removeItem(dataKey)"></Button>
                                        <div class="grow px-2">
                                          <component is="v-view" ref="recordView" :conf="getHasmanyConf(index)"
                                                     :class="''"></component>

                                        </div>
                                    </div>
                                </div>
                            </div>
                </template>
                <template #footer>
                    <template v-if="outOfLimit()">

                      <span class="d-block text-primary text-truncate font-weight-medium" v-if="outOfLimitMessage()">
                            <!-- Limite massimo raggiunto -->
                            {{ outOfLimitMessage() }}
                        </span>
                    </template>
                    <Button v-else class="p-button p-button-sm p-component p-button-outlined justify-content-center"
                            icon="fa fa-add"
                            type="button" :label="translate('app.aggiungi')"
                            @click="addItem(dataKey)">
                    </Button>
                </template>
            </Card>
        </template>
        <template v-if="wrapperType() === 'fieldset'">

            <Fieldset ref="el" class="mb-3 border border-surface-300">
                <template #legend>
                    {{ titleMsg() }}
                </template>

              <div class="my-2 mt-5">

                            <div class="flex flex-col gap-4 mb-4 gap-y-6">
                                <div v-for="(dataKey, index) in vForKeys" :key="dataKey"
                                     class="flex items-center overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
    <!--                              <div class="sm:block hidden w-2.5 min-h-20" :class="'bg-green-500'">&nbsp;</div>-->
                                    <div
                                        class="flex items-center justify-start p-2 gap-4 hasmany-border rounded-xl w-full">
                                        <Button class="mx-3 p-button-outlined p-button-danger" icon="fa fa-times"
                                                @click="removeItem(dataKey)"></Button>
                                        <div class="grow px-2">
                                          <component is="v-view" ref="recordView" :conf="getHasmanyConf(index)"
                                                     :class="''"></component>

                                        </div>
                                    </div>
                                </div>
                            </div>

                    <template v-if="outOfLimit()">

                      <span class="d-block text-primary text-truncate font-weight-medium" v-if="outOfLimitMessage()">
                            <!-- Limite massimo raggiunto -->
                            {{ outOfLimitMessage() }}
                        </span>
                    </template>
                    <Button v-else class="p-button p-button-sm p-component p-button-outlined justify-content-center"
                            icon="fa fa-add"
                            type="button" :label="translate('app.aggiungi')"
                            @click="addItem(dataKey)">
                    </Button>
              </div>

            </Fieldset>
        </template>
      <template v-else>
                            <Divider align="center" v-if="hasInitialDivider()">
                                    <span v-html="titleMsg()">
                                    </span>
                                </Divider>
                            <div class="flex flex-col gap-4 mb-4 gap-y-6">
                                <div v-for="(dataKey, index) in vForKeys" :key="dataKey"
                                     class="flex items-center overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
    <!--                              <div class="sm:block hidden w-2.5 min-h-20" :class="'bg-green-500'">&nbsp;</div>-->
                                    <div
                                        class="flex items-center justify-start p-2 gap-1 lg:gap-4 hasmany-border rounded-xl w-full">
                                        <Button class="mx-1 lg:mx-3 p-button-outlined p-button-danger min-w-[24px]" icon="fa fa-times"
                                                @click="removeItem(dataKey)"></Button>
                                        <div class="grow px-2">
                                          <component is="v-view" ref="recordView" :conf="getHasmanyConf(index)"
                                                     :class="''"></component>

                                        </div>
                                    </div>
                                </div>
                            </div>

                    <template v-if="outOfLimit()">

                      <span class="d-block text-primary text-truncate font-weight-medium" v-if="outOfLimitMessage()">
                            <!-- Limite massimo raggiunto -->
                            {{ outOfLimitMessage() }}
                        </span>
                    </template>
                    <Button v-else class="p-button p-button-sm p-component p-button-outlined justify-content-center"
                            icon="fa fa-add"
                            type="button" :label="addButtonMsg()"
                            @click="addItem()">
                    </Button>
                    <Divider align="center" v-if="hasFinalDivider()">
                      </Divider>

        </template>

    </template>
    <template v-else-if="hasmanyType==='view-only'">
        <template v-for="(data,index) in value" :key="index">
            <div v-for="field in getHasmanyConf(index).fields" :key="field">
                <component :is="getWidgetType(index,field)" :conf="getHasmanyWidgetConf(index,field)"></component>
            </div>
        </template>
    </template>
    <template v-else-if="hasmanyType==='panel'">
        <Button class="p-button-outlined p-1 p-button-sm" type="button" icon="fa-solid fa-circle-chevron-down" :label="label"
                @click="toggle"/>
        <Popover ref="op">
            <table class="w-full table p-1">
                <thead>
                    <tr>
                        <td class="px-1" v-for="field in _getPanelFields()" :key="field">
                            <b>{{ _getFieldLabel(field) }}</b>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data,index) in value" :key="index">
                        <td class="px-1" v-for="field in _getPanelFields()" :key="field" v-html="_getColumnValue(index,field)">
                        </td>
                    </tr>
                </tbody>
            </table>
        </Popover>
    </template>
    <div v-else>
        <span>hasmanyType {{ hasmanyType }} non valido!</span>
    </div>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>


<script>
import _wHasmany from '@cupparis-lib/widgets/_wHasmany.vue'
import RulesErrors from "./RulesErrors.vue";
import cs from 'cupparis-primevue';

export default {
  name: "wHasmany",
  extends: _wHasmany,
  components: {RulesErrors},

  methods: {

    addButtonMsg() {
      return this.addButton || this.translateUc("app.add") + " " +  this.translate("model."+this.name,null,0);
    },
    titleMsg() {
      return this.title || cs.CrudCore.upperCaseFirst(this.translateUc("model."+this.name,null,0));
    },

    wrapperType() {
      return this.wrapper || '';
    },

    hasFinalDivider() {
      return this.finalDivider || false;
    },

    hasInitialDivider() {
      return this.initialDivider || false;
    }

  }
}

</script>

<style lang="scss" scoped>
.p-datatable-thead > tr > th {
  font-weight: bold;
  text-align: center;
  background-color: white;
  border-top: 1px solid var(--primary-400)
}

.p-datatable-header {
  border-top: 1px solid var(--primary-400);
  text-align: center;
  background-color: white;

}
</style>
