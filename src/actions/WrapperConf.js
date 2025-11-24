
export default class WrapperConf {
    defaultConf() {
        return {
            name : '',
            modelData:{},
            extraBind: {},
            type : 'button',
            actionType : 'record',
            href : '',
            icon : null,
            target : null,
            text : '',
            title : '',
            css : '',
            disabled : false,
            visible : true,
            externalLink : false,
        }
    }

    loadConf(conf) {
        let that = this;
        let def = that.defaultConf();
        conf = Object.assign(def,conf);
        return conf;
    }
}
