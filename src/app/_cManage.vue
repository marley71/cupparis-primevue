<script>

import CrudComponent from "../CrudComponent.vue";
import viewWrapperConf from '../views/WrapperConf'
import CrudCore from "../lib/CrudCore";
import manageConf from "../confs/manage";
import {libStatus} from '../store/libStatus';

export default {
  name: "_cManage",
  extends: CrudComponent,
  mounted() {
    let that = this;
    that._ready();
    this.setManageReference();
    that.showContext(true);
    const pinia = this.$pinia;
    const libStatusStore = pinia ? libStatus(pinia) : libStatus();
    if (libStatusStore.aiSearchActive[this.modelName]) {
      this.conf.search.type = 'v-search-ai';
      this.conf.searchComponentName = 'v-search-ai';
    } else {
      this.conf.search.type = 'v-search';
      this.conf.searchComponentName = 'v-search';
    }
  },
  data() {
    let that = this;
    let conf = Object.assign(CrudCore.clone(manageConf),that.conf);
    for (let key in conf) {
      that.conf[key] = conf[key];
    }
    that.conf.listParams = null;  // parametri della lista nel caso di manage con autoUpdateHash a false;
    // usato per evitare di eseguire piu' volte showContext sullo stesso hash
    that.conf._lastContextKey = null;
    that.conf.mode = null;
    that.conf.viewDisplay = false;

    let wc = new viewWrapperConf();

    let cl = CrudCore.clone((that.conf.list || {type: 'v-list'}));
    if (that.conf.inlineEdit) {
      that.conf.listComponentName = 'v-list-edit';
      cl = CrudCore.clone((that.conf.listEdit || {type: 'v-list-edit'}));
    }
    cl.updateHash = that.conf.autoUpdateHash;

    

    let ce = CrudCore.clone((that.conf.edit || {type: 'v-edit'}));
    let ci = CrudCore.clone((that.conf.insert || that.conf.edit || {type: 'v-insert'}));
    ci.updateHash = that.conf.autoUpdateHash;

    let cv = CrudCore.clone((that.conf.view || that.conf.edit || {type: 'v-view'}));
    cv.updateHash = that.conf.autoUpdateHash;

    // se non e' presente insert, modifico il clone di insert perche' e' uguale a quello di edit
    ci.type = 'v-insert';
    ci.routeName = ci.routeName || 'insert';
    ci.foormName = ci.foormName || 'insert';
    
    // se non e' presente view, modifico il clone di view perche' e' uguale a quello di edit
    cv.type = 'v-view';
    cv.routeName = cv.routeName || 'view';
    cv.modelName = cv.modelName || that.conf.modelName;
    
    if (that.conf.constraintKey) {
      ce.routeName = 'edit-constraint';
      ci.routeName = 'insert-constraint';
      cv.routeName = 'view-constraint';
      cl.routeName = 'list-constraint';
      ce.constraintKey = that.conf.constraintKey;
      ce.constraintValue = that.conf.constraintValue;
      ci.constraintKey = that.conf.constraintKey;
      ci.constraintValue = that.conf.constraintValue;
      cv.constraintKey = that.conf.constraintKey;
      cv.constraintValue = that.conf.constraintValue;
      cl.constraintKey = that.conf.constraintKey;
      cl.constraintValue = that.conf.constraintValue;
    }

    //console.debug('_cManage conf edit',ce,'insert',ci,'view',cv);
    that.conf.edit = wc.loadConf(ce);
    that.conf.insert = wc.loadConf(ci);
    that.conf.view = wc.loadConf(cv);
    that.conf.list = wc.loadConf(cl);

    //console.debug('_cManage conf edit',that.conf.edit,'insert',that.conf.insert,'view',that.conf.view);

    if (that.conf.search) {
      //that.conf.search.autoload = false;
      that.conf.search.updateHash = that.conf.autoUpdateHash;
      if (that.conf.constraintKey) {
        that.conf.search.routeName = 'search-constraint';
        that.conf.search.constraintKey = that.conf.constraintKey;
        that.conf.search.constraintValue = that.conf.constraintValue;
      }
    }

    that.setManageActions();

    return that.conf;

  },
  watch: {
    /**
     * quando viene aggiornato l'hash (autoUpdateHash=true) sincronizzo il contesto
     */
    $route() {
      if (this.autoUpdateHash) {
        this.showContext();
      }
    }
  },
  methods: {
    _ready() {
      if (this.conf.ready) {
        this.conf.ready.apply();
      }
    },
    searchList(event) {
      console.debug('searchList', this.autoUpdateHash, event, this.getViewList());
      if (this.getViewList()) {
        this.listParams = event;
        this.getViewList().setParams(event, true);
      }
    },
    onListRouteChange() {
      let that = this;
      that.conf.listParams = that.getViewList().getParams();

      // console.debug('onRouteChange',this.autoUpdateHash);
      // if (this.autoUpdateHash) {
      //     this.updateHash('list','list',[]);
      // }
    },
    setManageActions() {
      let that = this;
      if (!that.conf.list.actionsConfig) {
        that.conf.list.actionsConfig = {};
      }
      if (that.conf.list.actions.indexOf('action-view') >= 0) {
        let actionView = that.conf.list.actionsConfig['action-view'] || {};
        if (!actionView.execute) {
          actionView.execute = function () {
            let thatAction = this;
            let pk = thatAction.modelData[thatAction.manageInstance.getViewList().primaryKey];
            thatAction.manageInstance.showView(pk);
            //thatAction.manageInstance.view.pk = thatAction.modelData[thatAction.manageInstance.primaryKey];
            //thatAction.manageInstance.viewDisplay = true;
            //thatAction.manageInstance.viewTitle = thatAction.manageInstance.viewTitle==null?thatAction.manageInstance.translate('app.dettagli',0,null,[thatAction.manageInstance.view.pk]):thatAction.manageInstance.viewTitle;
          }
        }
        that.conf.list.actionsConfig['action-view'] = actionView;
      }
      if (that.conf.list.actions.indexOf('action-edit') >= 0) {
        let actionEdit = that.conf.list.actionsConfig['action-edit'] || {};
        if (!actionEdit.execute) {
          actionEdit.execute = function () {
            let thatAction = this;
            //thatAction.manageInstance.edit.pk = thatAction.modelData[thatAction.manageInstance.getViewList().primaryKey];
            let pk = thatAction.modelData[thatAction.manageInstance.getViewList().primaryKey];
            thatAction.manageInstance.showEdit(pk);
          }
        }
        that.conf.list.actionsConfig['action-edit'] = actionEdit;
      }
      if (that.conf.list.actions.indexOf('action-insert') >= 0) {
        let actionInsert = that.conf.list.actionsConfig['action-insert'] || {};
        if (!actionInsert.execute) {
          actionInsert.execute = function () {
            let thatAction = this;
            thatAction.manageInstance.showInsert();
          }
        }
        that.conf.list.actionsConfig['action-insert'] = actionInsert;
      }
      if (that.conf.list.actions.indexOf('action-back') >= 0) {
        let actionBack = that.conf.list.actionsConfig['action-back'] || {};
        if (!actionInsert.execute) {
          actionBack.execute = function () {
            let thatAction = this;
            thatAction.manageInstance.showList();
          }
        }
        that.conf.list.actionsConfig['action-back'] = actionBack;
      }
      if (that.conf.list.actions.indexOf('action-save-back') >= 0) {
        let actionSaveBack = that.conf.list.actionsConfig['action-save-back'] || {};
        if (!actionInsert.execute) {
          actionSaveBack.execute = function () {
            let thatAction = this;
            thatAction.manageInstance.showList();
          }
        }
        that.conf.list.actionsConfig['action-save-back'] = actionSaveBack;
      }
      if (that.conf.switchSearchAi) {
        that.conf.search.actions = that.conf.search.actions || [];
        that.conf.search.actions.push('action-switch-search-ai');
        
      }
    },
    /**
     * assegno a tutte le azioni il riferimento alla manage
     */
    setManageReference() {
      let manage = this;
      let viewConfs = ['list', 'edit', 'insert', 'view', 'custom','search'];
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
                manageInstance: manage
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

      if (that.autoUpdateHash) {
        //window.history.back();
        this.$router.back();
      } else {
        that.list.manageInstance = that;
        that.search.manageInstance = that;
        if (that.listParams) {
          if (that.list) {
            that.list.addDefaultParams = function () {
              let tL = this;
              if (tL) {
                tL.setParams(that.listParams);
              }
            }
          }
          if (that.search) {
            that.search.addDefaultParams = function () {
              let tL = this;
              if (tL) {
                tL.setSearchParamsValue(that.listParams);
              }
            }
          }
        }
        that.mode = 'list';
      }
    },
    showEdit(pk) {
      let that = this;
      if (that.autoUpdateHash) {
        that.edit.pk = pk;
        that.updateHash('edit', 'edit', [pk]);
      } else {
        that.edit.manageInstance = that;
        that.mode = 'edit';
        that.edit.pk = pk;
      }
    },
    showInsert() {
      let that = this;
      if (that.autoUpdateHash) {
        that.updateHash('insert', 'insert', []);
      } else {
        that.mode = 'insert';
        that.insert.manageInstance = that;
        //that.insert.pk = that.insert.pk;
      }
    },
    showView(pk) {
      let that = this;
      console.debug('showView ', pk,that.viewInModal,that.autoUpdateHash);
      if (that.autoUpdateHash) {
        if (that.viewInModal) {
          that.mode = 'view';
          that.view.manageInstance = that;
          that.view.pk = pk;
          that.viewDisplay = true;
          that.viewTitle = that.viewTitle == null ? that.translate('app.dettagli', 0, null, [pk]) : that.viewTitle;
        } else {
          that.view.pk = pk;
          that.updateHash('view', 'view', [pk]);
        }
      } else {
        that.mode = 'view';
        that.view.manageInstance = that;
        console.debug('showView', pk);
        that.view.pk = pk;
        if (that.viewInModal) {
          that.viewDisplay = true;
          that.viewTitle = that.viewTitle == null ? that.translate('app.dettagli', 0, null, [pk]) : that.viewTitle;
        }
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
      console.debug('showCustom', that.autoUpdateHash)
      if (that.autoUpdateHash) {
        that.updateHash('custom', 'custom', (context || []));
      } else {
        that.custom.manageInstance = this;
        that.custom.context = context;
        that.mode = 'custom';
      }
    },

    getViewList() {
      console.debug('getViewList', this.$refs);
      return this.$refs.vList ? this.$refs.vList : null;
    },
    getViewSearch() {
      return this.$refs.vSearch ? this.$refs.vSearch.instance() : null;
    },
    getViewRecord() {
      return this.$refs.vRecord ? this.$refs.vRecord.instance() : null;
    },

    /**
     * gestione del back mostra la vista giusta in baso allo stato della cmanage
     */
    showContext(force = false) {
      let that = this;
      // normalizzo i parametri della route in modo da avere una chiave univoca
      const viewType = that.autoUpdateHash ? (that.$route.params.viewType || 'list') : 'list';
      const rawContext = that.$route.params.context;
      const context = Array.isArray(rawContext) ? rawContext : (rawContext ? [rawContext] : []);
      const contextKey = viewType + '|' + JSON.stringify(context);

      // se il contesto non e' cambiato evito di eseguire due volte la stessa logica
      if (!force && that._lastContextKey === contextKey) {
        return;
      }
      that._lastContextKey = contextKey;

      if (that.autoUpdateHash) {
        that.mode = viewType;
        console.debug('mode', that.mode, context)
        switch (that.mode) {
          case 'edit':
            that.edit.type = 'v-edit';
            that.edit.pk = context[0];
            that.edit.manageInstance = that;
            break;
          case 'view':
            that.view.type = 'v-view';
            that.view.pk = context[0];
            that.view.manageInstance = that;
            break;
          case 'insert':
            that.insert.type = 'v-insert';
            that.insert.manageInstance = that;
            break;
          case 'list':
            that.list.manageInstance = that;
            // setTimeout(function () {
            //     console.debug('showList',that.listParams)
            //     if (that.listParams) {
            //         if (that.getViewSearch()) {
            //             that.getViewSearch().setSearchParamsValue(that.listParams);
            //         }
            //         that.getViewList().setParams(that.listParams);
            //     }
            //     that.getViewSearch().reload();
            //     that.getViewList().reload();
            // },100)
            break;
          case 'custom':
            that.custom.manageInstance = that;
            that.custom.context = context;
        }
      } else {
        that.mode = 'list';
      }
    },

    waitViewLoaded(type, callback) {
      let that = this;
      if (type == 'list') {
        let vList = this.getViewList();
        if (!vList || !vList.loaded) {
          setTimeout(function () {
            that.waitViewLoaded(type, callback);
          }, 20)
        } else {
          return callback();
        }
      } else if (type == 'search') {
        let vSearch = this.getViewSearch();
        if (!vSearch || !vSearch.loaded) {
          setTimeout(function () {
            that.waitViewLoaded(type, callback);
          }, 20)
        } else {
          return callback();
        }
      } else {
        console.warn('wait ' + type + ' non gestito');
      }
    },
    updateHash(confName, type, context) {
      let that = this;
      console.debug('confName', confName, 'type', type, 'context', context);
      if (this.autoUpdateHash) {
        let params = that.$route.params;
        params.viewType = type;
        params.context = context;
        // if (that[confName]) {
        //     that[confName].context = context;
        // }
        that.$router.push({name: 'c-manage-view', params: params})
      }
    },
    switchSearch() {
      console.debug('switchSearchAi', this.search.type,this.autoUpdateHash);
      this.search.type = this.search.type == 'v-search' ? 'v-search-ai' : 'v-search';
      this.searchComponentName = this.search.type == 'v-search' ? 'v-search' : 'v-search-ai';
      const pinia = this.$pinia;
      const libStatusStore = pinia ? libStatus(pinia) : libStatus();
      libStatusStore.aiSearchActive[this.modelName] = this.search.type == 'v-search' ? 0 : 1;
      if (this.autoUpdateHash) {
        //this.updateHash('list', 'list', []);
        this.$router.push({name: 'c-manage', params: {}})
      } else {
        this.getViewList()?.setParams([]);
        this.getViewList()?.reload();
        this.getViewSearch()?.setSearchParamsValue([]);
        //this.getViewSearch()?.reload();
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
