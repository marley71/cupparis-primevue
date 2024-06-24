import CrudCore from "../lib/CrudCore";
import viewConfs from "../confs/views";

export default class WrapperConf {

    constructor(view) {
        this.view = view;
    }

    loadConf(conf) {
        let that = this;
        //console.log('VIEW CONF',conf);
        //console.log('View.WrapperConf type',conf.type);
        if (!conf.type)
            throw "confurazione non trovata per la view definire il type della vista";
        var defConf = null;
        if (['v-edit','v-view','v-insert','v-record','v-search'].indexOf(conf.type) >= 0) {
            defConf = CrudCore.clone(viewConfs.recordView);
        } else if (['v-list','v-list-edit','v-list-hasmany'].indexOf(conf.type) >= 0) {
            defConf = CrudCore.clone(viewConfs.listView);
        } else {
            defConf = CrudCore.clone(viewConfs.defaultView);
        }
        let wName = CrudCore.camelCase(conf.type || viewConfs.defaultView.type);
        //console.log('wname',that[wName])
        if (that[wName]) {
            conf = that[wName](conf);
        }
        conf = Object.assign(defConf,conf);
        return conf;
    }

    vList(conf) {
        //console.log('wList conf',conf);
        //conf.selectionMode = 'multiple';
        conf.selected = null;
        if (!conf.type) {
            conf.type = 'v-list'
        }
        if (! ('routeName' in conf) ){
            conf.routeName = 'list';
        }
        if (!conf.fields && conf.value) {
            //console.log('keys',Object.keys(conf.value[0]))
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

    vListHasmany(conf) {
        conf.type = 'v-list-hasmany';
        conf.getFieldName = conf.getFieldName || function (field) {
            let that = this;
            return (that.modelName?that.modelName + '-':'') + field + '[]';
        }
        //conf.widgetsConfig = [];
        return conf;
    }
    vRecord(conf) {
        if (!conf.layout) {
            conf.layout = viewConfs.recordLayouts.record
        }
        if (!conf.fields && conf.value) {
            console.log('keys',Object.keys(conf.value))
            conf.fields = Object.keys(conf.value);
        }
        conf.widgetsConfig = {};
        conf.recordActionsConf = {};
        return conf;
    }

    vView(conf) {
        let defaultWidgetType = conf.defaultWidgetType;
        conf = this.vRecord(conf);
        if (! ('routeName' in conf) ){
            conf.routeName = 'view';
        }
        if (!('actions' in conf) ){
            conf.actions = [];
        }
        if (!defaultWidgetType)
            conf.defaultWidgetType = 'w-text';
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
            conf.actions = ['action-save','action-back'];
        }
        return conf;
    }

    vSearch(conf) {
        if (!conf.layout) {
            conf.layout = viewConfs.recordLayouts.search
        }
        if (!conf.searchType) {
            conf.searchType = conf.searchType = 'both';
        }
        if (!conf.advancedSearchAccordion) {
            conf.advancedSearchAccordion =
                conf.searchType === 'both' ? true : false;
        }
        conf = this.vRecord(conf);
        if (! ('routeName' in conf) ){
            conf.routeName = 'search';
        }
        conf.defaultWidgetType = 'w-input';
        if (!('actions' in conf) ){
            conf.actions = ['action-search','action-search-basic'];
        }
        if (! ('advancedSearchOpen' in conf) ) {
            conf.advancedSearchOpen = false;
        }
        conf.basicSearchPlaceholder = null;

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
            conf.actions = ['action-save','action-back'];
        }
        return conf;
    }

    vBase(conf) {
        conf = Object.assign(viewConfs.defaultView,conf);
        return conf;
    }
}
