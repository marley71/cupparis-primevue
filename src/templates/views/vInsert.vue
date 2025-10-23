<template>
    <div>
        <template v-if="inlist && loaded">
            <slot name="content">
                <tr role="row" v-if="isInlist">
                    <td class="" role="columnheader">
                        <!--                <Button icon="fa fa-trash" class="p-button-outlined p-button-danger"-->
                        <!--                    @click="inlistAction(indexInlist,'delete')">-->
                        <!--                </Button>-->
                        <Button icon="fa fa-trash" class="p-button-outlined p-button-danger"
                                @click="removeFromList()">
                        </Button>
                        <template v-for="field in getHiddenFields()">

                            <template v-if="!isRemovedWidget(field)">
                                <component :is="widgetsConfig[field].type" :ref="field" :conf="widgetsConfig[field]" v-show="!isHiddenWidget(field)"></component>
                            </template>

                        </template>
                    </td>


                    <td v-for="(field,indexV) in getVisibleFields()" :key="field" class="" role="cell">

                        <div class="">
                            <template v-if="!isRemovedWidget(field)">
                                <component :is="widgetsConfig[field].type" :ref="field" :conf="widgetsConfig[field]" v-show="!isHiddenWidget(field)"></component>
                            </template>
                        </div>

                    </td>
                </tr>
            </slot>
        </template>
        <template v-if="loaded && !inlist">

            <div v-if="loaded">
                <slot name="content">
                    <div v-if="hasActionsDivider()">
                        <Divider align="center" class="actionsDivider">
                                        <span class="p-tag text-white">
                                            {{ title }}
                                        </span>

                        </Divider>
                    </div>

                    <template v-if="type==='v-view'">

                        <template v-for="field in getHiddenFields()">
                            <template v-if="!isRemovedWidget(field)">
                                <component :is="widgetsConfig[field].type" :ref="field" :conf="widgetsConfig[field]" v-show="!isHiddenWidget(field)"></component>
                            </template>

                        </template>
                        <div class="grid grid-cols-12 gap-2">
                            <template v-for="field in getVisibleFields()" :key="field">
                                <template v-if="!isRemovedWidget(field)" >
                                    <div class="py-3" :class="getWidgetLayout(field,'colClass')" v-show="!isHiddenWidget(field)">

                                        <template v-if="getWidgetLayout(field,'labelPosition')==='float'">

                                                <span class="p-float-label">
                                                    <component :is="widgetsConfig[field].type" :ref="field" :conf="widgetsConfig[field]"></component>
                                                    <label :for="field">{{ widgetsConfig[field].label }}</label>
                                                </span>
                                        </template>
                                        <template v-else>

                                            <label class="labelRecord labelTop" :for="field"
                                                   v-if="getWidgetLayout(field,'labelPosition')=='top'">
                                                {{ translateUc(widgetsConfig[field].label) }}
                                            </label>
                                            <div class="">
                                                <component :is="widgetsConfig[field].type" :ref="field" :conf="widgetsConfig[field]"></component>
                                            </div>
                                            <label class="labelRecord labelBottom" :for="field"
                                                   v-if="getWidgetLayout(field,'labelPosition')=='bottom'">
                                                {{ translateUc(widgetsConfig[field].label) }}
                                            </label>
                                        </template>

                                    </div>
                                </template>
                                <template v-if="getWidgetLayout(field,'hasDivider')">
                                    <Divider align="center" class="col-10 col-offset-1">
                                            <span v-if="getWidgetLayout(field,'dividerLabel')"
                                                  class="p-tag text-white">{{ getWidgetLayout(field, 'dividerLabel') }}</span>
                                    </Divider>

                                </template>
                                <template v-else-if="getWidgetLayout(field,'lastInRow')">
                                    <div class="col-12 max-h-0 p-0">&nbsp;</div>
                                </template>
                            </template>
                        </div>
                        <div>
                            <c-action ref="actions" :conf="recordActionsConf" layout="buttons"></c-action>
                        </div>
                    </template>
                    <template v-else>

                        <form ref="form" enctype="multipart/form-data" @submit="handleSubmit" class="p-fluid">

                            <template v-for="field in getHiddenFields()">

                                <template v-if="!isRemovedWidget(field)">
                                    <component :is="widgetsConfig[field].type" :ref="field" :conf="widgetsConfig[field]"></component>
                                </template>
                            </template>
                            <div class="grid grid-cols-12 gap-2">
                                <template v-for="field in getVisibleFields()" :key="field">
                                    <template v-if="hasDividerBefore(field)">




                                        <Divider align="center" :class="getDividerClass(field)" v-show="!isHiddenWidget(field)">
                                            <span v-if="getDividerContent(field)" v-html="getDividerContent(field)"
                                                  :class="getDividerContentClass(field)">
                                            </span>
                                        </Divider>
                                        <div class="col-12 dividerDescription" v-if="getDividerDescription(field)"
                                             v-show="!isHiddenWidget(field)"
                                             v-html="getDividerDescription(field)">

                                        </div>

                                    </template>

                                    <template v-if="!isRemovedWidget(field)" >
                                        <div class="py-3" :class="getWidgetLayout(field,'colClass')" v-show="!isHiddenWidget(field)">
                                            <template v-if="getWidgetLayout(field,'labelPosition')==='float'">

                                                <span class="p-float-label">
                                                    <component :is="widgetsConfig[field].type" :ref="field" :conf="widgetsConfig[field]"></component>
                                                    <label :for="field">{{ widgetsConfig[field].label }}{{ isRequired(field) }}</label>
                                                </span>
                                            </template>
                                            <template v-else>

                                                <label class="labelRecord labelTop" :for="field"
                                                       v-if="getWidgetLayout(field,'labelPosition')=='top'">
                                                    {{ translateUc(widgetsConfig[field].label) }}{{ isRequired(field) }}
                                                </label>
                                                <div class="">
                                                    <component :is="widgetsConfig[field].type" :ref="field" :conf="widgetsConfig[field]"></component>
                                                </div>
                                                <label class="labelRecord labelBottom" :for="field"
                                                       v-if="getWidgetLayout(field,'labelPosition')=='bottom'">
                                                    {{ translateUc(widgetsConfig[field].label) }}{{ isRequired(field) }}
                                                </label>
                                            </template>
                                        </div>
                                    </template>
                                    <template v-if="hasDividerAfter(field)">
                                        <Divider align="center" :class="getDividerClass(field)" v-show="!isHiddenWidget(field)">
                                            <span v-if="getDividerContent(field)" v-html="getDividerContent(field)"
                                                  :class="getDividerContentClass(field)">
                                            </span>
                                        </Divider>
                                        <div class="col-12 dividerDescription" v-if="getDividerDescription(field)"
                                             v-show="!isHiddenWidget(field)"
                                             v-html="getDividerDescription(field)">

                                        </div>

                                    </template>
                                    <template v-else-if="getWidgetLayout(field,'lastInRow')">
                                        <div class="col-12 max-h-0 p-0">&nbsp;</div>
                                    </template>
                                </template>
                            </div>
                        </form>
                        <div class="w-full">
                            <c-action ref="actions" :conf="recordActionsConf" layout="buttons"></c-action>
                        </div>
                    </template>
                </slot>
            </div>
        </template>
    </div>
</template>

<script>

import _vInsert from '@cupparis-lib/views/_vInsert.vue'
import cAction from "../actions/cAction.vue";

export default {
  name : "v-insert",
  extends: _vInsert,
  components: {cAction},
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
