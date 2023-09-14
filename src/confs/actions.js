import Server from "../lib/Server";
import CrudCore from "../lib/CrudCore";
import CrudVars from "../lib/CrudVars";
import { reject } from "lodash";

const actionConfs = {
    'default': {
        modelData:{},
        extraBind: {},
        controlType : 'button',
        enabled:true,
        visible: true,
    },
    'action-record-grouped' : {
        componentName:'a-grouped',
        type :'record',
        title: 'grouped'
    },
    'action-collection-grouped' : {
        componentName:'a-grouped',
        type :'collection',
        title: 'grouped'
    },
    'action-reset' : {
        type : 'collection',
        title : 'app.reset',
        css: 'rounded',
        text : 'app.reset',
        execute () {
            if (this.view) {
                //console.log('target ref',this.view.targetRef);
                this.view.reset();
                return ;
            }
        }
    },
    'action-search' : {
        type : 'collection',
        title : 'app.cerca',
        buttonClass: '',
        icon : 'fa fa-search',
        text : 'app.cerca',
        execute () {
            console.log('action-search',this,'view',this.view);
            if (this.view) {
                //console.log('target ref',this.view.targetRef);

                //var targetView =  this.getComponent(this.view.targetRef);
                var formData = this.view.getViewData();
                this.view.$emit('search',formData)
                //targetView.route.setParams(formData);
                //targetView.route.setParam('page',1);
                //targetView.reload();
                return ;
            }
        }
    },
    'action-search-basic' : {
        type : 'collection',
        title : 'app.cerca',
        buttonClass: 'p-button p-button-primary',
        icon : 'fa fa-search',
//        text : 'app.cerca',
        execute () {
            console.log('action-search-basic',this,'view',this.view);
            if (this.view) {
                //console.log('target ref',this.view.targetRef);

                //var targetView =  this.getComponent(this.view.targetRef);
                var formData = this.view.getViewData('formBasic');
                this.view.$emit('search',formData)
                //targetView.route.setParams(formData);
                //targetView.route.setParam('page',1);
                //targetView.reload();
                return ;
            }
        }
    },
    'action-save' : {
        type : 'collection',
        title : 'app.salva',
        buttonClass: 'p-button-outlined p-button-success',
        icon : 'fa fa-save',
        text : 'app.salva',
        json : null,
        execute (event) {
            return new Promise((resolve,reject) => {
                this._save(function (esito) {
                    console.log('save Event',event,esito)
                    if (esito) {
                        resolve();
                    } else {
                        reject()
                    }
                    
                })
            })
            
        },

        _save (callback) {
            var that = this;
            //that.waitStart();
            that.view.save(function (json) {
                //that.waitEnd();
                if (json.error) {
                    that.view.errorDialog(json.msg)
                    callback(false);
                    return ;
                }
                that.json = json;
                var msg = json.msg?json.msg:that.view.translate('app.salvataggio-ok');
                that.view.alertSuccess(msg,3000);
                callback(true);
            })
        }

    },
    'action-save-back' : {
        type : 'collection',
        title : 'app.salva.torna-indietro',
        buttonClass: 'p-button-outlined p-button-success',
        icon : 'fa fa-save',
        text : 'app.salva',
        json : null,
        execute (callback) {
            this._save(callback)
        },
        methods: {
            _save (callback) {
                var that = this;
                that.waitStart();
                that.view.save(function (json) {
                    that.waitEnd();
                    if (json.error) {
                        that.view.errorDialog(json.msg)
                        return ;
                    }
                    that.json = json;
                    var msg = json.msg?json.msg:that.translate('app.salvataggio-ok');
                    that.view.alertSuccess(msg,3000);
                    callback();
                })
            }
        },
        afterExecute () {
            window.history.back();
        }
    },
    'action-edit' : {
        type : 'record',
        title : 'app.modifica',
        css: '',
        text : '',
        icon : 'fa fa-edit',
        execute () {
            let url = '#/edit/' + CrudCore.pascalCase('model_'+this.view.modelName) + '.edit/' + this.modelData[this.view.primaryKey]
            document.location.href=url
        }
    },
    'action-view' : {
        type : 'record',
        title : 'app.vista',
        css: '',
        icon : 'fa fa-eye',
        text : '',
        viewType : 'v-view',
        execute () {
            let ta = this;
            console.log('ta',ta);
            let defaultConf = ta.getDefaultViewConf(ta.view.modelName,ta.viewType);
            defaultConf.pk = ta.modelData.id;

            this.componentDialog(ta.viewType,defaultConf)
        }
    },
    'action-delete' : {
        type : 'record',
        title : 'app.cancella',
        css: 'text-red-500',
        buttonClass: 'p-button-outlined p-button-danger',
        icon : 'fa fa-times',
        text : '',
        setRouteValues : function(route) {
            var that = this;
            route.setValues({
                modelName: that.view.modelName
            });
            route.setParams({
                id : that.modelData[that.view.primaryKey],
                _method:'DELETE',
            });
            return route;
        },
        execute : function () {
            var that = this;
            that.view.confirmDialog(that.view.translate('app.conferma-cancellazione') ,{},{
                ok : function () {
                    var r = that.view.createRoute('delete');
                    that.setRouteValues(r);
                    Server.route(r,function (json) {
                        if (json.error) {
                            that.errorDialog(json.msg);
                            return ;
                        }
                        var msg = json.msg?json.msg:that.view.translate('app.cancellazione-successo');
                        that.view.alertSuccess(msg,3000);
                        that.view.reload();
                    });
                }
            });
        }
    },
    'action-save-row' : {
        type: 'record',
        title: 'app.salva',
        css: '',
        text: '',
        icon: 'fa fa-save',
        visible: false,
        // setRouteValues : function(route) {
        //     var that = this;
        //     route.setValues({
        //         modelName: that.view.modelName,
        //         pk : that.modelData[that.view.primaryKey]
        //     });
        //     return route;
        // },
        execute() {
            var that = this;
            console.debug('eseguo save-row');
            that.view.save(that.index,function() {
                
            })
            // var values = that.view.getRowEditData(that.index);
            // //var id = that.view.value[that.index][that.view.primaryKey];
            // var r = that.view.createRoute('update');
            // that.setRouteValues(r);
            // r.setParams(values);
            // Server.route(r, function (json) {
            //     if (json.error) {
            //         that.view.errorDialog(json.msg);
            //         return;
            //     }
            //     var msg = json.msg?json.msg:that.translate('app.salvataggio-ok');
            //     that.view.alertSuccess(msg,3000);
            //     var values = json.result;
            //     that.view.setRowData(that.index,values);
            //     that.view.setViewMode(that.index);
            //     //that.view.reload();
            // })
            // console.log('values', values);
        },
    },
    'action-edit-mode':  {
        type : 'record',
        title : 'app.modifica',
        css: '',
        text : '',
        icon : 'fa fa-edit',
        execute : function () {
            var that = this;
            that.view.setEditMode(that.index);
        }
    },
    'action-view-mode' : {
        type : 'record',
        title : 'app.annulla',
        css: '',
        //text : 'back',
        icon : 'fa fa-arrow-left',
        visible : false,
        execute : function () {
            var that = this;
            that.view.setViewMode(that.index);
        }
    },
    'action-insert' : {
        type : 'collection',
        visible : true,
        enabled : true,
        title : 'app.nuovo',
        buttonClass: 'p-button-outlined p-button-success ',
        icon : 'fa fa-plus',
        text : 'app.nuovo',
        execute() {
            //var url = "/insert/" + this.view.modelName + "/new";
            let url = '#/insert/' + CrudCore.pascalCase('model_'+this.view.modelName) + ".insert"
            document.location.href=url;
        }
    },
    'action-back' : {
        type : 'collection',
        title : 'app.indietro',
        buttonClass: 'p-button-outlined p-button-warning',
        icon : 'fa fa-backward',
        text : 'app.indietro',
        execute : function () {
            window.history.back();
        }
    },
    'action-delete-selected' : {
        type : 'collection',
        title : 'app.cancella-selezionati',
        buttonClass: 'p-button-outlined p-button-danger',
        icon : 'fa fa-trash',
        text : '',
        needSelection : true,
        setRouteValues : function(route) {
            var that = this;
            route.setValues({
                modelName: that.view.modelName,
            });
            return route;
        },
        execute : function () {
            var that = this;
            var checked = that.view.selectedRows();
            var num = checked.length;
            console.log(num,'view',that.view)
            if (num === 0)
                return ;
            that.view.confirmDialog(that.view.translate('app.conferma-multidelete',null,false,[num]), {
                ok : function () {
                    var r = that.createRoute('multi-delete');
                    that.setRouteValues(r);
                    r.setParams({'ids': checked});
                    that.waitStart();
                    Server.route(r,function (json) {
                        that.waitEnd();
                        if (json.error) {
                            that.errorDialog(json.msg);
                            return ;
                        }
                        that.view.reload();
                        //that.callback(json);
                    })
                }
            });
            //console.log('selected',that.view.selectedRows())
        }
    },
    'action-show-error' : {
        text : 'app.mostra-solo-errori', //'Mostra solo errori',
        css : 'btn-outline-danger',
        type : 'collection',
        controlType:'button',
        execute() {
            this.view.showError = true;
            this.view.reload();
        },
        visible() {
            if (this.view.metadata.has_datafile_errors)
                return true
            return false;
        }
    },
    'action-mostra-tutti' : {
        text : 'app.mostra-tutti', // 'Mostra tutti',
        type : 'collection',
        controlType:'button',
        execute() {
            this.view.showError = false;
            this.view.reload();
        },
        visible() {
            if (this.view.metadata.has_datafile_errors)
                return true
            return false;
        }

    },
    'action-export-csv' : {
        execute () {
            var that = this
            var r = that.view.createRoute(that.routeName)
            r.setValues({
                'foorm': that.view.modelName,
                'foormtype': 'list'
            })
            //console.log('action-export-csv',that.view.modelName,that.view.cType)
            // var p = {
            //     'csvType': that.csvType
            // }
            // var viewP = that.view.route.getParams()
            r.setParam('csvType', that.csvType)
            that.view.waitStart(that.startMessage)
            Server.route(r, function (json) {
                that.view.waitEnd()
                if (json.error) {
                    that.view.errorDialog(json.msg)
                    return
                }
                //let prefix = CrudVars.useApi?'/api':'';
                //document.location.href = prefix + json.result.link
                var anchor = document.createElement('a');
                anchor.href = json.result.link;
                anchor.target="_blank";
                anchor.click();
                console.log(json)
            })

            console.log('r', r)
        },
        type: 'collection',
        icon: 'fa fa-file-csv',
        text: 'Esporta',
        css: 'p-button-sm p-button-text p-button-secondary',
        csvType: 'default',
        routeName: 'csv-exporta',
        startMessage: 'Generazione csv in corso...'
    },
    'action-export-pdf' : {
        execute () {
            var that = this
            var r = that.view.createRoute(that.routeName)
            let foormPk = that.modelData[that.view.primaryKey];
            r.setValues({
                'foorm': that.view.modelName,
                'foormtype': 'list',
                'foormpk' : foormPk
            })
            //console.log('action-export-csv',that.view.modelName,that.view.cType)
            // var p = {
            //     'csvType': that.csvType
            // }
            // var viewP = that.view.route.getParams()
            r.setParam('pdfType', that.pdfType)
            that.view.waitStart(that.startMessage)
            Server.route(r, function (json) {
                that.view.waitEnd()
                if (json.error) {
                    that.view.errorDialog(json.msg)
                    return
                }
                let prefix = CrudVars.useApi?'/api':'';
                document.location.href = prefix + json.result.link
                console.log(json)
            })

            console.log('r', r)
        },
        type: 'record',
        icon: 'fa fa-file-pdf',
        text: 'Pdf',
        css: 'p-button-sm p-button-text p-button-secondary',
        pdfType: 'record',
        routeName: 'pdf-exporta',
        startMessage: 'Generazione pdf in corso...'
    }
}
export default actionConfs
