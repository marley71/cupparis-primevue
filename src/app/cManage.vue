<template>
    <Panel class="managePanel">
        <template #header>
            <h5 class="p-panel-title">
                <span v-if="title" >
                    {{title}}
                </span>
                <span v-else>
                    {{translate('app.gestione')}} {{ translate(modelName + '.label', null,1) }}
                </span>
            </h5>
        </template>
        <div v-if="sectionTitle" class="p-card-subtitle" >
            {{sectionTitle}}
        </div>
        <div >
            <div v-show="mode=='list'">
                <template v-if="!hideSearch">
                    <c-view v-if="!searchComponentName" :conf="search" ref="vSearch" @search="searchList"></c-view>
                    <component v-else :is="searchComponentName" :conf="search" ref="vSearch" @search="searchList"></component>
                </template>
                
<!--                <Divider align="center" class="listDivider mt-5">-->
<!--                    <span class="p-tag bg-primary-700 text-white">-->
<!--                                    Elenco elementi-->
<!--                    </span>-->
<!--                </Divider>-->

                <c-view v-if="!listComponentName"  :conf="list" ref="vList"></c-view>
                <component v-else :is="listComponentName" :conf="list" ref="vList"></component>
            </div>
            <template v-if="mode=='edit'">
                <c-view v-if="!editComponentName"  :conf="edit"></c-view>
                <component v-else :is="editComponentName" :conf="edit"></component>
            </template>
            <template v-else-if="mode=='insert'">
                <c-view v-if="!insertComponentName"  :conf="insert"></c-view>
                <component v-else :is="insertComponentName" :conf="insert"></component>
            </template>
        </div>
        <Dialog class="p-dialog" v-model:visible="viewDisplay" :modal="true" :style="{width: '50vw'}">
            <template #header>
                <h3>{{ translate(viewTitle) }}</h3>
            </template>
            
            <template v-if="viewDisplay">
                <c-view v-if="!viewComponentName" :conf="view" ref="vView"></c-view>
                <component v-else :is="viewComponentName" :conf="view"></component>
            </template>
            <div class="modal-footer">
                <Button :label="translate('app.ok')" icon="pi pi-check" autofocus @click="viewDisplay=false"/>
            </div>
        </Dialog>
    </Panel>
</template>

<script>
import cView from "../views/cView.vue";
import CrudComponent from "../CrudComponent.vue";
import viewWrapperConf from '../views/WrapperConf'
import CrudCore from "../lib/CrudCore";
//import Dialog from "primevue/dialog";

export default {
    name: "Manage",
    extends : CrudComponent,
    components: {cView},
    props : ['conf'],
    watch : {
        // '$route' (to, from) {
        //     console.log('TOOOOO',to,from);
        // },
        '$route.params.context': {
            handler: function(context) {
                console.log('context watch');
                if (this.getViewList()) {
                    this.showContext();
                }
                
            },
            deep: true,
            //immediate: true
        }
    },
    mounted() {
        window.MM = this;
        console.log('context mounted');
        //console.debug('manage',this.$route.params)
        this.showContext();
        // let that = this;
        // setTimeout(function () {
        //     that.$refs.vSearch.targetRef = that.$refs.vList;
        //     console.log('manage2',that.$refs.vSearch);
        // },200)

    },
    data() {
        let that = this;
        if (!('title' in that.conf)) {
            that.conf.title = null;
        }
        if (!('sectionTitle' in that.conf)) {
            that.conf.sectionTitle = null;
        }
        if (!('hideSearch' in that.conf)) {
            that.hideSearch = false;
        }
        let wc = new viewWrapperConf();
        console.log('wc',wc);
        //that.conf.list = that.conf.list?wc.loadConf(that.conf.list):{};
        // that.conf.view = that.conf.view?wc.loadConf(that.conf.view):{};
        that.conf.edit = that.conf.edit?wc.loadConf(that.conf.edit):{};
        // that.conf.insert = that.conf.insert?wc.loadConf(that.conf.insert):null;

        this.setManageActions();
        that.conf.mode = 'list';
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
        that.conf.editComponentName = that.conf.editComponentName || null;
        that.conf.listComponentName = that.conf.listComponentName || null;
        that.conf.searchComponentName = that.conf.searchComponentName || null;
        that.conf.insertComponentName = that.conf.insertComponentName || null;
        that.conf.viewComponentName = that.conf.viewComponentName || null;

        return that.conf;
    },
    methods : {
        searchList(event) {
            console.log('searchList',event);
            let confName = this.$route.params.cConf;
            let context = [];
            if (event && event instanceof FormData) {
                for (var key of event.keys()) {
                    var values = event.getAll(key);
                    context.push(key+':'+values.join('&'));
                }
                window.history.pushState({},'','/#/manage/'+ confName +'/list/' + context.join('/'));
            }
            this.$refs.vList.instance().setParams(event);
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
                        window.history.pushState({},'','/#/manage/'+ confName +'/edit/' + that.edit.pk);
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
                        window.history.pushState({},'','/#/manage/'+ confName +'/insert');
                    }
                }
                that.conf.list.actionsConfig['action-insert'] = actionInsert;
            }
            if (that.conf.edit && that.conf.edit.actions && that.conf.edit.actions.indexOf('action-back') >= 0) {
                let actionBack = that.conf.edit.actionsConfig['action-back'] || {};
                if (!actionBack.execute){
                    actionBack.execute = function () {
                        that.mode = 'list';
                        window.history.back();
                        that.getViewList().reload();
                    }
                }
                that.conf.edit.actionsConfig['action-back'] = actionBack;
            }
        },
        getViewList() {
            //console.log('Manage refs',this.$refs);
            return this.$refs.vList?this.$refs.vList.instance():null;
        },
        /**
         * gestione del back mostra la vista giusta in baso allo stato della cmanage
         */
        showContext() {
            let that = this;
            console.log('showContext',that.$route.params.context)
            let context = that.$route.params.context;
            if (!context || context.length == 0) {
                if (that.getViewList()) {
                    that.mode = 'list';
                    that.searchList();
                }
                
                return ;
            }
            let mode = context[0];
            that.mode = mode;
            switch(mode) {
                case 'edit':
                    that.edit.pk = context[1];
                    break;
                case 'insert':
                    break;
            }
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
