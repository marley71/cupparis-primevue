<template>
    <div ref="el">
        <div class="alert alert-info" role="alert">
            <h4 class="alert-heading">Importazione Dati</h4>
            <!--      <p>Importazione modello <strong>{{ translate(providerName) }}</strong> da file-->
            <!--        {{(confUpload.extensions || []).join(',')}}</p>-->
            <!--      <hr>-->
            <div class="mb-0">
                <p>L'importazione avverrà in due fasi:</p>
                <ul>
                    <li>la lettura del file e check degli errori</li>
                    <li>salvataggio del file importato</li>
                </ul>

            </div>
        </div>
        <div v-if="step == 'upload'" class="panel panel-default">
            <h5>Seleziona file da importare</h5>
            <!--            <w-upload-ajax :c-conf="confUpload" v-on:success="uploadsuccess"></w-upload-ajax>-->
            <div class="col-12">
<!--                <v-edit :c-conf="_uploadConf()" ref="viewUpload"></v-edit>-->
                <c-view :conf="_uploadConf()" ref="viewUpload"></c-view>
            </div>

        </div>
        <div v-if="['saving','loading'].indexOf(step) >= 0">
            <ProgressBar mode="indeterminate">
                <div v-if="step==='loading'">
                    Lettura file e check degli errori ...&nbsp;
                </div>
                <div v-if="step==='saving'">
                    Salvataggio del file importato ...
                </div>
            </ProgressBar>
            <!--      <div class="progress h&#45;&#45;40 mb-3">-->
            <!--        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"-->
            <!--             :style="'width:100%'" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">-->
            <!--          <div v-if="importStatus==='loading'">-->
            <!--            Lettura file e check degli errori ...&nbsp;-->
            <!--          </div>-->
            <!--          <div v-if="importStatus==='saving'">-->
            <!--            Salvataggio del file importato ...-->
            <!--          </div>-->
            <!--        </div>-->
            <!--      </div>-->
            <!--            <div class="shadow w-full bg-grey-light">-->
            <!--                <div class="bg-blue-500 text-xs leading-none py-1 text-center text-white" :style="'width:'+progressValue+'%'">{{progressValue}}%</div>-->
            <!--            </div>-->
            <!--            -->
            <!--            <div class="progress">-->
            <!--                <div class="progress-bar progress-bar-striped" :style="'width:'+progressValue+'%'"></div>-->
            <!--            </div>-->
        </div>
        <div v-if="step=='tosave'">
            <div>File caricato e controllato</div>
            <v-record :conf="_saveConf()"></v-record>
            <v-list :conf="_listConf()">
<!--                <template #header="slotProps">-->
<!--                    <div class="grid">-->
<!--                        <div v-if="slotProps.paginator" class="col-6">-->
<!--                            <c-paginator v-if="slotProps.widgets.length > 0" v-show="slotProps.pagination" :c-conf="slotProps.pagination"></c-paginator>-->
<!--                        </div>-->
<!--                        <div class="col-3 p-buttonset p-3" v-show="slotProps.collectionActionsName.length">-->
<!--                            <v-action v-for="name in slotProps.collectionActionsName" :key="name" :c-action="slotProps.collectionActions[name]" :ref="slotProps.collectionActions[name].cRef"></v-action>-->
<!--                        </div>-->
<!--                        <div class="col-3" v-show="multiSheets">-->
<!--                            <span>Mostra sheet:</span>-->
<!--                            <w-select :c-conf="selectSheetConf"></w-select>-->
<!--                        </div>-->
<!--                    </div>-->

