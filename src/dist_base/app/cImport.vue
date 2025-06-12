<template>
    <Card ref="el">
        <template #title>
            <slot name="title">
                {{ conf.importTitolo?translate(conf.importTitolo):translate('app.import-titolo') }}
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
                    <component :is="_uploadConf().type" :conf="_uploadConf()" ref="viewUpload"></component>
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
            <div v-if="step=='tosave'">
                <div>{{ conf.importLoadingSuccess?translate(conf.importLoadingSuccess):translate('app.import-loading-success') }}</div>
                <hr/>
                <v-record :conf="_saveConf()"></v-record>
                <v-list :conf="_listConf()">
                </v-list>
            </div>
        </template>
    </Card>
</template>

<script>

import vRecord from "../views/vRecord.vue";
import _cImport from "../../app/_cImport.vue";

export default {
    name: "c-import",
    components: {vRecord},
    extends : _cImport,
}
</script>

<style scoped>

</style>
