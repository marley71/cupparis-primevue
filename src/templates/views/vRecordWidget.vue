<template>
  <template v-if="labelInfo.position==='float'">
    <span class="p-float-label">
         <component :is="widgetConfig.type" :ref="field"
                    :conf="widgetConfig"></component>
         <label :for="field">{{ labelInfo.label || '&nbsp;' }}{{ labelInfo.required }}</label>
     </span>
  </template>
  <template v-else>

    <label class="labelRecord labelTop" :for="field"
           v-if="labelInfo.position=='top'">
      {{ labelInfo.label }} &nbsp;{{ labelInfo.required }}
    </label>
    <div class="">
      <component :is="widgetConfig.type" :ref="field" :conf="widgetConfig"></component>
    </div>
    <label class="labelRecord labelBottom" :for="field"
           v-if="labelInfo.position=='bottom'">
      {{ labelInfo.label || '&nbsp;' }}{{ labelInfo.required }}
    </label>
  </template>
</template>

<script>

export default {
  name: "v-record-widget",

  props: {
    field: String,
    labelInfo: Object,
    widgetConfig: Object,
  },

}

</script>
