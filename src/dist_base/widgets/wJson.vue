<template>
  <span>
    <div :class="jsonClass" >
      <div><a title="Espandi" @click="jsonClass=(jsonClass=='maximizable-div'?'maximizable-div-fullscreen':'maximizable-div')"><i class="fa fa-window-maximize"></i></a></div>
      <pre v-html="JSON.stringify(value, null, 2)" ></pre>

    </div>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>

<script>

import _wJson from '../../widgets/_wJson.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wJson",
  extends: _wJson,
  components : {RulesErrors}
}

</script>