<!--                </template>-->
            </v-list>
            <!--      <v-list :c-conf="_listConf()"  >-->
            <!--          <div class="row">-->
            <!--              &lt;!&ndash; start:col: &ndash;&gt;-->
            <!--              <div class="col-12 mb-1 p-0">-->

            <!--                  &lt;!&ndash; start:portlet &ndash;&gt;-->

            <!--                  <c-loading v-if="loading" :error-msg="errorMsg"></c-loading>-->
            <!--                  <div v-else class="portlet">-->
            <!--                      <div class="portlet-header border-bottom" :class="headerClass">-->
            <!--                          <span v-show="viewTitle">{{viewTitle}}</span>-->
            <!--                          &lt;!&ndash; options and pagination &ndash;&gt;-->
            <!--                          <div class="row justify-content-end">-->

            <!--                              <div v-if="paginator" class="col-12 col-md-6 mt-1 mb-2">-->
            <!--                                  &lt;!&ndash; v-bind:c-route-conf="routeConf" &ndash;&gt;-->
            <!--                                  <c-paginator v-if="widgets.length > 0" v-show="pagination"-->
            <!--                                               v-bind:c-pagination="pagination" v-bind:c-route="route"></c-paginator>-->
            <!--                              </div>-->
            <!--                              <div class="col-12 col-md-6 mt-1 mb-2" v-show="collectionActionsName.length">-->
            <!--                                  <component v-for="name in collectionActionsName" :key="name" v-bind:is="name" v-bind:c-conf="collectionActions[name]" ></component>-->
            <!--                              </div>-->

            <!--                          </div>-->
            <!--                          <div v-show="multiSheets">-->
            <!--                              <span>Mostra sheet:</span>-->
            <!--                              <w-select :c-conf="selectSheetConf"></w-select>-->
            <!--                          </div>-->
            <!--                          &lt;!&ndash; /options and pagination &ndash;&gt;-->

            <!--                          &lt;!&ndash; header &ndash;&gt;-->
            <!--                          &lt;!&ndash; portlet : header &ndash;&gt;-->
            <!--                          &lt;!&ndash; /portlet : header &ndash;&gt;-->

            <!--                          &lt;!&ndash; /header &ndash;&gt;-->
            <!--                      </div>-->
            <!--                      <div class="portlet-body pb-0">-->
            <!--                          <div class="container-fluid py-1">-->


            <!--                              <div class="table-responsive" style="white-space:nowrap;" :class="modelName">-->
            <!--                                  <table class="table table-framed table-striped table-bordered">-->
            <!--                                      <thead>-->
            <!--                                      <tr v-if="widgets.length > 0">-->
            <!--                                          <th v-if="needSelection" class="text-gray-500 w&#45;&#45;50">-->
            <!--                                              <label class="form-checkbox form-checkbox-primary float-start">-->
            <!--                                                  <input c-row-check-all v-on:change="selectAllRows"-->
            <!--                                                         class="checkall" type="checkbox">-->
            <!--                                                  <i></i>-->
            <!--                                              </label>-->
            <!--                                          </th>-->
            <!--                                          <th v-if="recordActionsName.length"></th>-->
            <!--                                          <template v-for="key in keys">-->
            <!--                                              <th  v-if="!isHiddenField(key)" :key="key"-->
            <!--                                                   class="text-gray-500 font-weight-normal fs&#45;&#45;14" :class="'field-'+key">-->
            <!--                                                  <action-order v-if="orderFields[key]"-->
            <!--                                                                v-bind:c-conf="getOrderConf(key)"></action-order>-->
            <!--                                                  <span style="cursor:default"-->
            <!--                                                        class="btn btn-default btn-xs mr-1 text-gray-500 font-weight-normal fs&#45;&#45;14"-->
            <!--                                                        v-else>{{ translate(key+'.label') }}</span>-->
            <!--                                                  <button v-if="hasHelp(key)"-->
            <!--                                                          type="button"-->
            <!--                                                          class="btn-xs btn-squared btn-light"-->
            <!--                                                          data-trigger="focus"-->
            <!--                                                          data-container="body"-->
            <!--                                                          data-toggle="popover"-->
            <!--                                                          data-placement="top"-->
            <!--                                                          :data-content="hasHelp(key)">-->
            <!--                                                      <i class="fi fi-round-question-full text-red-700"></i>-->
            <!--                                                  </button>-->

            <!--                                              </th>-->
            <!--                                          </template>-->

            <!--                                      </tr>-->
            <!--                                      <tr v-if="widgets.length == 0">-->
            <!--                                          <th v-show="recordActionsName.length" class="text-gray-500 w&#45;&#45;50">-->
            <!--                                              {{ translate('app.nessun-elemento') }}-->
            <!--                                          </th>-->
            <!--                                      </tr>-->
            <!--                                      </thead>-->
            <!--                                      <tbody>-->
            <!--                                      &lt;!&ndash; product &ndash;&gt;-->
            <!--                                      <tr v-for="(row,index) in widgets" :key="index">-->
            <!--                                          <th v-if="needSelection">-->

            <!--                                              <label-->
            <!--                                                  class="form-checkbox form-checkbox-primary float-start">-->
            <!--                                                  <input c-row-check type="checkbox">-->
            <!--                                                  <i></i>-->
            <!--                                              </label>-->


            <!--                                          </th>-->
            <!--                                          <th v-show="recordActionsName.length">-->
            <!--                                              <div class="btn-group" role="group">-->
            <!--                                                  <v-action v-for="(action,name) in recordActions[index]" :key="name" :c-action="action" ></v-action>-->
            <!--                                              </div>-->

            <!--                                          </th>-->

            <!--                                              <td  v-for="(widget, key) in getVisibleWidgets(row)" :key="key"  :class="tdClass(index, key)" >-->
            <!--                                                  <v-widget :c-widget="widget" :key="key"></v-widget>-->
            <!--                                                  <div v-if="hasError(index,key)">-->
            <!--                                                      <hr>-->
            <!--                                                      <small>(foglio = {{value[index]['datafile_sheet']}})</small>-->
            <!--                                                      <small>(riga = {{value[index]['row']}})</small>-->
            <!--                                                  </div>-->
            <!--                                                  <action-base v-if="canEdit && hasError(index,key)" :c-conf="editErrorConf(index,key)"></action-base>-->
            <!--                                              </td>-->


            <!--                                          <template v-for="(widget, key) in row" >-->
            <!--                                              <v-widget :c-widget="widget" :key="key" v-if="isHiddenField(key)"></v-widget>-->
            <!--                                          </template>-->
            <!--                                      </tr>-->
            <!--                                      </tbody>-->

            <!--                                      <tfoot v-if="hasFooter">-->
            <!--                                      <tr v-if="widgets.length > 0">-->
            <!--                                          <th v-if="needSelection" class="text-gray-500 w&#45;&#45;50">-->

            <!--                                          </th>-->
            <!--                                          <th v-show="recordActionsName.length"></th>-->
            <!--                                          <template v-for="key in keys">-->
            <!--                                              <th  v-if="!isHiddenField(key)" :key="key"-->
            <!--                                                   class="text-gray-500 font-weight-normal fs&#45;&#45;14">-->
            <!--                                                  <action-order v-if="orderFields[key]"-->
            <!--                                                                v-bind:c-conf="getOrderConf(key)"></action-order>-->
            <!--                                                  <span style="cursor:default"-->
            <!--                                                        class="btn btn-default btn-xs mr-1 text-gray-500 font-weight-normal fs&#45;&#45;14"-->
            <!--                                                        v-else>{{ translate(key+'.label') }}</span>-->
            <!--                                                  <button v-if="hasHelp(key)"-->
            <!--                                                          type="button"-->
            <!--                                                          class="btn-xs btn-squared btn-light"-->
            <!--                                                          data-trigger="focus"-->
            <!--                                                          data-container="body"-->
            <!--                                                          data-toggle="popover"-->
            <!--                                                          data-placement="top"-->
            <!--                                                          :data-content="hasHelp(key)">-->
            <!--                                                      <i class="fi fi-round-question-full text-red-700"></i>-->
            <!--                                                  </button>-->

            <!--                                              </th>-->
            <!--                                          </template>-->

            <!--                                      </tr>-->
            <!--                                      </tfoot>-->


            <!--                                  </table>-->
            <!--                              </div>-->


            <!--                          </div>-->
            <!--                          &lt;!&ndash; end:portlet &ndash;&gt;-->
            <!--                      </div>-->
            <!--                  </div>-->

            <!--              </div>-->
            <!--              &lt;!&ndash; end:col: &ndash;&gt;-->

            <!--          </div>-->
            <!--      </v-list>-->

        </div>
    </div>
