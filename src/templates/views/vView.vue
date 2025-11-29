<template>
    <div>
        <slot name="content" :value="value" :metadata="metadata" :widgetsConfig="widgetsConfig">

            <template v-if="loaded">

                <slot name="content">
                    <div v-if="hasActionsDivider()">
                        <Divider align="center" class="actionsDivider">
                            <span class="p-tag text-white">
                                {{ title }}
                            </span>

                        </Divider>
                    </div>



                    <template v-for="field in getHiddenFields()">
                        <template v-if="!isRemovedWidget(field)">
                            <component :is="widgetsConfig[field].type" :ref="field" :conf="widgetsConfig[field]"
                                v-show="!isHiddenWidget(field)"></component>
                        </template>

                    </template>
                    <div class="grid">
                        <template v-for="field in getVisibleFields()" :key="field">
                            <template v-if="!isRemovedWidget(field)">
                                <div class="py-3" :class="getWidgetLayout(field, 'colClass')"
                                    v-show="!isHiddenWidget(field)">

                                    <template v-if="getWidgetLayout(field, 'labelPosition') === 'float'">

                                        <span class="p-float-label">
                                            <component :is="widgetsConfig[field].type" :ref="field"
                                                :conf="widgetsConfig[field]"></component>
                                            <label :for="field">{{ widgetsConfig[field].label }}</label>
                                        </span>
                                    </template>
                                    <template v-else>

                                        <label class="labelRecord labelTop" :for="field"
                                            v-if="getWidgetLayout(field, 'labelPosition') == 'top'">
                                            {{ translateUc(widgetsConfig[field].label) }}
                                        </label>
                                        <div class="">
                                            <component :is="widgetsConfig[field].type" :ref="field"
                                                :conf="widgetsConfig[field]"></component>
                                        </div>
                                        <label class="labelRecord labelBottom" :for="field"
                                            v-if="getWidgetLayout(field, 'labelPosition') == 'bottom'">
                                            {{ translateUc(widgetsConfig[field].label) }}
                                        </label>
                                    </template>

                                </div>
                            </template>
                            <template v-if="getWidgetLayout(field, 'hasDivider')">
                                <Divider align="center" class="col-10 col-offset-1">
                                    <span v-if="getWidgetLayout(field, 'dividerLabel')" class="p-tag text-white">{{
                                        getWidgetLayout(field, 'dividerLabel') }}</span>
                                </Divider>

                            </template>
                            <template v-else-if="getWidgetLayout(field, 'lastInRow')">
                                <div class="col-12 max-h-0 p-0">&nbsp;</div>
                            </template>
                        </template>
                    </div>
                    <div>
                        <c-action ref="actions" :conf="recordActionsConf" layout="buttons"></c-action>
                    </div>

                </slot>

            </template>
        </slot>
    </div>
</template>

<script>

import _vView from '@cupparis-lib/views/_vView.vue'
import cAction from "../actions/cAction.vue";

export default {
    name: "v-view",
    extends: _vView,
    components: { cAction },
}

</script>

<style lang="scss" scoped>
label.labelTop {
    font-size: 12px;
    color: var(--surface-text);
    position: relative;
    top: -0.25rem;
    left: 0.25rem;
}
</style>
