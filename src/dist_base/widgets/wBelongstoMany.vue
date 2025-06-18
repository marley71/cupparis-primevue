<template>
  <span>
    <template v-if="value">
      <div v-for="(item,key) in value" :key="key">
                      <span v-for="(field,index) in labelFields" :key="index">
                          <span v-if="(separator && (index !== 0))">{{ separator }}</span>{{ item[field] }}
                      </span>
      </div>
    </template>
    <div v-else>
      <!-- oggetto belongsto-mangy null -->
    </div>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>
</template>

<script>

import _wBelongstoMany from '../../widgets/_wBelongstoMany.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wBelongstoMany",
  extends: _wBelongstoMany,
  components : {RulesErrors}
}

</script>

