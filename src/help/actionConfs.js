export default {
    actionSingola() {
        return {
            actions: {
                'action-save' :  {
                    text : 'ok'
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
                'action-save2' : {
                    actionParent : 'action-save',
                    text : 'Save 2'
                }
            }
        }
    },
}
