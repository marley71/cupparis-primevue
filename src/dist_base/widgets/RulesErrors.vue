<script >

export default {
  name: "RulesErrors",
  props : ['errors']
}
</script>

<template>
  <span>
    <div v-if="errors && errors.length !== 0" class="overflow-hidden">
        <span class="text-red-400" v-for="(error,index) in errors" :key="index">
           {{ error }} <span v-if="parseInt(index) < (Object.keys(errors).length-1)">,&nbsp;</span>
        </span>
  </div>
  </span>

</template>

<style scoped>

</style>
