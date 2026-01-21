const baseView = () => {
    return {
        name: '',
        value: null,
        fields: null,
        fieldsConfig: {},
        actions: null,
        actionsConfig: {},
        type: 'v-base',
        extraBind: {},
        title: '',
        headerHelp: '',
        headerHelpFile: null,  // file html in caso di help complesso al posto della descrizione semplice headerHelp
        headerHelpHtml: null,
        loaded: false,
        route: null,
        routeName: null,
        defaultWidgetType: 'w-text',
        metadata: {},
        autoload: true,
        blocked: false,
        modelName: null,
    }
}


const viewConfs = {
    baseView: () => {
        return baseView()
    },
    recordLayouts: () => {
        return {
            default: {
                cols: 2, // puo' essere 1,2,3,4,6,12
                labelPosition: 'top',  // puo' essere top,bottom,none
            },
            search: {
                cols: 2, // puo' essere 1,2,3,4,6,12
                labelPosition: 'top',  // puo' essere top,bottom,none
            },
            record: {
                cols: 2, // puo' essere 1,2,3,4,6,12
                labelPosition: 'top',  // puo' essere top,bottom,none
            }
        }
    },
    defaultView: () => {
        let bv = baseView();
        let dv = {
            name: '',
            type: 'v-base',
            extraBind: {},
            title: '',
            orderFields: {},
            paginator: true,
            rows: 20,
            route: null,
            routeName: null,
            defaultWidgetType: 'w-text',
            metadata: {},
            pagination: {},
            selectionMode: null,
            autoload: true,
            blocked: false,
            modelName: null,
        }
        return Object.assign(bv, dv);

    },

    listView: () => {
        let bv = baseView();
        let lv = {
            name: '',
            value: null,
            type: 'v-list',
            extraBind: {},
            title: '',
            orderFields: {},
            paginator: true,
            paginatorPosition: 'both',
            rows: 20,
            route: null,
            routeName: null,
            defaultWidgetType: 'w-text',
            metadata: {},
            pagination: {},
            selectionMode: 'multiple',
            autoload: true,
            recordActionsPosition: 'end',
            actionsLayout: 'simple',
            actionsLayoutTitle: '',
            actionsRecordLayout: 'simple',
            actionsRecordLayoutTitle: 'Azioni',
            blocked: false,
            modelName: null,
            hiddenColumns: [],
            tableKey: Date.now(),  // serve per dare una key al datatable per forzare l'aggiornamento dei valori da parte di vue
            updateHash: true,  // se true aggiorna la hash invece di fare il reload della view.
            //autoSearch : true, // se e' true la view cerca dentro l'hash se ci sono parametri di ricerca (s_{fieldName}) e li applica alla chiamata
            filterFields: {}, // se sono presenti dei fields nel formato s_{fieldName} li applica alla chiamata ajax
            //numeroRecordsLabel : null, // label del numero dei records
            datatableClass: '',
            stripedRows: true,
        };
        return Object.assign(bv, lv);
    },
    recordView: () => {
        let bv = baseView();
        let rv = {
            name: '',
            value: null,
            type: 'v-record',
            extraBind: {},
            title: '',
            route: null,
            routeName: null,
            defaultWidgetType: 'w-input',
            metadata: {},
            autoload: true,
            actionDivider: false,
            blocked: false,
            modelName: null,
            groups: null,
            actionsWhitelist: null,
            colsClasses: {
                1: 'col-span-12',
                2: 'col-span-12 lg:col-span-6',
                3: 'col-span-12 lg:col-span-4',
                4: 'col-span-12 lg:col-span-3',
                6: 'col-span-12 lg:col-span-2',
                12: 'col-span-12 lg:col-span-1',
                0: 'col-span-12'
            }

        }
        return Object.assign(bv, rv);
    },
    searchView: () => {
        let bv = baseView();
        let sv = {
            updateHash: true,  // se true i parametri di ricerca li mette nell'url
            advancedFields: null,
            advancedSearchOpen: null,
        }
        return Object.assign(bv, sv);
    }
}

export default viewConfs;
