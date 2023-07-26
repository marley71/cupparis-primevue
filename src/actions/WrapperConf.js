//import CrudCore from "@/cupparis/lib/CrudCore";

import CrudCore from "../lib/CrudCore";

export default class WrapperConf {
    defaultConf() {
        return {
            name : '',
            modelData:{},
            extraBind: {},
            controlType : 'button',
            href : '',
            icon : null,
            target : null,
            text : '',
        }
    }

    loadConf(conf) {
        let that = this;
        //let na = CrudCore.clone(conf);
        conf = Object.assign(that.defaultConf(),conf);

        // for (let key in conf.actions) {

        //     // console.log('key',key,conf.actions[key]);
        //     // let na = Object.assign(CrudCore.clone(that.defaultConf),CrudCore.clone(conf.actions[key]));
        //     // console.log('key1',key,na);

        //     let na = CrudCore.clone(conf.actions[key]);
        //     conf.actions[key] = Object.assign(that.defaultConf(),na);
        // }
        //console.debug('actions ------ ',conf);
        return conf;
    }
}
