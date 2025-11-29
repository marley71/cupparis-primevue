import Server from "../lib/Server";
import CrudCore from "../lib/CrudCore";
import CrudVars from "../lib/CrudVars";
import CrudHelpers from "../lib/CrudHelpers";

const actionConfs = {
    'default': function () {
        return {
            modelData:{},
            extraBind: {},
            type : 'button',
            disabled:false,
            visible: true,
        }
    },
    'action-record-grouped' : function() {
        return  {
            componentName:'a-grouped',
            actionType :'record',
            title: 'grouped'
        }
    },
    'action-collection-grouped'  : function() {
        return  {
            componentName:'a-grouped',
            actionType :'collection',
            title: 'grouped'
        }
    },
    'action-reset'  : function() {
        return  {
            actionType : 'collection',
            title : 'app.reset',
            css: 'rounded-sm',
            text : 'app.reset',
            execute () {
                if (this.viewInstance) {
                    this.viewInstance.reset();
                    return true;
                }
            }
        }
    },
    'action-search'  : function() {
        return  {
            actionType : 'collection',
            title : 'app.cerca',
            buttonClass: '',
            icon : 'fa fa-search',
            text : 'app.cerca',
            execute (event) {
                let tA = this;
                return new Promise(function (resolve,reject) {
                    tA._search(function (esito) {
                        console.log('search Event',event,esito);
                        if (esito) {
                            resolve();
                        } else {
                            reject();
                        }

                    })
                })

            },
            _search (callback) {
                console.log('action-search',this,'view',this.viewInstance);
                if (this.viewInstance) {
                    this.viewInstance.search()
                    callback(true)
                    return ;
                }
                callback(true)
            }
        }
    },

    'action-save'  : function() {
        return  {
            actionType : 'collection',
            title : 'app.salva',
            buttonClass: 'p-button-outlined p-button-success',
            icon : 'fa fa-save',
            text : 'app.salva',
            json : null,
            autoreloadView : true,
            execute (event) {
                let tA = this;
                return new Promise(function (resolve,reject) {
                    tA._save(function (esito) {
                        console.log('save Event',event,esito);
                        if (esito) {
                            resolve();
                        } else {
                            reject();
                        }

                    })
                })

            },

            _save (callback) {
                var that = this;
                if (!that.viewInstance) {
                    CrudCore.alertError("impossibile eseguire _save. View non definita")
                    console.error("impossibile eseguire _save view non definita");
                    callback(false)
                }
                //that.waitStart();
                that.viewInstance.save(function (json) {
                    //that.waitEnd();
                    if (json.error) {
                        that.viewInstance.errorDialog(json.msg);
                        callback(false);
                        return ;
                    }
                    that.json = json;
                    var msg = json.msg?json.msg:that.viewInstance.translate('app.salvataggio-ok');
                    that.viewInstance.alertSuccess(msg,3000);
                    if (that.autoreloadView) {
                        that.viewInstance.reload();
                    }
                    callback(true);
                })
            }
        }

    },
    'action-save-back'  : function() {
        return  {
            actionType : 'collection',
            title : 'app.salva-torna-indietro',
            buttonClass: 'p-button-outlined p-button-success',
            icon : 'fa fa-save',
            text : 'app.salva-torna-indietro',
            json : null,
            execute (event) {
                let tA = this;
                return new Promise(function (resolve,reject) {
                    tA._save(function (esito) {
                        console.log('save back Event',event,esito);
                        if (esito) {
                            resolve();
                        } else {
                            reject();
                        }

                    })
                })
                //this._save(callback)
            },
            _save (callback) {
                var that = this;
                that.waitStart();
                that.viewInstance.save(function (json) {
                    that.waitEnd();
                    if (json.error) {
                        that.viewInstance.errorDialog(json.msg)
                        callback(false);
                        return ;
                    }
                    that.json = json;
                    var msg = json.msg?json.msg:that.translate('app.salvataggio-ok');
                    that.viewInstance.alertSuccess(msg,3000);
                    callback(true);
                })
            },
            afterExecute () {
                this.$router.back();
            }
        }
    },
    'action-edit'  : function() {
        return  {
            actionType : 'record',
            title : 'app.modifica',
            css: '',
            text : '',
            icon : 'fa fa-edit',
            execute () {
                let url = '/edit/' + CrudCore.pascalCase('model_'+this.viewInstance.modelName) + '.edit/' + this.modelData[this.viewInstance.primaryKey];
                this.viewInstance.$router.push(url);
            }
        }
    },
    'action-view'  : function() {
        return  {
            actionType : 'record',
            title : 'app.vista',
            css: '',
            icon : 'fa fa-eye',
            text : '',
            viewType : 'v-view',
            dialogTitle : 'app.vista',
            dialogConf : null,
            execute () {
                let ta = this;
                let defaultConf = ta.getDefaultViewConf(ta.viewInstance.modelName,ta.viewType);
                defaultConf.pk = ta.modelData.id;
                return new Promise((resolve) => {
                    CrudCore.componentDialog('v-view',defaultConf,this.dialogTitle,{
                        hide() {
                            resolve();
                        }
                    });
                })
            }
        }
    },
    'action-delete'  : function() {
        return  {
            actionType : 'record',
            type : 'button',
            title : 'app.cancella',
            css: 'text-red-500',
            buttonClass: 'p-button-outlined p-button-danger',
            icon : 'fa fa-times',
            text : '',
            setRouteValues : function(route) {
                var that = this;
                route.setValues({
                    modelName: that.viewInstance.modelName
                });
                route.setParams({
                    id : that.modelData[that.viewInstance.primaryKey],
                    _method:'DELETE',
                });
                return route;
            },
            execute (event) {
                let tA = this;
                return new Promise(function (resolve,reject) {
                    tA._delete(function (esito) {
                        console.log('save back Event',event,esito);
                        if (esito) {
                            resolve();
                        } else {
                            reject();
                        }

                    })
                })
                //this._save(callback)
            },
            _delete : function (callback) {
                var that = this;
                that.viewInstance.confirmDialog(that.viewInstance.translate('app.conferma-cancellazione') ,{},{
                    ok : function () {
                        var r = that.viewInstance.createRoute('delete');
                        that.setRouteValues(r);
                        Server.route(r,function (json) {
                            if (json.error) {
                                that.errorDialog(json.msg);
                                callback(false);
                                return
                            }
                            var msg = json.msg?json.msg:that.viewInstance.translate('app.cancellazione-successo');
                            that.viewInstance.alertSuccess(msg,3000);
                            that.viewInstance.reload();
                            callback(true);
                        });
                    },
                    cancel () {
                        callback(false);
                    }
                });
            }
        }
    },
    'action-save-row' : function() {
        return  {
            actionType: 'record',
            title: 'app.salva',
            css: '',
            text: '',
            icon: 'fa fa-save',
            _visible: false,
            execute (event) {
                let tA = this;
                return new Promise(function (resolve,reject) {
                    tA._saveRow(function (esito) {
                        console.log('save back Event',event,esito);
                        if (esito) {
                            tA.viewInstance.reload();  // TODO sarebbe meglio fare l'aggiornamento di un riga via script senza reload vista
                            resolve();
                        } else {
                            reject();
                        }

                    })
                })
                //this._save(callback)
            },
            _saveRow(callback) {
                var that = this;
                console.debug('eseguo save-row');
                that.viewInstance.save(that.index,function(esito) {
                    callback(esito)
                })
            },
        }
    },
    'action-edit-mode' : function() {
        return  {
            actionType : 'record',
            title : 'app.modifica',
            css: '',
            text : '',
            icon : 'fa fa-edit',
            execute : function () {
                var that = this;
                that.viewInstance.setEditMode(that.index);
            }
        }
    },
    'action-view-mode'  : function() {
        return  {
            actionType : 'record',
            title : 'app.annulla',
            css: '',
            //text : 'back',
            icon : 'fa fa-arrow-left',
            _visible : false,
            execute : function () {
                var that = this;
                that.viewInstance.setViewMode(that.index);
            }
        }
    },
    'action-insert'  : function() {
        return  {
            actionType : 'collection',
            visible : true,
            disabled : false,
            title : 'app.nuovo',
            buttonClass: 'p-button-outlined p-button-success ',
            icon : 'fa fa-plus',
            text : 'app.nuovo',
            execute() {
                let url = '/insert/' + CrudCore.pascalCase('model_'+this.viewInstance.modelName) + ".insert"
                this.viewInstance.$router.push(url);
            }
        }
    },
    'action-back'  : function() {
        return  {
            actionType : 'collection',
            title : 'app.indietro',
            buttonClass: 'p-button-outlined p-button-warning',
            icon : 'fa fa-backward',
            text : 'app.indietro',
            execute : function () {
                this.$router.back();
                //window.history.back();
            }
        }
    },
    'action-delete-selected'  : function() {
        return  {
            actionType : 'collection',
            title : 'app.cancella-selezionati',
            buttonClass: 'p-button-outlined p-button-danger',
            icon : 'fa fa-trash',
            text : '',
            needSelection : true,
            setRouteValues : function(route) {
                var that = this;
                route.setValues({
                    modelName: that.viewInstance.modelName,
                });
                return route;
            },
            execute (event) {
                let tA = this;
                return new Promise(function (resolve,reject) {
                    tA._deleteSelected(function (esito) {
                        console.log('save back Event',event,esito);
                        if (esito) {
                            resolve();
                        } else {
                            reject();
                        }

                    })
                })
                //this._save(callback)
            },
            _deleteSelected : function (callback) {
                var that = this;
                var checked = that.viewInstance.selectedRows();
                var num = checked.length;
                //console.log(num,'view',that.viewInstance)
                if (num === 0) {
                    callback(true);
                    return ;
                }
                let msg = that.viewInstance.translate('app.conferma-multidelete',null,false,[num]);
                that.viewInstance.confirmDialog(msg, {}, {
                    ok : function () {
                        var r = that.createRoute('multi-delete');
                        that.setRouteValues(r);
                        r.setParams({'ids': checked});
                        that.waitStart();
                        Server.route(r,function (json) {
                            that.waitEnd();
                            if (json.error) {
                                that.errorDialog(json.msg);
                                callback(false);
                                return ;
                            }
                            that.viewInstance.reload();
                            callback(true);
                        })
                    }
                });
                //console.log('selected',that.viewInstance.selectedRows())
            }
        }
    },
    'action-show-error'  : function() {
        return  {
            text : 'app.mostra-solo-errori', //'Mostra solo errori',
            css : 'btn-outline-danger',
            actionType : 'collection',
            type:'button',
            execute() {
                this.viewInstance.showError = true;
                this.viewInstance.reload();
            },
            _visible() {
                if (this.viewInstance.metadata.has_datafile_errors)
                    return true
                return false;
            }
        }
    },
    'action-mostra-tutti'  : function() {
        return  {
            text : 'app.mostra-tutti', // 'Mostra tutti',
            actionType : 'collection',
            type:'button',
            execute() {
                this.viewInstance.showError = false;
                this.viewInstance.reload();
            },
            _visible() {
                if (this.viewInstance.metadata.has_datafile_errors)
                    return true
                return false;
            }
        }

    },
    'action-export-csv'  : function() {
        return  {
            execute (event) {
                let tA = this;
                return new Promise(function (resolve,reject) {
                    tA._exportCsv(function (esito) {
                        console.log('save back Event',event,esito);
                        if (esito) {
                            resolve();
                        } else {
                            reject();
                        }

                    })
                })
                //this._save(callback)
            },
            _exportCsv (callback) {
                var that = this
                var r = that.viewInstance.createRoute(that.routeName)
                r.setValues({
                    'foorm': that.viewInstance.modelName,
                    'foormtype': 'list'
                })
                r.setParams(that.viewInstance.getParams());
                r.setParam('csvType', that.csvType)
                that.viewInstance.waitStart(that.startMessage)
                Server.route(r, function (json) {
                    that.viewInstance.waitEnd()
                    if (json.error) {
                        that.viewInstance.errorDialog(json.msg)
                        callback(false)
                        return
                    }
                    //let prefix = CrudVars.useApi?'/api':'';
                    //document.location.href = prefix + json.result.link
                    if (that.blob) {
                        let filename = json.result[that.nameField]?json.result[that.nameField]:'file.pdf';
                        CrudHelpers.createRuntimeDownload(json.result[that.contentField],json.result[that.mimeField],filename);
                    } else {
                        var anchor = document.createElement('a');
                        anchor.href = json.result.link;
                        anchor.target="_blank";
                        anchor.click();
                    }
                    callback(true)
                    //console.log(json)
                })

                //console.log('r', r)
            },
            actionType: 'collection',
            icon: 'fa fa-file-csv',
            text: 'Esporta',
            css: 'p-button-sm p-button-text p-button-secondary',
            csvType: 'default',
            routeName: 'csv-exporta',
            startMessage: 'Generazione csv in corso...',
            blob: true,
            contentField: 'content',
            mimeField: 'mime',
            nameField: 'name',
        }
    },
    'action-export-pdf'  : function() {
        return  {
            execute (event) {
                let tA = this;
                return new Promise(function (resolve,reject) {
                    tA._exportPdf(function (esito) {
                        console.log('save back Event',event,esito);
                        if (esito) {
                            resolve();
                        } else {
                            reject();
                        }

                    })
                })
                //this._save(callback)
            },
            _exportPdf (callback) {
                var that = this
                var r = that.viewInstance.createRoute(that.routeName)
                let foormPk = that.modelData[that.viewInstance.primaryKey];
                r.setValues({
                    'foorm': that.viewInstance.modelName,
                    'foormtype': 'list',
                    'foormpk' : foormPk
                })
                r.setParams(that.viewInstance.getParams());
                r.setParam('pdfType', that.pdfType)
                that.viewInstance.waitStart(that.startMessage)
                Server.route(r, function (json) {
                    that.viewInstance.waitEnd()
                    if (json.error) {
                        that.viewInstance.errorDialog(json.msg)
                        callback(false);
                        return
                    }
                    if (that.blob) {
                        let filename = json.result[that.nameField]?json.result[that.nameField]:'file.pdf';
                        CrudHelpers.createRuntimeDownload(json.result[that.contentField],json.result[that.mimeField],filename);
                    } else {
                        let prefix = CrudVars.useApi?'/api':'';
                        document.location.href = prefix + json.result.link
                    }
                    callback(true);
                    //console.log(json)
                })

                //console.log('r', r)
            },
            actionType: 'record',
            icon: 'fa fa-file-pdf',
            text: 'Pdf',
            css: 'p-button-sm p-button-text p-button-secondary',
            pdfType: 'record',
            routeName: 'pdf-exporta',
            startMessage: 'Generazione pdf in corso...',
            blob: true,
            contentField: 'content',
            mimeField: 'mime',
            nameField: 'name',
        }
    }
}
export default actionConfs
