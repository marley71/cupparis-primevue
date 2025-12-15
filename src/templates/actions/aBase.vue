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
            <a v-if="externalLink" :class="getActionClass()" :href="_href()" :target="target" :title="translate(title)" :disabled="_disabled()">
                <i v-if="_icon()" :class="_icon()"></i>
                {{_text()}}
            </a>
            <router-link v-else :class="getActionClass()" :to="_href()" :conf="conf" :target="target" :title="translate(title)" :disabled="_disabled()" >
                <i v-if="_icon()" :class="_icon()"></i>
                {{_text()}}
            </router-link>
        </template>
        <template v-else-if="type  && _visible()">
            <component :is="type" :conf="conf" :disabled="_disabled()"></component>
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
}
</script>

<style scoped>

</style>
