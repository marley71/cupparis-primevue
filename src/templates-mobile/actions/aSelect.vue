<template>
        <template v-if="(type==='button' || type==='link-download') && _visible()">
            <span v-if="type==='link-download'"
                  class="hidden" :linkhref="_href()"></span>
            <Button :title="_title()" :label="_text()"
                    :class=getActionClass()
                    :icon="_icon()"
                    :disabled="_disabled()"
                    @click="execute($event)"
            />
        </template>
        <template v-else-if="type =='link' && _visible()">
            <Button :title="_title()"
                    :class=getActionClass()
                    :disabled="_disabled()"
            >
                <a v-if="externalLink" :href="_href()" :target="target" :title="_title()" :disabled="_disabled()">
                    <i v-if="_icon()" :class="_icon()"></i>
                    {{_text()}}
                </a>
                
                <router-link v-else :to="_href()" :conf="conf" :target="target" :title="_title()" :disabled="_disabled()" >
                    <i v-if="_icon()" :class="_icon()"></i>
                    {{_text()}}
                </router-link>
            </Button>
        </template>
        <template v-else-if="type  && _visible()">
            <component :is="type" :conf="conf" :title="_title()"></component>
        </template>
        <template v-else-if="_visible()">
            <b>controlType ({{ type }}) non riconosciuto</b>
        </template>

</template>

<script>

import _aSelect from "../../actions/_aSelect.vue";
export default {
    name: "aSelect",
    extends: _aSelect,
}
</script>

<style scoped>

</style>
