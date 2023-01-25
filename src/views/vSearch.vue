<template>

    <div v-if="loaded">
        <div>
            <Divider align="center" class="actionsDivider">
                                <span class="p-tag">
                                    Filtra elementi
                                </span>

            </Divider>
        </div>


        <div class="grid">

            <div :class="basicSearchClass()" v-if="hasBasicSearch()">
                <form ref="form" enctype="multipart/form-data"
                      @submit.prevent="handleSubmit(!v$.$invalid)"
                      class="p-fluid mt-1">
                    <template v-for="field in getHiddenFields()">
                        <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
                    </template>

                    <div class="p-inputgroup">

                        <c-action ref="actions" :conf="recordActionsConf" :whitelist="['action-search-basic']"
                                  layout="buttons"></c-action>

                        <Input name="s_cupparis_query" class="p-inputtext p-component w-full"></Input>
                    </div>

                </form>

            </div>
            <div :class="advancedSearchClass()" v-if="hasAdvancedSearch()">


                <Accordion>

                    <AccordionTab :header="advancedSearchHeader()">
                        <form ref="form" enctype="multipart/form-data"
                              @submit.prevent="handleSubmit(!v$.$invalid)"
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

                                            <label class="labelTop" :for="field"
                                                   v-if="getWidgetLayout(field,'labelPosition')=='top'">
                                                {{ translateUc(widgetsConfig[field].label) }}
                                            </label>
                                            <div class="">
                                                <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
                                            </div>
                                            <label class="labelBottom" :for="field"
                                                   v-if="getWidgetLayout(field,'labelPosition')=='bottom'">
                                                {{ translateUc(widgetsConfig[field].label) }}
                                            </label>
                                        </template>
                                    </div>

                                    <template v-if="getWidgetLayout(field,'hasDivider')">
                                        <Divider align="center" class="col-10 col-offset-1">
                                <span v-if="getWidgetLayout(field,'dividerLabel')"
                                      class="p-tag">{{ getWidgetLayout(field, 'dividerLabel') }}</span>
                                        </Divider>

                                    </template>
                                    <template v-else-if="getWidgetLayout(field,'lastInRow')">
                                        <div class="col-12 max-h-0 p-0">&nbsp;</div>
                                    </template>
                                </template>
                            </div>
                            <Divider align="center" class="actionsDivider">

                            </Divider>
                            <div class="flex flex-row justify-content-center">


                                    <c-action ref="actions" :conf="recordActionsConf"
                                              :blacklist="['action-search-basic']"
                                              layout="buttons"></c-action>
                            </div>
                        </form>
                    </AccordionTab>
                </Accordion>
            </div>
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
        hasBasicSearch() {
            console.log("BSSS:::", this.conf);
            return this.conf.searchType === 'basic' || this.conf.searchType === 'both';
        },
        hasAdvancedSearch() {
            console.log("ASSS:::", this.conf);
            return this.conf.searchType === 'advanced' || this.conf.searchType === 'both';
        },
        hasBothSearches() {
            return this.conf.searchType === 'both';
        },
        advancedSearchHeader() {
            if (this.conf.advancedSearchHeaderLabel) {
                return this.translate(this.conf.advancedSearchHeaderLabel);
            }
            if (this.hasBothSearches()) {
                return this.translate("app.ricerca_avanzata");
            }
            return this.translate("app.ricerca");
        },
        basicSearchClass() {
            if (this.hasBothSearches()) {
                return "col-12 md:col-4 lg:col-3";
            }
            return "col-12 md:col-6";
        },
        advancedSearchClass() {
            if (this.hasBothSearches()) {
                return "col-12 md:col-8 lg:col-9";
            }
            return "col-12";
        }

    }
}
</script>

<style lang="scss" scoped>
.actionsDivider.p-divider-horizontal:before {
    border-color: var(--primary-100);
}

.actionsDivider {
    :deep(.p-tag) {
        background-color: var(--primary-50);
        color: var(--primary-color)
    }
}

.actionsButtons {
    :deep(.p-button-outlined) {
        border-color: var(--primary-400);
        color: var(--primary-400)
    }
}

label.labelTop {
    font-size: 12px;
    color: var(--surface-text);
    position: relative;
    top: -0.25rem;
    left: 0.25rem;
}
</style>
