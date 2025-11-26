const baseView = {
    name : '',
    value: null,
    fields: null,
    type: 'v-base',
    extraBind: {},
    title:'',
    headerHelp:'',
    loaded : false,
    route : null,
    routeName : null,
    defaultWidgetType : 'w-text',
    fieldsConfig:{},
    actionsConfig: {},
    metadata:{},
    autoload : true,
    blocked : false,
    modelName : null,
}


const viewConfs = {
    baseView : baseView,
    recordLayouts : {
        default : {
            cols : 2, // puo' essere 1,2,3,4,6,12
            labelPosition : 'top',  // puo' essere top,bottom,none
        },
        search : {
            cols : 2, // puo' essere 1,2,3,4,6,12
            labelPosition : 'top',  // puo' essere top,bottom,none
        },
        record : {
            cols : 2, // puo' essere 1,2,3,4,6,12
            labelPosition : 'top',  // puo' essere top,bottom,none
        }
    },
    defaultView : {
        name : '',
        value: null,
        fields: null,
        type: 'v-base',
        extraBind: {},
        title:'',
        headerHelp:'',
        orderFields:{},
        paginator:true,
        rows : 20,
        loaded : false,
        route : null,
        routeName : null,
        defaultWidgetType : 'w-text',
        fieldsConfig:{},
        actionsConfig: {},
        metadata:{},
        pagination:{},
        selectionMode: null,
        autoload : true,
        blocked : false,
        modelName : null,
    },
    listView : {
        name : '',
        value: null,
        fields: null,
        type: 'v-base',
        extraBind: {},
        title:'',
        headerHelp:'',
        orderFields:{},
        paginator:true,
        paginatorPosition:'both',
        rows : 20,
        loaded : false,
        route : null,
        routeName : null,
        defaultWidgetType : 'w-text',
        fieldsConfig:{},
        actionsConfig: {},
        metadata:{},
        pagination:{},
        selectionMode: 'multiple',
        autoload : true,
        recordActionsPosition: 'end',
        actionsLayout : 'simple',
        actionsLayoutTitle :  '',
        actionRecordLayout : 'simple',
        actionRecordLayoutTitle : '',
        blocked : false,
        modelName : null,
        hiddenColumns : [],
        updateHash : true,  // se true aggiorna la hash invece di fare il reload della view.
        //autoSearch : true, // se e' true la view cerca dentro l'hash se ci sono parametri di ricerca (s_{fieldName}) e li applica alla chiamata
        filterFields : {}, // se sono presenti dei fields nel formato s_{fieldName} li applica alla chiamata ajax
        //numeroRecordsLabel : null, // label del numero dei records
    },
    recordView : {
        name : '',
        value: null,
        fields: null,
        type: 'v-base',
        extraBind: {},
        title:'',
        headerHelp:'',
        loaded : false,
        route : null,
        routeName : null,
        defaultWidgetType : 'w-input',
        fieldsConfig:{},
        actionsConfig: {},
        metadata:{},
        autoload : true,
        actionDivider: false,
        blocked : false,
        modelName : null,
    },
    searchView : Object.assign( baseView,{
        updateHash : true,  // se true i parametri di ricerca li mette nell'url
        advancedFields: null,
    })
}

export default viewConfs;
