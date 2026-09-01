
<script>

import _wBase from "./_wBase.vue"

export default {
    name: '_wRadio',
    extends : _wBase,
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
