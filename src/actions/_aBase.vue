

<script>
import CrudComponent from "../CrudComponent.vue";
import Server from "../lib/Server";
import WrapperConf from "./WrapperConf";
import CrudHelpers from "../lib/CrudHelpers";
import global from "../confs/global";

export default {
    name: "_aBase",
    extends: CrudComponent,
    //props: ['conf'],
    beforeCreate() {
        let that = this;
        //console.log('CREATEDDD',that)
        that.overwriteMethods = {};
        var __call = function (lk) {
            that[lk] = function () {
                var localk = new String(lk);
                return that.overwriteMethods[localk].apply(that, arguments);
            }
        }

        for (let k in that.conf) {
            //console.log('action wConf k',k,that.wConf[k]);
            if (global.actionReservedKeys.indexOf(k) >= 0) {
                throw "(" +k+") è una chiave riservata e non può essere sovrascritta";
            }
            if (that.conf[k] instanceof Function) {
                //console.log('found method',k);
                that.overwriteMethods[k] = that.conf[k];
                __call(k);
            }
        }
        this.Server = Server;
    },
    data() {
        let that = this;
        //console.debug('actions ', that.conf.actionType);
        let conf = that._loadReactiveData(that.conf);
        return conf;
    },
    methods: {
        getButtonSize() {
            var that = this;
            var buttonSize = that.conf.buttonSize ? that.conf.buttonSize : 'small';

            switch (buttonSize) {
                case 'small':
                    return 'p-button p-button-sm';
                case 'normal':
                    return 'p-button';
                case 'large':
                    return 'p-button-lg';
            }

        },
        getButtonClass() {
            var that = this;
            return that.conf.buttonClass ? that.conf.buttonClass
                : 'p-button-outlined w-auto';
        },
        getActionClass() {
            var that = this;
            let customClass = '';
            if (that.conf.actionClass) {
                customClass = that.conf.actionClass;
            }
            return customClass + ' ' + that.getButtonSize() + ' '
                + that.getButtonClass() + ' '
                + that.conf.spacing;
        },
        _href(event) {
          console.debug('href event',event);
            if (this.conf.href instanceof Function) {
                return this.conf.href.apply(this);
            }
            return this.conf.href;
        },
        _visible() {
            //console.log('_visible',this.visible);
            if (this.conf.visible instanceof Function) {
                return this.conf.visible.apply(this);
            }
            return this.visible;
        },
        _disabled() {
            if (this.conf.disabled instanceof Function) {
                return this.conf.disabled.apply(this);
            }
            return this.disabled;
        },

        _beforeExecute() {
            let that = this;
            return new Promise((resolve, reject) => {
                console.debug('_beforeExecute', that.beforeExecute);
                if (!that.beforeExecute) {
                    console.debug('_beforeExecute2');
                    resolve(true);
                } else {
                    console.debug('_beforeExecute1');
                    let result = that.beforeExecute();
                    console.log('result', result);
                    if (result && result instanceof Promise) {
                        result.then(() => {
                            console.debug('1then')
                            resolve(true)
                        }).catch(() => {
                            console.debug('2rejedct')
                            reject();
                        })
                        return;
                    }
                    if (result) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                }

            })
        },
        execute(event) {
            let that = this;
            event.preventDefault();
            if (that.type === 'link' || that.type === 'link-download') {
                //that.execute = function () {
                    CrudHelpers.createRuntimeLink(that.href(), that.target)
                //}
              return;
            }
            if (that.conf.execute) {
                that._beforeExecute().then(() => {
                    let result = that.conf.execute.apply(this,[event]);
                    console.debug('execute after', result)
                    if (result && result instanceof Promise) {
                        result.then(() => {
                            that._afterExecute();
                        }).catch((error) => {
                            console.debug('execute reject', error)
                        })
                    } else {
                        if (result) {
                            that._afterExecute();
                        }
                    }
                }).catch((error) => {
                    console.debug('beforeExecute reject', error);
                    //throw error;
                })
            } else {
                alert('execute non definita')
            }

        },

        _afterExecute(params) {
            if (this.afterExecute) {
                this.afterExecute(params);
            }
        },

        // setEnabled(value) {
        //     this.enabled = value;
        // },
        // setVisible(value) {
        //     this.visible = value;
        // },

        _icon() {
            if (this.conf.icon instanceof Function) {
                return this.conf.icon.apply(this);
            }
            return this.conf.icon;
        },
        _text() {
            if (this.conf.text instanceof Function) {
                return this.translate(this.conf.text.apply(this));
            }
            return this.translate(this.conf.text);
        },
        /**
         * questa funzione normalizza la configurazione che mi arriva e restituisco solo i dati che devono essere realmente reactive
         */
        _loadReactiveData(conf) {
          let wc = new WrapperConf()
          let ext = wc.loadConf(conf);
          let dt = {};
          for (let k in ext) {
              if (global.actionReservedKeys.indexOf(k) < 0) {
                  if ((global.actionOverloadMethods.indexOf(k) < 0)) {
                      if (!(ext[k] instanceof Function)) {
                          dt[k] = ext[k];
                      }
                  }
              }
          }
          return dt;
        }

    }
}
</script>
