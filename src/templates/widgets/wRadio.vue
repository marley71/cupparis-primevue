<template>
  <span>
    <div class="w-full flex flex-wrap border rounded-md surface-border p-2 [&>div:last-child]:mr-0"
         :class="direction==='row'?'flex-row':'flex-col'">
      <div class="field-radiobutton flex items-center mb-1"
           :class="rowType==='grid'?'w-12 md:w-6 xl:w-3':'mr-1 xl:mr-3'"
           v-for="(label,key) in domainValues" :key="key">
          <RadioButton
            :name="name"
            v-model="value"
            :value="normalizeKey(key)"
            v-bind="extraBind"
            @change="change"
          />
        <label :for="key" v-html="label" class="ml-1" :class="isSelected(key)?'font-bold':''"></label>
      </div>
    </div>
    <RulesErrors :errors="errors"></RulesErrors>
  </span>

</template>

<script>

import _wRadio from '@cupparis-lib/widgets/_wRadio.vue'
import RulesErrors from "./RulesErrors.vue";
export default {
  name: "wRadio",
  extends: _wRadio,
  components : {RulesErrors},
  methods: {
    /*
    - aggiunto `syncValueType()` che converte valori tipo `"0"`/`"1"` in numeri quando il dominio è numerico
    - migliorato `normalizeKey()` per allineare i tipi al confronto strict di PrimeVue `RadioButton`.
     */
    syncValueType() {
      if (this.value === null || this.value === undefined || !this.domainValues) {
        return;
      }
      const keys = Object.keys(this.domainValues);
      if (!keys.length || !keys.every((k) => /^-?\d+$/.test(String(k)))) {
        return;
      }
      const normalized = Number(this.value);
      if (!Number.isNaN(normalized)) {
        this.value = normalized;
      }
    },
    ready() {
      this.syncValueType();
      if (this.conf.ready) {
        this.conf.ready.apply(this);
      }
    },
    normalizeKey(rawKey) {
      const keys = Object.keys(this.domainValues || {});
      const numericDomain = keys.length > 0 && keys.every((k) => /^-?\d+$/.test(String(k)));
      if (numericDomain) {
        const n = Number(rawKey);
        return Number.isNaN(n) ? rawKey : n;
      }
      if (this.value === null || this.value === undefined) {
        return rawKey;
      }
      if (typeof this.value === 'number') {
        const n = Number(rawKey);
        return Number.isNaN(n) ? rawKey : n;
      }
      if (typeof this.value === 'boolean') {
        if (rawKey === true || rawKey === 'true') return true;
        if (rawKey === false || rawKey === 'false') return false;
      }
      return rawKey;
    },
    isSelected(rawKey) {
      return this.normalizeKey(rawKey) === this.value;
    },
  }
}

</script>

