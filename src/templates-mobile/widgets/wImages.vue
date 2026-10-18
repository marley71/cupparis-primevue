<template>
  <Galleria v-if="Array.isArray(value)" :value="value" :numVisible="5" :containerStyle="containerStyle()"
            :showThumbnails="false" :showIndicators="showIndicators()" :changeItemOnIndicatorHover="true">
    <template #item="slotProps">
      <img :src="srcUrl(slotProps.item.resource.url)" :alt="slotProps.item.nome" class="w-full block" />
    </template>
  </Galleria>
<!--  <span>-->
<!--    <Avatar v-if="imageType == 'avatar'" :image="value" v-bind="extraBind" shape="circle" :class="imageClass"></Avatar>-->
<!--    <Image v-else :src="srcUrl(value)" alt="Image" width="100" preview v-bind="extraBind" :class="imageClass"/>-->
<!--    <RulesErrors :errors="errors"></RulesErrors>-->
<!--  </span>-->

</template>

<script>

import _wImages from '@cupparis-lib/widgets/_wImages.vue'
import RulesErrors from "./RulesErrors.vue";

export default {
  name: "wImages",
  extends: _wImages,
  components : {RulesErrors},
  methods: {
    showIndicators() {
      return this.value.length > 1;
    },
    containerStyle() {
      if (this.containerStyleClass) {
        return this.containerStyleClass;
      }
      return 'min-width:150px;max-width: 200px';
    }
  }
}

</script>