</template>

<script>
import CrudComponent from "../CrudComponent.vue";
import Server from "../lib/Server";
import cView from "../views/cView.vue";
import vRecord from "../views/vRecord.vue";

export default {
    name: "c-import",
    components: {vRecord, cView},
    extends : CrudComponent,
    props : ['conf'],
    data() {
        let that = this;
        window.IMPORT = this;
        if (!('title' in that.conf)) {
            that.conf.title = null;
        }
        if (!('sectionTitle' in that.conf)) {
            that.conf.sectionTitle = null;
        }
        //this.setManageActions();
        that.conf.step = 'upload';
        that.conf.viewDisplay = false;
        that.conf.importStatus = 'upload';
        that.conf.jobId = null;
        return that.conf;
    },
    watch: {
        importStatus() {
            switch (this.importStatus) {
                case 'upload':
                    break;
                case 'load':
                    this.checkStatus();
            }
        }
    },
    methods: {
        _uploadConf() {
            let that = this;
            //let userConf = that.viewUpload; //that.merge({},that.viewUpload);
            let userConf = {
                cRef: 'viewUpload',
                type : 'v-edit',
                routeName: 'datafile_insert',
                fields: [],
                actions: ['action-save'], // 'action-cancel'],
                fieldsConfig: {},
                actionsConfig: {
                    'action-save': {
                        text: 'app.importa-csv',
                        enabled:false,
                        csvDashboard : that,
                        execute() {
                            that.importForm();
                        }
                    }
                }
            }

            userConf.modelName = that.providerName;
            let confUpload = that._defaultUploadConf();
            let rsName = confUpload.name;
            if (userConf.fields.indexOf(rsName) < 0)
                userConf.fields.push(rsName);
            userConf.fieldsConfig[rsName] = confUpload;
            console.log('UPLOAD VIEW',userConf)
            return  userConf;
        },
        _defaultUploadConf() {
            var thatImport = this;
            var conf = thatImport.conf;
            var confUpload = {
                name: 'resource',
                type: 'w-upload-ajax',
                maxFileSize: '2M',
                routeName: 'uploadfile',
                modelName: null,
                extensions: [
                    'csv'
                ],
                ajaxFields: {
                    field: 'resource',
                    resource_type: 'attachment'
                },

                onError() {

                },
                onSuccess() {
                    //var that = this
                    var viewUpload = thatImport.$refs.viewUpload.instance();
                    window.pippo = thatImport;
                    console.log('viewUpload action-save', viewUpload.getAction('action-save'))
                    viewUpload.getAction('action-save').setEnabled(true)
                },
            }
            confUpload = Object.assign(confUpload,(conf.confUpload || {}));
            // var tmp = conf.confUpload || {};
            // for (var k in tmp) {
            //     confUpload[k] = tmp[k];
            // }
            console.log('BBBBB',confUpload);
            return confUpload;
        },
        importForm() {
            let that = this;
            let importView = that.$refs.viewUpload.instance();
            let viewParams = importView.getViewData();

            let w = importView.getWidget('resource');
            let value = JSON.parse(w.getValue());
            let r = this.createRoute('load_datafile');
            r.setParams(viewParams);
            r.setParam('fileName',value.id);
            r.setParam('datafileProviderName',that.providerName);
            r.setParam('resource',value);

            // var params = thatAction.merge(viewParams,{
            //     'fileName': value.id,
            //     'datafileProviderName': thatAction.csvDashboard.providerName,
            // })
            // r.setParams(params);
            console.log('ROUTE',r.getConf());
            //that.waitStart('caricamento file da importare...');
            window.RR = r;

            Server.route(r,function (json) {
                console.log('json',json);
                var checkError = that.checkJobError(json);
                if (checkError.error) {
                    that.step = 'upload'
                    that.errorDialog(checkError.msg);
                    return ;
                }
                that.step = 'loading';
                that.jobId = json.jobId;
                var params = {
                    jobId : json.jobId,
                    progressEnabled : true,
                }
                console.log('evento','start-import',params)
                that.importStatus = 'load';
            })
        },
        checkJobError : function (json) {
            if (json.error) {
                return  {
                    error : 1,
                    msg : json.msg
                };
            }
            if (json.job && json.job.error) {
                return {
                    error : 1,
                    msg : json.job.msg
                };
            }
            return {
                error : 0
            };
        },
        checkStatus : function () {
            var that = this;
            console.log('checkStatus',that.jobId);
            var r = that.createRoute('status_queue');
            r.setValues({
                id : that.jobId
            });
            Server.route(r,function (json) {
                if (json.error) {
                    clearInterval(that.timerStatus);
                    that.errorDialog(json.msg);
                    that.setStatus(true);
                    return ;
                }
                that.progress(json);
            })
        },
        progress : function (json) {
            var that = this;

            var checkError = that.checkJobError(json);

            if (checkError.error ) {
                that.progressEnabled = false;
                that.errorDialog(checkError.msg);
                that.setStatus(true);
                if (that.timerStatus) {
                    clearInterval(that.timerStatus);
                    that.timerStatus = null;
                }

                return ;
            }
            if (json.job.end) {
                console.log('job end',that.step)
                that.progressEnabled = false;
                clearInterval(that.timerStatus);
                that.timerStatus = null;
                if (that.step == 'loading') {
                    that.step = 'tosave';
                    that.saveEnabled = true;
                    that.uploadEnabled = false;
                    //that.datafileConf.jobId = that.jobId;
                    //that.modelName = that.csvProviderName;
                }
                if (that.step == 'saving') {
                    that.step = 'upload';
                    that.uploadEnabled = true;
                    that.saveEnabled = false;
                    that.alertSuccess('Dati salvati',3000);
                }
                console.log('job end 2',that.step,that.saveEnabled,that.uploadEnabled)
                return ;
            }
            console.log('check',that.timerStatus);
            if (!that.timerStatus)
                that.timerStatus = setInterval(that.checkStatus,2000)
        },
        setStatus(preview) {
            let that = this;
            console.log('setStatus',preview,that.step);
            if (preview) {
                switch (that.step) {
                    case 'loading':
                        that.step = 'upload';
                        that.uploadEnabled = true;
                        that.progressEnabled = false;
                        break;
                }
            } else {
                switch (that.step) {
                    case 'loading':
                        that.step = 'tosave';
                        that.saveEnabled = true;
                        that.uploadEnabled = false;
                        break;
                    case 'saving':
                        that.step = 'upload';
                        that.uploadEnabled = true;
                        that.saveEnabled = false;
                        that.alertSuccess('Dati salvati',3000);
                        break;
                }
            }
        },
        _listConf() {
            var that = this;
            var userConf = that.viewList; //that.merge({},that.viewList);
            userConf.modelName = that.providerName;
            userConf.actions = [];
            return userConf;
        },
        _saveConf() {
            var that = this;
            var userConf = that.viewSave; //that.merge({},that.viewSave);
            userConf.modelName = that.providerName;
            userConf.actionsConfig = that.viewSave.actionsConfig || {};
            userConf.fieldsConfig = that.viewSave.fieldsConfig || {};
            var aS = userConf.actionsConfig['action-save-import'] || {};
            aS.csvDashboard = that;
            aS.execute = function () {
                var thatAction = this;
                var r = thatAction.createRoute('save_datafile');
                var viewParams = thatAction.view.getViewData();
                r.setParams(viewParams);
                r.setParam('datafile_load_id',thatAction.csvDashboard.jobId);
                r.setParam('datafileProviderName',thatAction.csvDashboard.providerName);

                // var params = thatAction.merge(viewParams,{
                //     datafile_load_id : thatAction.csvDashboard.jobId,
                //     datafileProviderName : thatAction.csvDashboard.providerName,
                // })
                // r.setParams(params);
                Server.route(r,function (json) {
                    if (json.error) {
                        thatAction.errorDialog(json.msg);
                        return ;
                    }
                    thatAction.csvDashboard.jobId = json.jobId;
                    thatAction.csvDashboard.step='saving';
                    thatAction.csvDashboard.progressEnabled = true;
                    thatAction.csvDashboard.checkStatus();
                })
            }
            userConf.actionsConfig['action-save'] = aS;

            return  userConf;
        },
    }
}
</script>

<style scoped>

</style>
