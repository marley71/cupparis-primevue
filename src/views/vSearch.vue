<template>

    <div v-if="loaded">
        <Fieldset :legend="title || 'Filter items'" class="mb-4 pt-2">
            <form ref="form" enctype="multipart/form-data" @submit.prevent="handleSubmit(!v$.$invalid)" class="p-fluid">
                <template v-for="field in getHiddenFields()">
                    <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
                </template>
                <div class="grid">
                    <template v-for="field in getVisibleFields()" :key="field">
                        <div class="py-1" :class="getWidgetLayout(field).colClass">
                            <template v-if="getWidgetLayout(field).labelPosition==='float'">
                                <span class="p-float-label">
                                <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
                                <label :for="field">{{ widgetsConfig[field].label }}</label>
                                </span>
                            </template>
                            <template v-else>

                                <div v-if="getWidgetLayout(field).labelPosition=='top'">
                                    {{widgetsConfig[field].label}}
                                </div>
                                <div class="">
                                    <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
                                </div>
                                <div v-if="getWidgetLayout(field).labelPosition=='bottom'">
                                    {{widgetsConfig[field].label }}
                                </div>
                            </template>
                        </div>
                    </template>
                </div>
            </form>
            <div>
                <c-action ref="actions" :conf="recordActionsConf" layout="buttons"></c-action>
            </div>
        </Fieldset>

    </div>
</template>


<script>
import vRecord from './vRecord.vue';

export default {
    name: "vSearch",
    extends: vRecord,
    emits: ['search'],
    methods: {
        search() {
            let that = this;
            var formData = that.view.getViewData();
            this.$emit('search', formData)
        },
        getFieldName(field) {
            return 's_' + field;
        },
    }
}
</script>

<style scoped>

</style>
