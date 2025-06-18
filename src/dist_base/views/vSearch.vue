<template>

    <div v-if="loaded">

        <div class="preSearch" v-if="hasSearchLabel()">
                                <span class="p-tag">
                                    {{ _searchLabel() }}
                                </span>
        </div>
        <!--        <div>-->
        <!--            <Divider align="center" class="actionsDivider">-->
        <!--                                <span class="p-tag">-->
        <!--                                    Filtra elementi-->
        <!--         @keyup.enter="search('basic')"     @keyup.enter="(event)=> search('basic',event)"                   </span>-->

        <!--            </Divider>-->
        <!--        </div>-->


        <div class="panel-search-content grid" :class="hasBothSearches() ? ' panel-search-content-both' : ''">

            <div :class="basicSearchClass()" v-if="hasBasicSearch()">
                <form ref="formBasic" enctype="multipart/form-data"
                      @change="(event)=> search('basic',event)"
                      @submit.prevent="(event)=> search('basic',event)"
                      class="p-fluid mt-1">
                    <template v-for="field in getHiddenFields()" :key="field">
                        <component :is="widgetsConfig[field].type" :ref="field" :conf="widgetsConfig[field]"></component>
                    </template>

                    <div class="p-inputgroup">

                        <!-- <c-action ref="actions" :conf="recordActionsConf" :whitelist="['action-search-basic']"
                                  layout="buttons"></c-action> -->
                        <span class="p-input-icon-left">
                            <i class="pi pi-search"/>
                            <InputText name="s_basic_query" class="p-inputtext p-component w-full"
                                       v-model="s_basic_query"
                            ></InputText>
                        </span>
                    </div>

                </form>

            </div>
            <div :class="advancedSearchClass()" v-if="hasAdvancedSearch()">

                <div v-if="hasAdvancedSearchAccordion()">


                    <Accordion :activeIndex="isAdvancedSearchOpen()">

                        <AccordionTab :header="advancedSearchHeader()">
                            <form ref="form" enctype="multipart/form-data"
                                  @change="(event)=> search('advanced',event)"
                                  @submit.prevent="(event)=> search('advanced',event)"
                                  class="p-fluid mt-5">

                                <template v-for="field in getHiddenFields()">
                                    <component :is="widgetsConfig[field].type" :ref="field" :conf="widgetsConfig[field]"></component>
                                </template>
                                <div class="grid">
                                    <template v-for="field in getVisibleFields()" :key="field">
                                        <div class="py-3" :class="getWidgetLayout(field,'colClass')">
                                            <template v-if="getWidgetLayout(field,'labelPosition')==='float'">
                                <span class="p-float-label">
                                <component :is="widgetsConfig[field].type" :ref="field" :conf="widgetsConfig[field]"></component>
                                <label :for="field">{{ widgetsConfig[field].label }}</label>
                                </span>
                                            </template>
                                            <template v-else>

                                                <label class="labelTop" :for="field"
                                                       v-if="getWidgetLayout(field,'labelPosition')=='top'">
                                                    {{ translateUc(widgetsConfig[field].label) }}
                                                </label>
                                                <div class="">
                                                    <component :is="widgetsConfig[field].type" :ref="field" :conf="widgetsConfig[field]"></component>
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
                <form v-else ref="form" enctype="multipart/form-data"
                      @change="(event)=> search('advanced',event)"
                      @submit.prevent="(event)=> search('advanced',event)"
                      class="p-fluid mt-5">

                    <template v-for="field in getHiddenFields()">
                        <component :is="widgetsConfig[field].type" :ref="field" :conf="widgetsConfig[field]"></component>
                    </template>
                    <div class="grid">
                        <template v-for="field in getVisibleFields()" :key="field">
                            <div class="py-3" :class="getWidgetLayout(field,'colClass')">
                                <template v-if="getWidgetLayout(field,'labelPosition')==='float'">
                                <span class="p-float-label">
                                <component :is="widgetsConfig[field].type" :ref="field" :conf="widgetsConfig[field]"></component>
                                <label :for="field">{{ widgetsConfig[field].label }}</label>
                                </span>
                                </template>
                                <template v-else>

                                    <label class="labelTop" :for="field"
                                           v-if="getWidgetLayout(field,'labelPosition')=='top'">
                                        {{ translateUc(widgetsConfig[field].label) }}
                                    </label>
                                    <div class="">
                                        <component :is="widgetsConfig[field].type" :ref="field" :conf="widgetsConfig[field]"></component>
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


            </div>
        </div>


    </div>
</template>


<script>
import _vSearch from '../../views/_vSearch.vue'
import cAction from "../actions/cAction.vue";

export default {
  name : "v-search",
  extends: _vSearch,
  components : {cAction}
}


</script>

<style lang="scss" scoped>

.panel-search-content-both {
    background-color: var(--primary-50);
}

.actionsDivider.p-divider-horizontal:before {
    border-color: var(--primary-100);
}

.actionsDivider {
    :deep(.p-tag) {
        background-color: var(--primary-50);
        color: var(--primary-color)
    }
}

.preSearch {
    width: 100%;
    text-align: center;
    margin-bottom: 2rem;

    :deep(.p-tag) {
        background-color: transparent;
        color: var(--primary-color);
        font-size: 0.95rem;
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


.panel-search-content {

    :deep(.p-accordion-header-text) {
        color: var(--primary-color);
    }

    :deep(.p-accordion-toggle-icon) {
        color: var(--primary-color);
    }

    :deep(.p-accordion-tab a) {
        background-color: white;
        padding: 1rem;
    }

    :deep(.p-accordion-header:hover) {

        //background-color: var(--primary-color);

        .p-panel-title {
            color: var(--primary-color);
        }

        .p-accordion-toggle-icon {
            color: var(--primary-color);
        }
    }


    //
    //.p-accordion-content {
    //    border-color: var(--primary-color);
    //}

    //.p-accordion-header {
    //    border-color: var(--primary-color);
    //}
}


</style>
