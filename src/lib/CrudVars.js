import lang from "../confs/lang";
import ActionConfs from "../confs/actions";
const CrudVars = {
    modelConfs : {},
    viewDefaultConfs : {

    },
    // compatibilità vecchie conf
    viewTypeToViewConf : {
      'v-view' : 'view',
      'v-list' : 'list',
      'v-edit' : 'edit',
      'v-insert': 'insert',
      'v-list-edit' : 'listEdit',
    },
    lang : lang,
    env : {},
    useApi : 0,
    validationMessages : {
      messages: {
        required: '{field} is required',
      },
    },
    actionConfs: ActionConfs,
}
export default CrudVars;
