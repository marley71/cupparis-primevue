
<script>

import CrudComponent from "../CrudComponent.vue";
import viewWrapperConf from '../views/WrapperConf'
import CrudCore from "../lib/CrudCore";

export default {
    name: "_cManage",
    extends : CrudComponent,
    watch : {
        '$route.params.context': {
            handler: function(context) {
                console.debug('showContext ',context);
                this.showContext();
            },
            deep: true,
        }
    },
    mounted() {
        let that = this;
        this.showContext();
        this.setManageReference();
        setTimeout(function () {
            that._setCss();
        },100)

    },
    data() {
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
        console.log('wc',wc);
        that.conf.list = wc.loadConf(that.conf.list);
        that.conf.edit = that.conf.edit?wc.loadConf(that.conf.edit):{};
        if (that.conf.search) {
            that.conf.search.updateHash = that.conf.autoUpdateHash;
        }

        that.setManageActions();
        that.conf.mode = null;
        that.conf.viewDisplay = false;
        if (!('insert' in that.conf)) {
            that.conf.insert = Object.assign({},CrudCore.clone(that.conf.edit));
            that.conf.insert.type = 'v-insert';
            that.conf.insert.routeName = 'insert';
        }
        if (!('view' in that.conf)) {
            that.conf.view = Object.assign({},CrudCore.clone(that.conf.view));
            that.conf.view.type = 'v-view';
            that.conf.view.routeName = 'view';
            that.conf.view.modelName = that.conf.modelName;
            console.log('modelName',that.conf.modelName);
        }
        if (!that.conf.baseRouteName) {  // indica il nome del path per la manage, di default e' manage ma in caso di oggetti estesi potrebbe essere diverso
            that.conf.baseRouteName = 'manage';
        }
        that.conf.custom = that.conf.custom || {};

        that.conf.editComponentName = that.conf.editComponentName || 'v-edit';
        that.conf.listComponentName = that.conf.listComponentName || 'v-list';
        that.conf.searchComponentName = that.conf.searchComponentName || 'v-search';
        that.conf.insertComponentName = that.conf.insertComponentName || 'v-insert';
        that.conf.viewComponentName = that.conf.viewComponentName || 'v-view';
        that.conf.customComponentName = that.conf.customComponentName || null;
        if (!('viewTitle' in that.conf)) {
            that.conf.viewTitle = null;
        }
        return that.conf;
    },
    methods : {
        searchList(event) {
            console.debug('searchList',this.autoUpdateHash,event,this.getViewList());
            if (this.getViewList()) {
                this.getViewList().setParams(event);
                this.getViewList().load();
            }
        },
        setManageActions() {
            let that = this;
            let manage = this;
            if (!that.conf.list.actionsConfig) {
                that.conf.list.actionsConfig = {};
            }
            if (that.conf.list.actions.indexOf('action-view') >= 0) {
                let actionView = that.conf.list.actionsConfig['action-view'] || {};
                if (!actionView.execute){
                    actionView.execute = function () {
                        let thatAction = this;
                        that.view.pk = thatAction.modelData[that.$refs.vList.instance().primaryKey];
                        that.viewDisplay = true;
                        that.viewTitle = that.viewTitle==null?that.translate('app.dettagli',0,null,[that.view.pk]):that.viewTitle;
                    }
                }
                that.conf.list.actionsConfig['action-view'] = actionView;
            }
            if (that.conf.list.actions.indexOf('action-edit') >= 0) {
                let actionEdit = that.conf.list.actionsConfig['action-edit'] || {};
                if (!actionEdit.execute){
                    actionEdit.execute = function () {
                        let thatAction = this;
                        that.edit.pk = thatAction.modelData[manage.getViewList().primaryKey];
                        that.mode = 'edit';
                        let confName = this.$route.params.cConf;
                        that.updateHash(confName,'edit',[that.edit.pk]);
                        //window.history.pushState({},'',window.location.pathname + '#/' + manage.baseRouteName + '/'+ confName +'/edit/' + that.edit.pk);
                    }
                }
                that.conf.list.actionsConfig['action-edit'] = actionEdit;
            }
            if (that.conf.list.actions.indexOf('action-insert') >= 0) {
                let actionInsert = that.conf.list.actionsConfig['action-insert'] || {};
                if (!actionInsert.execute){
                    actionInsert.execute = function () {
                        that.mode = 'insert';
                        let confName = this.$route.params.cConf;
                        that.updateHash(confName,'insert');
                        //window.history.pushState({},'',window.location.pathname + '#/' + manage.baseRouteName + '/'+ confName +'/insert');
                    }
                }
                that.conf.list.actionsConfig['action-insert'] = actionInsert;
            }
            if (that.conf.edit && that.conf.edit.actions && that.conf.edit.actions.indexOf('action-back') >= 0) {
                let actionBack = that.conf.edit.actionsConfig['action-back'] || {};
                if (!actionBack.execute){
                    actionBack.execute = function () {
                        that.mode = 'list';
                        if (that.autoUpdateHash) {
                            window.history.back();
                        } else {
                            that.getViewList().reload();
                        }


                    }
                }
                that.conf.edit.actionsConfig['action-back'] = actionBack;
            }



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
                    for (let a in manage.conf[v].actionsConfig) {
                        //console.debug('setto manage a ',v,a, manage.conf[v].actionsConfig[a]);
                        manage.conf[v].actionsConfig[a].manage = manage;
                    }
                }
            }
        },
        showList() {
            let that = this;
            that.mode = 'list';
            //console.debug('showContext showList')
            if (that.autoUpdateHash) {
                window.history.back();
            } else {
                that.getViewList().reload();
            }
        },

        getViewList() {
            return this.$refs.vList?this.$refs.vList.instance():null;
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
          console.debug('showContext params',that.$route.params);

          if (that.$route.params.viewType) {
            let context = that.$route.params.context || [];
            that.mode = that.$route.params.viewType;
            console.debug('mode',that.mode,context)
            switch(that.mode) {
              case 'edit':
                that.edit.pk = context[0];
                break;
              case 'insert':
                break;
              case 'list':
                break;
            }
          } else {
              that.mode = 'list';
          }

          return ;

          //   console.debug('showContext',that.$route.params.context)
          // alert('aa');
          //   let context = that.$route.params.context;
          //   if (!context || context.length == 0) {
          //       if (that.getViewList()) {
          //           that.mode = 'list';
          //           that.searchList();
          //       }
          //
          //       return ;
          //   }
          //   let mode = context[0];
          //   that.mode = mode;
          //   switch(mode) {
          //       case 'edit':
          //           that.edit.pk = context[1];
          //           break;
          //       case 'insert':
          //           break;
          //       case 'list':
          //           break;
          //   }
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
        // showListMia() {
        //     let that = this;
        //     let confName = this.$route.params.cConf;
        //     let params = that.getViewList().route.getParams();
        //     let context = [];
        //     if (params && params instanceof FormData) {
        //         for (let key of params.keys()) {
        //             let values = params.getAll(key);
        //             context.push(key+':'+values.join('&'));
        //         }
        //     } else if (params  && params instanceof Object) {
        //         for (let key in params) {
        //             let values = params[key];
        //             if (Array.isArray(values)) {
        //                 context.push(key+':'+values.join('&'));
        //             } else {
        //                 context.push(key+':'+values);
        //             }
        //
        //         }
        //     }
        // },




        updateHash(confName,type,context) {



            let that = this;
            //let hash = '';
            if (this.autoUpdateHash) {
                let params = that.$route.params;
                params.viewType = type;
                params.context = context;
                that.$router.push({name:'c-manage-view',params : params})






                //
                // hash = '/' + that.baseRouteName + '/'+ confName +'/' + type;
                // if (context && context.length > 0) {
                //     hash += '/' + context.join('/');
                // }
                // that.$router.replace(hash);
                //window.history.pushState({},'',hash);
            }
        },
        _setCss() {
            console.debug('manage csss',this.$refs.manage.$el.offsetHeight, 'px')
            //this.$refs.manage.$el.style.minHeight = '200px';// this.$refs.manage.offsetHeight + 'px';
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
