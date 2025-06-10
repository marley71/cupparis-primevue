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
    <div v-if="errors && errors.length !== 0" class="overflow-hidden">
        <span class="text-red-400" v-for="(error,index) in errors" :key="index">
           {{ error }} <span v-if="parseInt(index) < (Object.keys(errors).length-1)">,&nbsp;</span>
        </span>
    </div>
  </span>
</template>

<script>

import _wBelongstoMany from '../../widgets/_wBelongstoMany.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wBelongstoMany",
  extends: _wBelongstoMany
}

</script>

