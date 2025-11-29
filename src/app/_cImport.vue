<script>
import CrudComponent from "../CrudComponent.vue";
import Server from "../lib/Server";
import CrudCore from "../lib/CrudCore";

export default {
    name: "_cImport",
    extends : CrudComponent,
    mounted() {
        let that = this;
        setTimeout(function () {
            that._ready();
        },20)
    },
    data() {
        let that = this;
        let conf = that._loadReactiveData(this.conf);
        conf.title = conf.title || null;
        conf.sectionTitle = conf.sectionTitle || null;
        conf.step = 'upload';
        conf.viewDisplay = false;
        conf.importStatus = 'upload';
        conf.jobId = null;
        conf.importDesc = that.conf.importDesc || null;  // descrizione dell'importazione
        conf.importFile = that.conf.importFile || null;  // nome modello da importate di default il nome modello
        conf.importDescHtml = that.conf.importDescHtml || null; // nome file html per una descrizione complessa
        console.debug('import data conf ', conf);
        return conf;
    },
    watch: {
        importStatus() {
            switch (this.importStatus) {
                case 'upload':
                    break;
                case 'load':
                    this.checkStatus();
            }
        },
        importDesc(val) {
            this.importDesc = val;
        }
    },
    methods: {
        _ready() {
            let that = this;
            that.getImportDescHtml();
            if (that.conf.ready && typeof that.conf.ready==='function') {
                that.ready.apply(this);
            }
        },
        getImportDescHtml() {
            let that = this;
            if (that.importDescHtml) {
                console.debug('importo ', that.importDescHtml);
                let properties =  Object.keys(that).filter(key => typeof that[key] !== 'function');
                let data = {};
                for (let k of properties) {
                    data[k] = that[k];
                }
                CrudCore.fetchHtml(that.importDescHtml,function (htmlText) {
                    //console.debug('contenuto',htmlText);
                    that.importDesc = htmlText;
                },data)
            }

        },
        _uploadConf() {
            let that = this;
            //let userConf = that.viewUpload; //that.merge({},that.viewUpload);
            let viewUpload = that.conf.viewUpload || {};
            let userConf = {
                cRef: 'viewUpload',
                type : 'v-edit',
                routeName: 'datafile_insert',
                fields: viewUpload.fields?viewUpload.fields:[],
                actions: ['action-save'], // 'action-cancel'],
                fieldsConfig: viewUpload.fieldsConfig?viewUpload.fieldsConfig:{},
                actionsConfig: {
                    'action-save': {
                        text: 'app.import-button',
                        disabled :true,
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
                layout : {
                    labelPosition : 'none',
                },
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
                    var viewUpload = thatImport.$refs.viewUpload;
                    console.log('viewUpload action-save aaaa', viewUpload.getAction('action-save'))
                    viewUpload.getAction('action-save').disabled = false;
                },
            }
            confUpload = Object.assign(confUpload,(conf.confUpload || {}));
            //console.log('BBBBB',confUpload);
            return confUpload;
        },
        importForm() {
            let that = this;
            let importView = that.$refs.viewUpload.instance();
            let viewParams = importView.getViewData();

            let w = importView.getWidget('resource');
            if (!w || !w.getValue()) {
                that.alertError('Inserire il file da importare');
                return ;
            }
            let value = JSON.parse(w.getValue());
            let r = this.createRoute('load_datafile');
            r.setParams(viewParams);
            r.setParam('fileName',value.id);
            r.setParam('datafileProviderName',that.providerName);
            r.setParam('resource',value);

            console.log('ROUTE',r.getConf());
            //that.waitStart('caricamento file da importare...');
            window.RR = r;
            CrudCore.waitStart('Caricamento file....')
            Server.route(r,function (json) {
                CrudCore.waitEnd();
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
            let that = this;
            let checkError = that.checkJobError(json);
            if (checkError.error ) {
                that.progressEnabled = false;
                that.errorDialog(checkError.msg);
                that.setStatus(true);
                if (that.timerStatus) {
                    clearInterval(that.timerStatus);
                    that.timerStatus = null;
                }
                that.reset();
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
                    that.reset();
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
            var userConf = that.viewList || {}; //that.clone({},that.viewList);
            if (!userConf.type) {
                userConf.type = 'v-list';
            }
            userConf.routeName = userConf.routeName || 'datafile_data';
            userConf = CrudCore.createConfView(userConf);
            userConf.jobId = that.jobId;
            userConf.modelName = that.providerName;
            userConf.actions = [];
            userConf.constraintKey = 'datafile_id';
            userConf.constraintValue = that.jobId;
            console.debug('import list conf',userConf);
            return userConf;
        },
        _saveConf() {
            var that = this;
            var userConf = that.viewSave; //that.merge({},that.viewSave);
            if (!userConf.type) {
                userConf.type = 'v-insert';
            }
            userConf.modelName = that.providerName;
            userConf.actionsConfig = that.viewSave.actionsConfig || {};
            userConf.fieldsConfig = that.viewSave.fieldsConfig || {};

            var aS = userConf.actionsConfig['action-save'] || {};
            aS.csvDashboard = that;
            aS.execute = function () {
                var thatAction = this;
                var r = thatAction.createRoute('save_datafile');
                var viewParams = thatAction.viewInstance.getViewData();
                r.setParams(viewParams);
                r.setParam('datafile_load_id',thatAction.csvDashboard.jobId);
                r.setParam('datafileProviderName',thatAction.csvDashboard.providerName);
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

            var aB = userConf.actionsConfig['action-back'] || {};
            aB.csvDashboard = that;
            aB.execute = function () {
                this.csvDashboard.reset();
            }
            userConf.actionsConfig['action-back'] = aB;

            console.debug('saveConf',userConf);
            return  userConf;
        },
        reset() {
            this.step = 'upload';
            this.importStatus = 'upload';
            this.uploadEnabled = true;
            this.saveEnabled = false;
        },
      /**
       * questa funzione normalizza la configurazione che mi arriva e restituisco solo i dati che devono essere realmente reactive
       */
      _loadReactiveData(conf) {
        let dt = {};
        for (let k in conf) {
          if (!(conf[k] instanceof Function)) {
            dt[k] = conf[k];
          }
        }
        dt.errors = [];
        return dt;
      }
    }
}
</script>

<style scoped>

</style>
