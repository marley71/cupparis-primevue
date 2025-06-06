<template>
    <template v-if="(controlType=='button' || controlType=='link-download') && _visible()">
        <span v-if="controlType=='link-download'"
            class="hidden" :linkhref="href()"></span>
        <Button :title="translate(title)" :label="_text()"
                :class=getActionClass()
                :icon="_icon()"
                :disabled="_disabled()"
                @click="_execute($event)"
        />
    </template>
    <template v-else-if="controlType =='link' && _visible()">
        <a v-if="externalLink" :class="getActionClass()" :href="_href()" :target="conf.target" :title="translate(title)">
            <i v-if="_icon()" :class="_icon()"></i>
            {{_text()}}
        </a>
        <router-link v-else :class="getActionClass()" :to="_href()" :conf="conf" :target="conf.target" :title="translate(title)" >
            <i v-if="_icon()" :class="_icon()"></i>
            {{_text()}}
        </router-link>
    </template>
    <template v-else-if="controlType  && _visible()">
        <component :is="controlType" :conf="conf"></component>
    </template>
    <template v-else-if="_visible()">
        <b>controlType ({{ controlType }}) non riconosciuto</b>
    </template>
</template>

<script>

import _aBase from "../../actions/_aBase.vue";
export default {
    name: "aBase",
    extends: _aBase,
}
</script>

<style scoped>

</style>
