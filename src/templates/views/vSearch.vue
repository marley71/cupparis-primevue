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


    <div class="panel-search-content">

      <form ref="formSearch" enctype="multipart/form-data"
            @keyup.enter="(event)=> search('basic',event)"
            @submit.prevent="(event)=> search('basic',event)"
            class="p-fluid mt-1">
        <template v-for="field in getHiddenFields()" :key="field">
          <component :is="widgetsConfig[field].type" :ref="'fields-'+field" :conf="widgetsConfig[field]"></component>
        </template>
        <div class="w-full p-inputgroup" v-if="hasBasicSearch()">

          <IconField>
            <InputIcon class="fa fa-search"/>
            <InputText name="s_basic_query" v-model="s_basic_query" class="w-full mb-2"/>
          </IconField>

        </div>

        <div class="grid grid-cols-12 gap-1 gap-x-3">

          <template v-for="field in getBasicFields()" :key="field">
            <template v-if="hasDividerBefore(field)">
              <v-record-divider v-show="!isHiddenWidget(field)"
                                :dividerInfo="getDividerInfo(field)"></v-record-divider>
            </template>
            <div class="py-1" :class="getWidgetLayout(field,'colClass')">
              <v-record-widget :field="field" :ref="'fields-'+field" :labelInfo="getLabelInfo(field)"
                               :widgetConfig="widgetsConfig[field]">
              </v-record-widget>
            </div>

            <template v-if="hasDividerAfter(field)">
              <v-record-divider v-show="!isHiddenWidget(field)"
                                :dividerInfo="getDividerInfo(field)"></v-record-divider>
            </template>
            <template v-else-if="getWidgetLayout(field,'lastInRow')">
              <div class="col-12 max-h-0 p-0">&nbsp;</div>
            </template>
          </template>
        </div>


        <div class="w-full mt-3 " v-show="hasAdvancedSearch()">

          <Accordion :value="advancedSearchOpen" v-model:value="advancedSearchOpen" class="border border-primary-600 rounded-lg bg-transparent" >
            <AccordionPanel value="0"  style="box-shadow:none" >
              <AccordionHeader class="text-primary-800!">{{ advancedSearchHeader() }}</AccordionHeader>
              <AccordionContent>

                <div class="grid grid-cols-12">
                  <template v-for="field in getAdvancedFields()" :key="field">
                    
                    <template v-if="!isHiddenField(field) && !isHiddenWidget(field)">
                      <template v-if="hasDividerBefore(field)">
                        <v-record-divider v-show="!isHiddenWidget(field)"
                                          :dividerInfo="getDividerInfo(field)"></v-record-divider>
                      </template>

                      <div class="py-3 px-1" :class="getWidgetLayout(field,'colClass')">
                        <v-record-widget  :field="field" :ref="'fields-'+field" :labelInfo="getLabelInfo(field)"
                                        :widgetConfig="widgetsConfig[field]">
                        </v-record-widget>
                      </div>

                      <template v-if="hasDividerAfter(field)">
                        <v-record-divider 
                                          :dividerInfo="getDividerInfo(field)"></v-record-divider>
                      </template>
                      <template v-else-if="getWidgetLayout(field,'lastInRow')">
                        <div class="col-12 max-h-0 p-0">&nbsp;</div>
                      </template>
                    </template>
                    
                  </template>
                </div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>


        </div>

        <div class="col-span-12">
          <div class="flex flex-row justify-center my-2">


            <c-action ref="actions" :conf="recordActionsConf"
                      layout="buttons"></c-action>
          </div>

        </div>
        <Divider align="center" class="actionsDivider">

        </Divider>
      </form>
    </div>


  </div>
</template>


<script>
import _vSearch from '@cupparis-lib/views/_vSearch.vue'
import cAction from "../actions/cAction.vue";
import {libStatus} from '@cupparis-lib/store/libStatus';


export default {
  name: "v-search",
  extends: _vSearch,
  components: {cAction},
  mounted() {
    const pinia = this.$pinia;
    const libStatusStore = pinia ? libStatus(pinia) : libStatus();
    if (libStatusStore.advancedSearchActive[this.modelName]) {
      this.advancedSearchOpen = '0';
    }
  },
  watch: {
    advancedSearchOpen(value) {
      const pinia = this.$pinia;
      const store = pinia ? libStatus(pinia) : libStatus();
      if (value == null) {
        store.advancedSearchActive[this.modelName] = false;
      } else {
        store.advancedSearchActive[this.modelName] = true;
      }
    }
  }
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
  top: 0;
  left: 0.25rem;
}


.panel-search-content {

  margin-top: 1em;

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
