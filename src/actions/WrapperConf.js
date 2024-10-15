
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
            css : '',
            enabled : true,
            externalLink : false,
        }
    }

    loadConf(conf) {
        let that = this;
        conf = Object.assign(that.defaultConf(),conf);
        return conf;
    }
}
