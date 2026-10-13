<template>
  <span>
    <template v-if="inputType == 'password'">
      <IconField>
        <InputIcon class="fa fa-lock text-black/70!" />
        <Password :inputProps="{'name':name}" :name="name" v-model="value" toggleMask
                v-bind="extraBind" fluid
                :toggleMask="true"
                class="w-full"
                @change="change" :class="errors.length?'p-invalid':''"
                :promptLabel="translate('app.scegli-password')" :weakLabel="translate('app.password-semplice')"
                :mediumLabel="translate('app.password-media')"
                :strongLabel="translate('app.password-complessa')"/>
       
      </IconField>
    </template>
    
    <InputText v-else class="w-full" :name="name" :type="inputType" v-model="value" v-bind="extraBind"
             @change="change" :class="errors && errors.length?'p-invalid':''"></InputText>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>

<script>

import _wInput from '@cupparis-lib/widgets/_wInput.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wInput",
  extends: _wInput,
  components : {RulesErrors},
  data() {
    return {
      showPassword: false
    }
  }
}

</script>

