
<script>

import CrudComponent from "../CrudComponent.vue";
import viewWrapperConf from '../views/WrapperConf'
import CrudCore from "../lib/CrudCore";

export default {
    name: "_cManage",
    extends : CrudComponent,
    // watch : {
    //     '$route.params.context': {
    //         handler: function(context) {
    //             console.debug('showContext context',context);
    //             this.showContext();
    //         },
    //         deep: true,
    //     }
    // },
    mounted() {
        let that = this;
        console.debug('AAA mounted',that.$route.params);
        this.showContext();
        this.setManageReference();
        setTimeout(function () {
            that.loadContext();
            that._setCss();
        },100)

    },
    data() {
        console.debug('AAA data');
        let that = this;
        if (!('title' in that.conf)) {
            that.conf.title = null;
        }
        if (!('layout' in that.conf)) {
            that.conf.layout = null;
        }
        if (!('sectionTitle' in that.conf)) {
            that.conf.sectionTitle = null;
        }
        if (!('hideSearch' in that.conf)) {
            that.conf.hideSearch = false;
        }
        if (!('autoUpdateHash' in that.conf)) {
            that.conf.autoUpdateHash = true;
        }
        let wc = new viewWrapperConf();

        that.conf.list = wc.loadConf(that.conf.list);
        that.conf.list.autoload = false;
        //console.debug('_cManage conf list',that.conf.list)
        let ce = CrudCore.clone( (that.conf.edit || {type:'v-edit'}) );
        let ci = CrudCore.clone( (that.conf.insert || that.conf.edit || {type:'v-insert'}) );
        let cv = CrudCore.clone( (that.conf.view || that.conf.edit || {type:'v-view'}) );
        ce.autoload = false;
        ci.autoload = false;
        cv.autoload = false;

        // se non e' presente insert, modifico il clone di insert perche' e' uguale a quello di edit
        if (!('insert' in that.conf)) {
            ci.type = 'v-insert';
            ci.routeName = 'insert';
            ci.foormName = 'insert';
        }
        // se non e' presente view, modifico il clone di view perche' e' uguale a quello di edit
        if (!('view' in that.conf)) {
            cv.type = 'v-view';
            cv.routeName = 'view';
            cv.modelName = that.conf.modelName;
        }
        
        //console.debug('_cManage conf edit',ce,'insert',ci,'view',cv);
        that.conf.edit = wc.loadConf(ce);
        that.conf.insert = wc.loadConf(ci);
        that.conf.view = wc.loadConf(cv);
        

        //console.debug('_cManage conf edit',that.conf.edit,'insert',that.conf.insert,'view',that.conf.view);

        if (that.conf.search) {
            that.conf.search.autoload = false;
            that.conf.search.updateHash = that.conf.autoUpdateHash;
        }

        that.setManageActions();
        that.conf.mode = null;
        that.conf.viewDisplay = false;
        // if (!('insert' in that.conf)) {
        //     that.conf.insert = Object.assign({},CrudCore.clone(that.conf.edit));
        //     that.conf.insert.type = 'v-insert';
        //     that.conf.insert.routeName = 'insert';
        // }
        // if (!('view' in that.conf)) {
        //     that.conf.view = Object.assign({},CrudCore.clone(that.conf.view));
        //     that.conf.view.type = 'v-view';
        //     that.conf.view.routeName = 'view';
        //     that.conf.view.modelName = that.conf.modelName;
        //     //console.log('modelName',that.conf.modelName);
        // }
        if (!that.conf.baseRouteName) {  // indica il nome del path per la manage, di default e' manage ma in caso di oggetti estesi potrebbe essere diverso
            that.conf.baseRouteName = 'manage';
        }
        that.conf.custom = that.conf.custom || {};
        that.conf.custom.autoload = false;
        
        that.conf.editComponentName = that.conf.editComponentName || 'v-edit';
        that.conf.listComponentName = that.conf.listComponentName || 'v-list';
        that.conf.searchComponentName = that.conf.searchComponentName || 'v-search';
        that.conf.insertComponentName = that.conf.insertComponentName || 'v-insert';
        that.conf.viewComponentName = that.conf.viewComponentName || 'v-view';
        that.conf.customComponentName = that.conf.customComponentName || null;
        if (!('viewTitle' in that.conf)) {
            that.conf.viewTitle = null;
        }
        that.conf.listParams = null;  // parametri della lista nel caso di manage con autoUpdateHash a false;
        return that.conf;
    },
    methods : {
        searchList(event) {
            console.debug('searchList',this.autoUpdateHash,event,this.getViewList());
            if (this.getViewList()) {
                this.listParams = event;
                this.getViewList().setParams(event,false);
            }
        },
        setManageActions() {
            let that = this;
            if (!that.conf.list.actionsConfig) {
                that.conf.list.actionsConfig = {};
            }
            if (that.conf.list.actions.indexOf('action-view') >= 0) {
                let actionView = that.conf.list.actionsConfig['action-view'] || {};
                if (!actionView.execute){
                    actionView.execute = function () {
                        let thatAction = this;
                        thatAction.manageInstance.view.pk = thatAction.modelData[thatAction.manageInstance.primaryKey];
                        thatAction.manageInstance.viewDisplay = true;
                        thatAction.manageInstance.viewTitle = thatAction.manageInstance.viewTitle==null?thatAction.manageInstance.translate('app.dettagli',0,null,[thatAction.manageInstance.view.pk]):thatAction.manageInstance.viewTitle;
                    }
                }
                that.conf.list.actionsConfig['action-view'] = actionView;
            }
            if (that.conf.list.actions.indexOf('action-edit') >= 0) {
                let actionEdit = that.conf.list.actionsConfig['action-edit'] || {};
                if (!actionEdit.execute){
                    actionEdit.execute = function () {
                        let thatAction = this;
                        let pk = thatAction.modelData[thatAction.manageInstance.getViewList().primaryKey];
                        let confName = this.$route.params.cConf;
                        thatAction.manageInstance.updateHash(confName,'edit',[pk]);
                    }
                }
                that.conf.list.actionsConfig['action-edit'] = actionEdit;
            }
            if (that.conf.list.actions.indexOf('action-insert') >= 0) {
                let actionInsert = that.conf.list.actionsConfig['action-insert'] || {};
                if (!actionInsert.execute){
                    actionInsert.execute = function () {
                        let thatAction = this;
                        let confName = thatAction.$route.params.cConf;
                        thatAction.manageInstance.updateHash(confName,'insert');
                    }
                }
                that.conf.list.actionsConfig['action-insert'] = actionInsert;
            }
            // if (that.conf.edit && that.conf.edit.actions && that.conf.edit.actions.indexOf('action-back') >= 0) {
            //     let actionBack = that.conf.edit.actionsConfig['action-back'] || {};
            //     if (!actionBack.execute){
            //         actionBack.execute = function () {
            //             let thatAction = this;
            //             let confName = this.$route.params.cConf;
            //             thatAction.manageInstance.updateHash(confName,'list',[]);
            //         }
            //     }
            //     that.conf.edit.actionsConfig['action-back'] = actionBack;
            // }
        },
        /**
         * assegno a tutte le azioni il riferimento alla manage
         */
        setManageReference() {
            let manage = this;
            let viewConfs = ['list','edit','insert','view','custom'];
            for (let i in viewConfs) {
                let v = viewConfs[i];
                //console.debug('setto view ',v,manage.conf[v])
                if (manage.conf[v]) {
                    let actions = manage.conf[v].actions || [];
                    for (let action of actions) {
                        //console.debug('aggiungo manage alla action ',action)
                        let aC = manage.conf[v].actionsConfig || {};
                        if (aC[action]) {
                            aC[action].manageInstance = manage;

                        } else {
                            aC[action] = {
                                manageInstance : manage
                            }
                        }
                        manage.conf[v].actionsConfig = aC;
                    }

                    // for (let a in manage.conf[v].actionsConfig) {
                    //     //console.debug('setto manage a ',v,a, manage.conf[v].actionsConfig[a]);
                    //     manage.conf[v].actionsConfig[a].manageInstance = manage;
                    // }
                }
            }
        },
        showList() {
            let that = this;
            that.mode = 'list';
            if (that.autoUpdateHash) {
                //window.history.back();
                this.$router.back();
            } else {
                setTimeout(function () {
                    console.debug('showList',that.listParams)
                    if (that.listParams) {
                        if (that.getViewSearch()) {
                            that.getViewSearch().setSearchParamsValue(that.listParams);
                        }
                        that.getViewList().setParams(that.listParams);
                        //that.getViewList().reload();
                    }
                },100)

            }
        },
        /**
         * context e' un parametro che viene usato quando siamo in modalita' updateHash in questo caso infatti se abbiamo
         * bisogno di parametri che devono essere mantenuti anche da un reload.. vanno messi neli parametri della route.
         * @param conf
         * @param context
         */
        showCustom(context) {
            let that = this;
            //let cc = conf?Object.assign(that.custom,conf):that.custom;

            console.debug('showCustom',that.autoUpdateHash)
            that.mode = 'custom';
            that.custom.manageInstance = this;
            that.custom.context = context;
            if (that.autoUpdateHash) {
                that.updateHash('custom','custom',(context || []));
            }
        },

        getViewList() {
            console.debug('getViewList',this.$refs);
            return this.$refs.vList?this.$refs.vList:null;
        },
        getViewSearch() {
            return this.$refs.vSearch?this.$refs.vSearch.instance():null;
        },
        getViewRecord() {
            return this.$refs.vRecord?this.$refs.vRecord.instance():null;
        },
        /**
         * gestione del back mostra la vista giusta in baso allo stato della cmanage
         */
        showContext() {
          let that = this;
          console.debug('AAA showContext params',that.$route.params);
          if (that.$route.params.viewType) {
            let context = that.$route.params.context || [];
            that.mode = that.$route.params.viewType;
            console.debug('mode',that.mode,context)
              switch (that.mode) {
                  case 'edit':
                      that.edit.type = 'v-edit';
                      that.edit.pk = context[0];
                      break;
                  case 'insert':
                        that.insert.type = 'v-insert';
                      break;
                  case 'list':
                      break;
                  case 'custom':
                      that.custom.context = context;
              }
          } else {
              that.mode = 'list';
          }

          return ;
        },
        loadContext() {
            console.debug('AAA loadContext params');
            let that = this;
            switch (that.mode) {
                case 'edit':
                case 'insert':
                case 'custom':
                    that.$refs.vRecord.load();
                    break;
                case 'list':
                    that.$refs.vSearch.load();
                    that.$refs.vList.load();
                    break;
            }
        },
        waitViewLoaded(type,callback) {
            let that = this;
            if (type ==  'list') {
                let vList = this.getViewList();
                if (!vList || !vList.loaded) {
                    setTimeout(function() {
                        that.waitViewLoaded(type,callback);
                    },20)
                } else {
                    return callback();
                }
            } else if (type == 'search') {
                let vSearch = this.getViewSearch();
                if (!vSearch || !vSearch.loaded) {
                    setTimeout(function() {
                        that.waitViewLoaded(type,callback);
                    },20)
                } else {
                    return callback();
                }
            } else {
                console.warn('wait ' + type + ' non gestito');
            }
        },
        updateHash(confName,type,context) {
            let that = this;
            console.debug('confName',confName,'type',type,'context',context);
            if (this.autoUpdateHash) {
                let params = that.$route.params;
                params.viewType = type;
                params.context = context;
                that.$router.push({name:'c-manage-view',params : params})
            } else {
                that.mode = type;
                switch (that.mode) {
                  case 'edit':
                      that.edit.type = 'v-edit';
                      that.edit.pk = context[0];
                      break;
                  case 'insert':
                        that.insert.type = 'v-insert';
                      break;
                  case 'list':
                      break;
                  case 'custom':
                      that.custom.context = context;
              }
            }
        },
        _setCss() {

        }
    }
}

</script>

<style lang="scss" scoped>
.managePanel {
    :deep(.p-panel-header) {

        background-color: var(--primary-color);


        .p-panel-title {
            color: var(--primary-color-text);
        }

        h5.p-panel-title {
            margin-bottom: .5rem;
        }
    }

    :deep(.p-panel-content) {
        border-color: var(--primary-color);
    }

    :deep(.p-panel-header) {
        border-color: var(--primary-color);
    }
}

.listDivider.p-divider-horizontal:before {
    border-color: var(--primary-700);
}
</style>
