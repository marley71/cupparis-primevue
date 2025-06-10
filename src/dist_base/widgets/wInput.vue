<template>
  <Password v-if="inputType == 'password'" :inputProps="{'name':name}" :name="name" v-model="value" toggleMask
            v-bind="extraBind"
            @change="_change" :class="errors.length?'p-invalid':''"
            :promptLabel="translate('app.scegli-password')" :weakLabel="translate('app.password-semplice')"
            :mediumLabel="translate('app.password-media')"
            :strongLabel="translate('app.password-complessa')"/>
  <InputText v-else class="w-full" :name="name" :type="inputType" v-model="value" v-bind="extraBind"
             @change="_change" :class="errors && errors.length?'p-invalid':''"></InputText>
</template>

<script>

import _wInput from '../../widgets/_wInput.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wInput",
  extends: _wInput
}

</script>

