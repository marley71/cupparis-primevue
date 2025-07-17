<template>
  <span>
    <div class="card  w-full">
      <h2 v-if="title">{{title}}</h2>
      <table class="card-body w-full">
        <tr class="" v-for="(item,key) in value" :key="key">
          <td>{{key}}</td>
          <td>{{ item }}</td>
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

