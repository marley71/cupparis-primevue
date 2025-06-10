<template>
  <DataTable v-if="value || value.length > 0" :value="value">
    <Column v-for="column in getKeys()" :field="column" :key="column" :header="column">
      <template #body="slotProps">
        {{slotProps.data[column]}}
      </template>
    </Column>
  </DataTable>
</template>

<script>

import _wTable from '../../widgets/_wTable.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wTable",
  extends: _wTable
}

</script>

