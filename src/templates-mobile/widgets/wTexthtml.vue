<template>
  <span>
    <input type="hidden" :name="name" v-model="value"/>
    <Editor v-model="value" editorStyle="height: 320px" @text-change="change">
        <template v-if="toolbar" #toolbar>
        </template>
    </Editor>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>
</template>

<script>

import _wTexthtml from '@cupparis-lib/widgets/_wTexthtml.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wTexthtml",
  extends: _wTexthtml,
  components : {RulesErrors}
}

</script>

