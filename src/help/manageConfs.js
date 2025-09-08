import CrudCore from "../lib/CrudCore";
import ModelUser from "./ModelUser";

export default {
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
                type : 'record',
                text : 'custom1',
                execute() {
                    let ta = this;
                    ta.manage.mode = 'custom';
                    ta.manage.customComponentName = 'ManageCustomEdit'
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
                type : 'record',
                text : 'custom2',
                execute() {
                    let ta = this;
                    ta.manage.mode = 'custom';
                    ta.manage.customComponentName = 'ManageCustomComponent'
                    ta.manage.custom =  {
                        titolo : 'titolo'
                    }
                }
            }
        }
        m.autoUpdateHash = false;
        console.debug('conssss',m);
        return m;
    }
}
