import lang from "../confs/lang";
import icons from '../confs/icons';
import ActionConfs from "../confs/actions";
import ViewConfs from '../confs/views';

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
    icons: icons,
    env : {},
    useApi : 0,
    validationMessages : {
      messages: {
        required: '{field} is required',
      },
    },
    actionConfs: ActionConfs,
    viewConfs:ViewConfs
}
export default CrudVars;
