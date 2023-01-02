<template>
    <div>
        <div>
            <h5 v-if="title">{{title}}</h5>
            <h5 v-else>{{translate('app.gestione')}} {{ translate(modelName + '.label', null,1) }}</h5>
        </div>
        <div v-if="sectionTitle" class="p-card-subtitle" >
            {{sectionTitle}}
        </div>
        <div >
            <div v-if="mode=='list'">
                <c-view :conf="search" ref="vSearch" @search="searchList"></c-view>
                <hr>
                <c-view :conf="list" ref="vList"></c-view>
            </div>
            <c-view v-else-if="mode=='edit'" :conf="edit"></c-view>
            <c-view v-else-if="mode=='insert'" :conf="insert"></c-view>
        </div>
        <Dialog class="p-dialog" v-model:visible="viewDisplay" :modal="true" :style="{width: '50vw'}">
            <template #header>
                <h3>{{ translate(viewTitle) }}</h3>
            </template>
            <c-view v-if="viewDisplay" :conf="view" ref="vView"></c-view>
            <div class="modal-footer">
                <Button :label="translate('app.ok')" icon="pi pi-check" autofocus />
            </div>
        </Dialog>
    </div>
</template>

<script>
import cView from "../views/cView.vue";
import CrudComponent from "../CrudComponent.vue";
import viewWrapperConf from '../views/WrapperConf'
export default {
    name: "Manage",
    extends : CrudComponent,
    components: {cView},
    props : ['conf'],
    mounted() {
        window.MM = this;
        // let that = this;
        // setTimeout(function () {
        //     that.$refs.vSearch.targetRef = that.$refs.vList;
        //     console.log('manage2',that.$refs.vSearch);
        // },200)

    },
    data() {
        let that = this;
        console.log('cManage',that.conf);
        if (!('title' in that.conf)) {
            that.conf.title = null;
        }
        if (!('sectionTitle' in that.conf)) {
            that.conf.sectionTitle = null;
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
            that.conf.insert = Object.assign({},that.conf.edit);
            that.conf.insert.type = 'v-insert';
            that.conf.insert.routeName = 'insert';
        }
        //that.conf.search.targetRef = that.$refs.vList;
        //console.log('Manage',that.$refs,that.conf);
        //that.conf.ready = false;
        return that.conf;
    },
    methods : {
        searchList(event) {
            console.log('searchList',event);
            this.$refs.vList.instance().setParams(event);
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
                        that.edit.pk = thatAction.modelData[that.$refs.vList.instance().primaryKey];
                        that.mode = 'edit';
                    }
                }
                that.conf.list.actionsConfig['action-edit'] = actionEdit;
            }
            if (that.conf.list.actions.indexOf('action-insert') >= 0) {
                let actionInsert = that.conf.list.actionsConfig['action-insert'] || {};
                if (!actionInsert.execute){
                    actionInsert.execute = function () {
                        //let thatAction = this;
                        //that.edit.pk = thatAction.modelData[that.$refs.vList.instance().primaryKey];
                        that.mode = 'insert';
                    }
                }
                that.conf.list.actionsConfig['action-insert'] = actionInsert;
            }
            if (that.conf.edit.actions.indexOf('action-back') >= 0) {
                let actionBack = that.conf.edit.actionsConfig['action-back'] || {};
                if (!actionBack.execute){
                    actionBack.execute = function () {
                        that.mode = 'list';
                    }
                }
                that.conf.edit.actionsConfig['action-back'] = actionBack;
            }
        }
    }
}
</script>

<style scoped>

</style>
