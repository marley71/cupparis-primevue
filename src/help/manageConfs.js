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
        m.list.actions.push('action-select');
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
                    //ta.manage.components.ManageCustomEdit = ManageCustomEdit;
                    ta.manage.mode = 'custom';
                    ta.manage.customComponentName = 'manage-custom-edit';//'ManageCustomEdit'
                    ta.manage.custom =  CrudCore.clone(ModelUser.edit);
                    ta.manage.custom.pk = this.modelData.id;
                    ta.manage.custom.actionsConfig['action-back'] = {
                        execute() {
                            ta.manage.showList();
                        }
                    }
                }
            },
            'action-custom2': {
                actionType : 'record',
                text : 'custom Widget',
                title : 'Istanzia un widget custom',
                execute() {
                    let ta = this;
                    ta.manage.mode = 'custom';
                    ta.manage.customComponentName = 'manage-custom-component'
                    ta.manage.custom =  {
                        titolo : 'titolo del mio compoenente',
                        pulsante() {
                            ta.alertInfo('premuto pulsante')
                        },
                        back() {
                            ta.manage.showList();
                        }
                    }
                }
            }
        }
        m.autoUpdateHash = false;
        console.debug('conssss',m);
        return m;
    }
}
