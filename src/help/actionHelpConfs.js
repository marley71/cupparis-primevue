import CrudCore from "../lib/CrudCore";
export default {
    actionSingola() {
        return {
            actions: {
                'action-save' :  {
                    text : 'ok',
                    execute() {
                        CrudCore.alertInfo('Hai premuto ok')
                    }
                }
            }
        }
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
                        return 'https://www.repubblica.it'
                    },
                    type : 'link',
                    text : 'link dinamico',
                    target : '_blank',
                    externalLink : true,
                },
                'action-en-dis' : {
                    execute() {
                        this._disabled = true;
                    },
                    text : 'azione che si disabilita',
                },
                'action-en-vis' : {
                    execute() {
                        this._visible = false;
                    },
                    text : 'azione che si nasconde',
                },
            }
        }
    },
}
