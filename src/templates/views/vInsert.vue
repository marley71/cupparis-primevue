<template>
  <div>
    <template v-if="loaded">
      <slot name="header" :headerHelp="headerHelp" :headerHelpFile="headerHelpFile">
        <div v-if="headerHelp">{{ headerHelp }}</div>
        <div v-if="headerHelpHtml" v-html="headerHelpHtml"></div>
      </slot>
      <slot name="content" :value="value" :metadata="metadata" :widgetsConfig="widgetsConfig" :loaded="loaded"
            :recordActionsConf="recordActionsConf">
        <div v-if="getTitleMsg()">
          <Divider align="center" class="actionsDivider">
                        <span class="p-tag text-white">
                            {{ getTitleMsg() }}
                        </span>
          </Divider>
        </div>
        <form ref="form" enctype="multipart/form-data" @submit="handleSubmit" class="p-fluid">
          <template v-for="field in getHiddenFields()">
            <template v-if="!isRemovedWidget(field)">
              <component :is="widgetsConfig[field].type" :ref="'fields-'+field"
                         :conf="widgetsConfig[field]"></component>
            </template>
          </template>
          <!--                  SENZA GRUPPI-->
          <div class="grid grid-cols-12 gap-2" v-if="!getGroups()">
            <template v-for="field in getVisibleFields()" :key="field">
              <template v-if="hasDividerBefore(field)">
                <v-record-divider v-show="!isHiddenWidget(field)"
                                  :dividerInfo="getDividerInfo(field)"></v-record-divider>
              </template>
              <template v-if="!isRemovedWidget(field)">
                <div class="py-3" :class="getWidgetLayout(field,'colClass')" v-show="!isHiddenWidget(field)">
                  <v-record-widget :field="field" :ref="'fields-'+field" :labelInfo="getLabelInfo(field)"
                                   :widgetConfig="widgetsConfig[field]">
                  </v-record-widget>
                </div>
              </template>
              <template v-if="hasDividerAfter(field)">
                <v-record-divider v-show="!isHiddenWidget(field)"
                                  :dividerInfo="getDividerInfo(field)"></v-record-divider>
              </template>
              <template v-else-if="getWidgetLayout(field,'lastInRow')">
                <div class="col-12 max-h-0 p-0">&nbsp;</div>
              </template>
            </template>
          </div>
          <!--                  CON GRUPPI-->
          <div v-else>
            <div class="grid grid-cols-12 gap-2">
              <template v-for="group in getGroups()">

                <div :class="getGroupClass(group)" v-show="!isHiddenGroup(group)">

                  <template v-if="getGroupWrapper(group)==='fieldset'">
                    <Fieldset :ref="'fieldset-'+getGroupName(group)" class="mb-3 border border-surface-300">
                      <template #legend>
                        {{ getGroupTitle(group) }}
                      </template>
                      <div v-if="getGroupHeader(group)" v-html="getGroupHeader(group)">
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <template v-for="field in getGroupVisibleFields(group.fields)" :key="field">
                          <template v-if="hasDividerBefore(field)">
                            <v-record-divider v-show="!isHiddenWidget(field)"
                                              :dividerInfo="getDividerInfo(field)"></v-record-divider>
                          </template>
                          <template v-if="!isRemovedWidget(field)">
                            <div class="py-3" :class="getWidgetLayout(field,'colClass')"
                                 v-show="!isHiddenWidget(field)">
                              <v-record-widget :field="field" :ref="'fields-'+field" :labelInfo="getLabelInfo(field)"
                                               :widgetConfig="widgetsConfig[field]">
                              </v-record-widget>
                            </div>
                          </template>
                          <template v-if="hasDividerAfter(field)">
                            <v-record-divider v-show="!isHiddenWidget(field)"
                                              :dividerInfo="getDividerInfo(field)"></v-record-divider>
                          </template>
                          <template v-else-if="getWidgetLayout(field,'lastInRow')">
                            <div class="col-12 max-h-0 p-0">&nbsp;</div>
                          </template>
                        </template>
                      </div>
                      <div class="w-full" v-if="getGroupActions(group)">
                        <c-action :conf="recordActionsConf" :whitelist="getGroupActions(group)"
                                  layout="buttons"></c-action>
                      </div>
                    </Fieldset>
                  </template>
                  <template v-else-if="getGroupWrapper(group)==='card'">
                    <Card :ref="'card-'+getGroupName(group)" class="mb-3 border border-surface-300">
                      <template #header v-if="getGroupHeader(group)">
                        {{ getGroupHeader(group) }}
                      </template>
                      <template #title v-if="getGroupTitle(group)">
                        {{ getGroupTitle(group) }}
                      </template>
                      <template #content>

                        <div class="grid grid-cols-12 gap-2">
                          <template v-for="field in getGroupVisibleFields(group.fields)" :key="field">
                            <template v-if="hasDividerBefore(field)">
                              <v-record-divider v-show="!isHiddenWidget(field)"
                                                :dividerInfo="getDividerInfo(field)"></v-record-divider>
                            </template>
                            <template v-if="!isRemovedWidget(field)">
                              <div class="py-3" :class="getWidgetLayout(field,'colClass')"
                                   v-show="!isHiddenWidget(field)">
                                <v-record-widget :field="field" :ref="'fields-'+field" :labelInfo="getLabelInfo(field)"
                                                 :widgetConfig="widgetsConfig[field]">
                                </v-record-widget>
                              </div>
                            </template>
                            <template v-if="hasDividerAfter(field)">
                              <v-record-divider v-show="!isHiddenWidget(field)"
                                                :dividerInfo="getDividerInfo(field)"></v-record-divider>
                            </template>
                            <template v-else-if="getWidgetLayout(field,'lastInRow')">
                              <div class="col-12 max-h-0 p-0">&nbsp;</div>
                            </template>
                          </template>
                        </div>
                      </template>
                    </Card>
                  </template>
                  <template v-else>
                    <div>

                      <div v-if="getGroupHeader(group)" v-html="getGroupHeader(group)">
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <template v-for="field in getGroupVisibleFields(group.fields)" :key="field">
                          <template v-if="hasDividerBefore(field)">
                            <v-record-divider v-show="!isHiddenWidget(field)"
                                              :dividerInfo="getDividerInfo(field)"></v-record-divider>
                          </template>
                          <template v-if="!isRemovedWidget(field)">
                            <div class="py-3" :class="getWidgetLayout(field,'colClass')"
                                 v-show="!isHiddenWidget(field)">
                              <v-record-widget :field="field" :ref="'fields-'+field" :labelInfo="getLabelInfo(field)"
                                               :widgetConfig="widgetsConfig[field]">
                              </v-record-widget>
                            </div>
                          </template>
                          <template v-if="hasDividerAfter(field)">
                            <v-record-divider v-show="!isHiddenWidget(field)"
                                              :dividerInfo="getDividerInfo(field)"></v-record-divider>
                          </template>
                          <template v-else-if="getWidgetLayout(field,'lastInRow')">
                            <div class="col-12 max-h-0 p-0">&nbsp;</div>
                          </template>
                        </template>
                      </div>
                    </div>
                  </template>
                </div>

              </template>
            </div>

          </div>

        </form>
        <div class="w-full mt-4">
          <Divider></Divider>
          <c-action ref="actions" :conf="recordActionsConf" :whitelist="getActionsWhitelist()"
                    layout="buttons"></c-action>
        </div>
      </slot>
    </template>
  </div>
</template>

<script>

import _vInsert from '@cupparis-lib/views/_vInsert.vue'
import cAction from "../actions/cAction.vue";

export default {
  name: "v-insert",
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
