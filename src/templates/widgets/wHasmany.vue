<template>
  <span>
    <template v-if="hasmanyType==='list'">
        <div>
            <component is="v-list-hasmany" ref="listViewHasmany" :conf="getHasmanyList()"></component>
        </div>
    </template>
    <template v-else-if="hasmanyType==='record'">
        <Card ref="el" class="mb-3">
            <template #header>

            </template>
            <template #title v-if="hasDisplayTitle()">
                {{ translate(label) }}
            </template>
            <template #content>
                <div class="flex flex-col">
                    <div v-for="(dataKey,index) in vForKeys" :key="dataKey">
                        <Divider align="right">
                            <Button class="p-button-outlined p-button-danger" icon="fa fa-times" @click="removeItem(dataKey)"></Button>
                        </Divider>
                        <component is="v-record" ref="recordView" :conf="getHasmanyConf(index)"></component>
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
                <button v-else @click="addItem" type="button"
                        class="p-button p-button-sm p-component p-button-outlined justify-content-center">
                    <span>{{ translate('app.aggiungi') }}</span>&nbsp;
                </button>
            </template>
        </Card>
    </template>
    <template v-else-if="hasmanyType==='view-only'">
        <template v-for="(data,index) in value" :key="index">
            <div v-for="field in getHasmanyConf(index).fields" :key="field">
                <component :is="getWidgetType(index,field)" :conf="getHasmanyWidgetConf(index,field)"></component>
            </div>
        </template>
    </template>
    <template v-else-if="hasmanyType==='panel'">
        <Button class="p-button-outlined p-1" type="button" icon="fa-solid fa-circle-chevron-down" :label="label" @click="toggle" />
        <Popover ref="op" >
            <table class="w-full table p-1">
                <thead>
                    <tr>
                        <td v-for="field in _getPanelFields()" :key="field">
                            <b>{{_getFieldLabel(field)}}</b>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data,index) in value" :key="index">
                        <td v-for="field in _getPanelFields()" :key="field" v-html="_getColumnValue(index,field)">
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

export default {
  name: "wHasmany",
  extends: _wHasmany,
  components : {RulesErrors}
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
