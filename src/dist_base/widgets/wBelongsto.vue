<template>
  <span>
    <div v-if="value && Object.keys(value).length > 0">
      <a v-if="_hasHref()" :href="_href()">
                      <span v-for="(field,index) in labelFields" :key="index">
                          <span v-if="(separator && (index !== 0))">{{ separator }}</span>{{ value[field] }}
                      </span>
      </a>
      <template v-else-if="_hasClick">
        <div  @click="_click">
                          <span v-for="(field,index) in labelFields" :key="index">
                              <span v-if="(separator && (index !== 0))">{{ separator }}</span>{{ value[field] }}
                          </span>
        </div>
      </template>
      <template>
                      <span v-for="(field,index) in labelFields" :key="index">
                          <span v-if="(separator && (index !== 0))">{{ separator }}</span>{{ value[field] }}
                      </span>
      </template>

    </div>
    <div v-else>
      <template v-if="noDataLabel">{{translate(noDataLabel)}}</template>
      <!-- oggetto belongsto null -->
    </div>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>

<script>

import _wBelongsto from '@cupparis-lib/widgets/_wBelongsto.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wBelongsto",
  extends: _wBelongsto,
  components : {RulesErrors}
}

</script>

