<template>

    <div v-if="loaded">
        <div>
            <Divider align="center" class="actionsDivider">
                                <span class="p-tag text-white">
                                    Filtra elementi
                                </span>

            </Divider>
        </div>
        <form ref="form" enctype="multipart/form-data" @submit.prevent="handleSubmit(!v$.$invalid)"
              class="p-fluid mt-5">
            <template v-for="field in getHiddenFields()">
                <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
            </template>
            <div class="grid">
                <template v-for="field in getVisibleFields()" :key="field">
                    <div class="py-3" :class="getWidgetLayout(field,'colClass')">
                        <template v-if="getWidgetLayout(field,'labelPosition')==='float'">
                                <span class="p-float-label">
                                <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
                                <label :for="field">{{ widgetsConfig[field].label }}</label>
                                </span>
                        </template>
                        <template v-else>

                            <div v-if="getWidgetLayout(field,'labelPosition')=='top'">
                                {{ widgetsConfig[field].label }}
                            </div>
                            <div class="">
                                <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
                            </div>
                            <div v-if="getWidgetLayout(field,'labelPosition')=='bottom'">
                                {{ widgetsConfig[field].label }}
                            </div>
                        </template>
                    </div>

                    <template v-if="getWidgetLayout(field,'hasDivider')">
                        <Divider align="center" class="col-10 col-offset-1">
                                <span v-if="getWidgetLayout(field,'dividerLabel')"
                                      class="p-tag text-white">{{ getWidgetLayout(field, 'dividerLabel') }}</span>
                        </Divider>

                    </template>
                    <div v-else-if="getWidgetLayout(field,'lastInRow')" :class="getWidgetLayout(field,'lastInRow')">
                    </div>
                </template>
            </div>
        </form>
        <Divider align="center" class="actionsDivider">

        </Divider>
        <div class="text-center">
            <c-action ref="actions" :conf="recordActionsConf" layout="buttons"></c-action>
        </div>

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

<style lang="scss" scoped>
.actionsDivider.p-divider-horizontal:before {
    border-color: var(--primary-color);
}
</style>
