<template>
  <span>
    <template v-if="showInPanel">
      <Button class="p-button-outlined p-1 p-button-sm" type="button" icon="fa-solid fa-circle-chevron-down" :label="label"
                @click="$refs.op.toggle($event)"/>
        <Popover ref="op">
          <h2 v-if="title">{{title}}</h2>
          <table v-if="fields" class="card-body w-full">
            <tr class="" v-for="(key) in fields" :key="key">
              <td>{{getFieldLabel(key)}}</td>
              <td v-if="separator">{{ separator }}</td>
              <td>{{ getFieldValue(key) }}</td>
            </tr>
          </table>
        </Popover>
    </template>
    <div v-else class="card  w-full">
      <h2 v-if="title">{{title}}</h2>
      <table v-if="fields" class="card-body w-full">
        <tr class="" v-for="(key) in fields" :key="key">
          <td>{{getFieldLabel(key)}}</td>
          <td v-if="separator">{{ separator }}</td>
          <td>{{ getFieldValue(key) }}</td>
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

