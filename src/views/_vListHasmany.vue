<script>

import _vList from './_vList.vue';

export default {
    name: "vListHasmany",
    extends: _vList,
    mounted() {
        if (this.autoload)
            this.load();
    },
    data() {
        //console.debug('VLISTHASMANY',this.conf);
        return {
            rows: 5,
            selected : null,
            menuCollection: [],
            panelConf: {
                componentName: null,
                componentConf: {},
                classWidth: 'w-1/3'
            },
            labelCols : {}
        }
    },
    methods: {
        getFieldName(field) {
            //console.debug('v-list-hasmany getFieldName',field);
            return field + '[]';
        },
        /**
         * deseleziona le righe selezionate , importante dopo una cancellazione multipla per evitare che rimanagno
         * selezionati alcune rows
         */
        deselectAll() {
            this.selected = null;
        }
    }
}
</script>

<style lang="scss" scoped>

.p-datatable {
    :deep(.p-datatable-header) {
        background-color: transparent;
        padding: 1.25rem 0;
        margin-top: 0;
        margin-bottom: 1rem;
        border-top: 2px solid var(--primary-color);
    }

    :deep(.p-datatable-header .surface-section) {
        padding-left: 0.75rem !important;
        padding-right: 0.75rem !important;
    }

    :deep(.p-datatable-wrapper) {
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

}


</style>
