<template>
    <template v-if="(type==='button' || type==='link-download') && visible()">
        <span v-if="type==='link-download'"
            class="hidden" :linkhref="href()"></span>
        <Button :title="translate(title)" :label="text()"
                :class=getActionClass()
                :icon="icon()"
                :disabled="disabled()"
                @click="execute($event)"
        />
    </template>
    <template v-else-if="type =='link' && visible()">
        <a v-if="externalLink" :class="getActionClass()" :href="href()" :target="target" :title="translate(title)" :disabled="disabled()">
            <i v-if="icon()" :class="icon()"></i>
            {{text()}}
        </a>
        <router-link v-else :class="getActionClass()" :to="href()" :conf="conf" :target="target" :title="translate(title)" :disabled="disabled()" >
            <i v-if="icon()" :class="icon()"></i>
            {{text()}}
        </router-link>
    </template>
    <template v-else-if="type  && visible()">
        <component :is="type" :conf="conf" :disabled="disabled()"></component>
    </template>
    <template v-else-if="visible()">
        <b>controlType ({{ type }}) non riconosciuto</b>
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
