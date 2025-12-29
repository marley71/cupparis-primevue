<template>
    <Card ref="el">
        <template #title>
            <slot name="title">
                {{ conf.importTitle?translate(conf.importTitle):translate('app.import-title') }}
            </slot>
        </template>
        <template #content>
            <slot name="description">
                <div class="mb-0" v-html="importDesc?translate(importDesc):translate('app.import-desc')"></div>
            </slot>

            <div v-if="step == 'upload'" class="panel panel-default">
                <h5>{{ conf.importFile?translate(conf.importFile):translate('app.import-file') }}</h5>
                <div class="flex gap-2" v-if="conf.importLinkExample">
                    <div class="pt-1">{{ conf.importLinkDesc?translate(conf.importLinkDesc):translate('app.import-link-desc') }}</div>
                    <a href="conf.importLinkExample" target="_blank">
                        <i class="fa-2x fa fa-download"></i>
                    </a>
                </div>
                <div class="col-12">
                    <v-insert :conf="_uploadConf()" ref="viewUpload"></v-insert>
                </div>
            </div>
            <div v-if="['saving','loading'].indexOf(step) >= 0">
                <ProgressBar mode="indeterminate">
                    <div v-if="step==='loading'">
                        {{ conf.importLoading?translate(conf.importLoading):translate('app.import-loading') }}
                    </div>
                    <div v-if="step==='saving'">
                        {{ conf.importSaving?translate(conf.importSaving):translate('app.import-saving') }}
                    </div>
                </ProgressBar>
            </div>
            <div v-if="['tosave','load'].indexOf(step) >= 0" >
                <div>{{ conf.importLoadingSuccess?translate(conf.importLoadingSuccess):translate('app.import-loading-success') }}</div>
                <hr/>
                <v-record v-if="step=='tosave'" :conf="_saveConf()" ref="viewSave"></v-record>
                <!-- <v-datafile-list :conf="_listConf()"></v-datafile-list> -->
                <v-list :conf="_listConf()" ref="viewList"></v-list>
            </div>
        </template>
    </Card>
</template>

<script>

import vRecord from "../views/vRecord.vue";
import vList from '../views/vList.vue';
import _cImport from "@cupparis-lib/app/_cImport.vue";

export default {
    name: "c-import",
    components: {vRecord,vList},
    extends : _cImport,
}
</script>

<style scoped>

</style>
