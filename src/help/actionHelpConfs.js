import CrudCore from "../lib/CrudCore";

export default {
    actionSingola() {
        return {
            actions: {
                'action-save' :  {
                    text : 'ok',
                    execute:function () {
                        CrudCore.alertInfo('Hai premuto ok');
                    },
                },
                'action-before-execute' : {
                    text : 'con beforeExecute',
                    beforeExecute() {
                        CrudCore.alertInfo('Before execute senza promise');
                        return true;
                    },
                    execute() {
                        CrudCore.alertInfo('Execute');
                    }
                },
                'action-before-execute-promise' : {
                    text : 'con beforeExecute promise',
                    beforeExecute() {
                        return  new Promise((resolve,reject) => {
                            if (CrudCore.confirmDialog('Sei sicuro',{},{
                                ok: function () {
                                    resolve(true);
                                },
                                cancel:function () {
                                    reject();
                                }
                            }));
                        })

                    },
                    execute() {
                        CrudCore.alertInfo('Execute');
                    }
                },
                'action-before-execute_execute-promise' : {
                    text : 'con beforeExecute e execute promise',
                    beforeExecute() {
                        return  new Promise((resolve,reject) => {
                            if (CrudCore.confirmDialog('Promise in before Execute. Sei sicuro?',{},{
                                ok: function () {
                                    resolve(true);
                                },
                                cancel: function () {
                                    reject();
                                }
                            }));
                        })

                    },
                    execute() {
                        return  new Promise((resolve,reject) => {
                            if (CrudCore.confirmDialog('Promise in execute. Per la seconda volta. Sei sicuro?',{},{
                                ok: function () {
                                    resolve(true);
                                },
                                cancel: function () {
                                    reject();
                                }
                            }));
                        })
                    },
                    afterExecute() {
                        CrudCore.alertInfo('afterExecute, allora sei proprio sicuro');
                    }
                }
            }
        }
    },
    actionSingolaMenuBar() {
        let a = this.actionSingola();
        a.layout = 'menubar';
        return a;
    },
    actionDefaultDoppia() {
        return {
            actions: {
                'action-save' : null,
                'action-save2' : {
                    actionParent : 'action-save',
                    text : 'Save 2'
                }
            }
        }
    },
    actionCustom() {
        return {
            actions: {
                'action-mia' : {
                    text : 'Mia',
                    execute() {
                        alert('mia')
                    }
                },
                'action-link' : {
                    href : 'https://google.it',
                    type : 'link',
                    text : 'link google',
                    target : '_blank',
                    externalLink : true,
                },
                'action-link-d' : {
                    href() {
                        let urls = [
                            'https://www.repubblica.it',
                            'https://www.google.it',
                            'https://www.facebook.it'
                        ];
                        let idx = Math.floor(Math.random() * 3)
                        return urls[idx]
                    },
                    type : 'link',
                    text : 'link dinamico',
                    target : '_blank',
                    externalLink : true,
                },
                'action-en-dis' : {
                    execute() {
                        this.disabled = true;
                    },
                    text : 'azione che si disabilita',
                },
                'action-en-vis' : {
                    execute() {
                        this.visible = false;
                    },
                    text : 'azione che si nasconde',
                },
            }
        }
    },
}
