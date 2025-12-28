import CrudCore from "../lib/CrudCore";
import ModelUser from "./ModelUser";

export default {
    constraint() {
        return new Promise((resolve,reject) => {
            CrudCore.inputDialog("Inserisci l'id dell'utente che ha creato gli utenti").then((res) => {
                let m = JSON.parse(JSON.stringify(ModelUser));
                m.list.constraintKey = 'created_by';
                m.list.constraintValue = res;
                //m.list.constraintValue = this.$route.params.created_by;
                m.list.routeName = 'list-constraint';
                m.autoUpdateHash = false;
                resolve(m);
            })
        })


    },
    semplice() {
        let m = JSON.parse(JSON.stringify(ModelUser));
        m.autoUpdateHash = false;
        return m;
    },
    m2() {
        let m = JSON.parse(JSON.stringify(ModelUser));
        m.editComponentName = 'insert-edit-user';
        m.insertComponentName = 'insert-edit-user';
        m.autoUpdateHash = false;
        return m;
    },
    m3() {
        let m = JSON.parse(JSON.stringify(ModelUser));
        m.listComponentName = 'list-user';
        //m.list.actions.push('action-select');
        m.autoUpdateHash = false;
        return m;
    },
    m4() {
        let m = CrudCore.clone(ModelUser);

        m.list.actions = [
            'action-custom1',
            'action-custom2'
        ];
        m.list.actionsConfig = {
            'action-custom1': {
                actionType : 'record',
                text : 'custom Edit',
                title : 'Istanzia una vista edit custom',
                execute() {
                    let ta = this;
                    ta.manageInstance.customComponentName = 'manage-custom-edit';//'ManageCustomEdit'
                    let customConf =  CrudCore.clone(ModelUser.edit);
                    customConf.pk = this.modelData.id;
                    customConf.actionsConfig['action-back'] = {
                        execute() {
                            ta.manageInstance.showList();
                        }
                    }
                    ta.manageInstance.showCustom(customConf);
                }
            },
            'action-custom2': {
                actionType : 'record',
                text : 'custom Widget',
                title : 'Istanzia un widget custom',
                execute() {
                    let ta = this;
                    ta.manageInstance.customComponentName = 'manage-custom-component'
                    let customConf =  {
                        titolo : 'titolo del mio compoenente',
                        pulsante() {
                            ta.alertInfo('premuto pulsante')
                        },
                        back() {
                            ta.manageInstance.showList();
                        }
                    }

                    ta.manageInstance.showCustom(customConf);
                }
            }
        }
        m.autoUpdateHash = false;
        console.debug('conssss',m);
        return m;
    }
}
