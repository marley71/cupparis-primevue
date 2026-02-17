<template>
        <template v-if="(type==='button' || type==='link-download') && _visible()">
            <span v-if="type==='link-download'"
                  class="hidden" :linkhref="_href()"></span>
            <Button :title="translate(title)" :label="_text()"
                    :class=getActionClass()
                    :icon="_icon()"
                    :disabled="_disabled()"
                    @click="execute($event)"
            />
        </template>
        <template v-else-if="type =='link' && _visible()">
            <Button :title="translate(title)"
                    :class=getActionClass()
                    :disabled="_disabled()"
            >
                <a v-if="externalLink" :href="_href()" :target="target" :title="translate(title)" :disabled="_disabled()">
                    <i v-if="_icon()" :class="_icon()"></i>
                    {{_text()}}
                </a>
                
                <router-link v-else :to="_href()" :conf="conf" :target="target" :title="translate(title)" :disabled="_disabled()" >
                    <i v-if="_icon()" :class="_icon()"></i>
                    {{_text()}}
                </router-link>
            </Button>
        </template>
        <template v-else-if="type === 'select' && _visible()">
            <Select v-model="value" :options="options" :disabled="_disabled()" optionLabel="label" optionValue="value" 
            @change="execute($event)" @show="onShow"></Select>
            
        </template>
        <template v-else-if="type  && _visible()">
            <component :is="type" :conf="conf"></component>
        </template>
        <template v-else-if="_visible()">
            <b>controlType ({{ type }}) non riconosciuto</b>
        </template>

</template>

<script>

import _aBase from "@cupparis-lib/actions/_aBase.vue";
export default {
    name: "aBase",
    extends: _aBase,
    methods: {
        onShow() {
            console.log('aBaseonShow', this.inPopup);
            if (this.inPopup) {
                document.querySelector('.p-select-overlay').style['z-index'] = this.zIndexPopup;
            }
        }
    }
}
</script>

<style scoped>

</style>
