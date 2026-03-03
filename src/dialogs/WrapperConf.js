import CrudCore from "../lib/CrudCore";
import CrudHelpers from "../lib/CrudHelpers";
import DialogConf from "../confs/dialogs";


export default class WrapperConf {
    loadConf(conf) {
        let that = this;
        //console.log('WIDGET CONF',conf);
        let dC =  DialogConf(); // CrudCore.clone(this.defaultConf); //Object.assign({},this.defaultConf);
        if (typeof conf === 'string') {
            conf = {type:conf};
        }
        conf.type = conf.type || dC.type;
        let functionName = CrudCore.camelCase(conf.type);
        //console.log('functionName',functionName)
        if (that[functionName]) {
             conf = that[functionName](conf);
        }
            conf = Object.assign(dC,conf);
        //console.log('WIDGET',conf);
        return conf;
    }

    
}
