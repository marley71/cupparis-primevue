<template>
  <div>
    <c-action ref="button-actions" :conf="recordActionConf()" :whitelist="getActionsWhitelist()"
              :layout="layout || 'buttons'"></c-action>
    <RulesErrors :errors="errors"></RulesErrors>
  </div>
</template>

<script>

import _wActions from '@cupparis-lib/widgets/_wActions.vue'
import RulesErrors from "./RulesErrors.vue";

export default {
  name: "wActions",
  extends: _wActions,
  components : {RulesErrors}
}

</script>

