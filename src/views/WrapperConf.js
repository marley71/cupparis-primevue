import CrudCore from "../lib/CrudCore";
import viewConfs from "../confs/views";

export default class WrapperConf {
    defaultConf =  {
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
    }

    constructor(view) {
        this.view = view;
    }

    loadConf(conf) {
        let that = this;
        console.log('VIEW CONF',conf);
        let wName = CrudCore.camelCase(conf.type || that.defaultConf.type);

        if (that[wName]) {
            conf = that[wName](conf);
        }
        conf = Object.assign(that.defaultConf,conf);
        return conf;
    }

    vList(conf) {
        console.log('wList conf',conf);
        //conf.selectionMode = 'multiple';
        conf.selected = null;
        if (!conf.type) {
            conf.type = 'v-list'
        }
        if (! ('routeName' in conf) ){
            conf.routeName = 'list';
        }
        if (!conf.fields && conf.value) {
            console.log('keys',Object.keys(conf.value[0]))
            conf.fields = Object.keys(conf.value[0]);
        }
        if (! ('actions' in conf) ){
            conf.actions = ['action-view','action-edit','action-delete','action-delete-selected','action-insert'];
        }
        if (! ('primaryKey' in conf) ){
            conf.primaryKey = 'id';
        }
        conf.recordActionsConf = [];
        conf.collectionActions = {};
        conf.widgetsConfig = [];
        conf.selectedRow = null;
        conf.menuModel = [];
        return conf;
    }

    vListEdit(conf) {
        if (!conf.type) {
            conf.type = 'v-list-edit'
        }
        if (! ('actions' in conf) ){
            conf.actions = [
                'action-insert',
                'action-delete-selected',
                'action-view',
                'action-edit-mode',
                'action-delete',
                'action-save-row',
                'action-view-mode'
            ];
        }
        conf.widgetsConfig = [];
        conf.widgetsEditConfig = [];
        conf.recordActionsConf = [];
        conf.collectionActions = {};
        conf = this.vList(conf);
        return conf;

        /**
         * confParent: 'v-list',
         *             widgetsEdit: {}, // configurazioni widgets in modalità edit
         *             editMode: [],
         *             routeName: 'list',
         *             primaryKey: 'id',
         *             actionsConfig: {},
         *             fieldsConfig: {
         *                 id : {
         *                     type : 'w-input',
         *                     inputType : 'hidden'
         *                 }
         *             },
         *             fieldsConfigEditMode:{
         *                 id : {
         *                     type : 'w-input',
         *                     inputType : 'hidden'
         *                 }
         *             }, // configurazione campi in modalità edit
         *             orderFields: {},
         *             widgetTemplate: 'tpl-list',
         *             actions: [
         *                 'action-insert',
         *                 'action-delete-selected',
         *                 'action-view',
         *                 'action-edit-mode',
         *                 'action-delete',
         *                 'action-save-row',
         *                 'action-view-mode'
         *             ]
         */
    }

    vRecord(conf) {
        if (!conf.fields && conf.value) {
            console.log('keys',Object.keys(conf.value))
            conf.fields = Object.keys(conf.value);
        }
        conf.widgetsConfig = {};
        conf.recordActionsConf = {};
        if (!conf.layout) {
            conf.layout = viewConfs.recordLayouts.default
        }
        return conf;
    }

    vView(conf) {
        conf = this.vRecord(conf);
        if (! ('routeName' in conf) ){
            conf.routeName = 'view';
        }
        if (!('actions' in conf) ){
            conf.actions = [];
        }
        console.log('vViewConf',conf);
        return conf;
    }

    vEdit(conf) {
        conf = this.vRecord(conf);
        if (! ('routeName' in conf) ){
            conf.routeName = 'edit';
        }
        conf.defaultWidgetType = 'w-input';
        if (!('actions' in conf) ){
            conf.actions = ['action-save'];
        }
        return conf;
    }

    vSearch(conf) {
        conf = this.vRecord(conf);
        if (! ('routeName' in conf) ){
            conf.routeName = 'search';
        }
        conf.defaultWidgetType = 'w-input';
        if (!('actions' in conf) ){
            conf.actions = ['action-search'];
        }
        return conf;
    }

    vInsert(conf) {
        conf = this.vRecord(conf);
        if (! ('routeName' in conf) ){
            conf.routeName = 'insert';
        }
        conf.defaultWidgetType = 'w-input';
        conf.targetRef = null;
        if (!('actions' in conf) ){
            conf.actions = ['action-save'];
        }
        return conf;
    }
}
