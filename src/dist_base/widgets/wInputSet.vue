<template>
    <div class="flex">
        <span>{{value}}</span>
        <Button icon="fa fa-edit" class="p-button-sm ml-1 p-1" outlined :disabled="!canUpdate"
                @click="toggle"></Button>
        <OverlayPanel ref="panel" @hide="cancel()">
            <h6>{{translate(overlayTitle)}}</h6>
            <div class="my-1 grid w-24rem">
                <span class="mt-1">{{ translate(label) }}:</span>
                <InputText v-model="value"/>
                <Button :label="translate('app.salva')" @click="set()"></Button>
            </div>
        </OverlayPanel>
      <RulesErrors :errors="errors"></RulesErrors>
    </div>
</template>

<script>

import _wInputSet from '../../widgets/_wInputSet.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
    name: "wInputSet",
    extends: _wInputSet,
  components : {RulesErrors}
}
</script>

<style scoped>

</style>
