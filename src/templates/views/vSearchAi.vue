<template>

  <div v-if="loaded">
    <div class="preSearch" v-if="hasSearchLabel()"
         :class="searchLabelClass || ''"
         v-html="_searchLabel()">

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

        <Textarea name="s_ai_query" v-model="s_ai_query" class="w-full mb-2" rows="3" :placeholder="basicSearchPlaceholder"/>
        <div class="col-span-12">

          <div class="flex flex-row justify-center my-2 gap-2">
          <Button type="button" class="p-button-sm" @click="startStop" :disabled="!supported" :title="supported ? 'Avvia la ricerca vocale' : 'Microfono non supportato in questo browser.'">
            <i :class="supported ? ( isRecognizing? 'fas fa-stop' : 'fas fa-microphone' ) : 'fas fa-microphone-slash'"></i>
          </Button>
          <!-- <Button type="button" class="p-button-sm" @click="stop" :disabled="!isRecognizing">Stop</Button> -->
          <!-- <p v-if="!supported" style="color:crimson">Speech Recognition non supportata in questo browser.</p> -->

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
import cAction from "../actions/cAction.vue";
import _vSearchAi from '@cupparis-lib/views/_vSearchAi.vue';

export default {
  name: "v-search-ai",
  extends: _vSearchAi,
  components: {cAction},
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
