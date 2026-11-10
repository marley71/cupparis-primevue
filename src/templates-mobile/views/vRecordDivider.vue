<template>
  <Divider align="center" :class="dividerInfo.class">
    <span v-if="dividerInfo.content" v-html="dividerInfo.content"
          :class="dividerInfo.contentClass">
    </span>
  </Divider>
  <div :class="dividerInfo.class + ' dividerDescription'" v-if="dividerInfo.description"
        v-html="dividerInfo.description">

  </div>
</template>

<script>

export default {
  name: "v-record-divider",

  props: {
    dividerInfo: Object,
  },

}

</script>
