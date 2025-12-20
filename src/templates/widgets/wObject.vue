<template>
  <span>
    <div class="card  w-full">
      <h2 v-if="title">{{title}}</h2>
      <table v-if="fields" class="card-body w-full">
        <tr class="" v-for="(key) in fields" :key="key">
          <td>{{key}}</td>
          <td v-if="separator">{{ separator }}</td>
          <td>{{ value[key] }}</td>
        </tr>
      </table>
    </div>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>

<script>

import _wObject from '@cupparis-lib/widgets/_wObject.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wObject",
  extends: _wObject,
  components : {RulesErrors}
}

</script>

