<script>

import Route from "./lib/Route";
import CrudCore from "./lib/CrudCore.js";
import {createApp,defineAsyncComponent} from 'vue'
import PrimeVue from "primevue/config";
import routeConfs from "./confs/routes";
import CrudVars from "./lib/CrudVars";

export default {
    name: "CrudComponent",
    methods: {
        /**
         * istanzia una nuova route a partire dalla configurazione trovata in store
         * @param routeName : nome della configurazione della route
         */
        createRoute : function(routeName) {

            let routeConf =  JSON.parse(JSON.stringify(routeConfs[routeName]))  //Object.assign({},routeConfs[routeName]);
            console.log('routeName',routeName,routeConf);
            if (!routeConf)
                throw "Impossibile trovare la route " + routeName;
            return new Route(routeConf);
        },

        /**
         * cerca e crea la classe protocol utilizzando come naming
         * Protocol+pascalCase(name)
         * @param name : nome su cui viene applicata la funzione pascalCase e aggiunt il prefisso Protocol.
         * esempio se passiamo come nome mio_prot cerchera' di istanziare la class ProtocolMioProt.
         */
        createProtocol : function(name) {
            try {
                return CrudCore.createProtocol(name);
            } catch (e) {
                console.error('failed to create Protocol' + name,e);
            }
        },
        // translate(title) {
        //     return CrudVars.lang[title]?CrudVars.lang[title]:title;
        // },

        /**
         * ritorna la traduzione della chiave passata presente nel vettore $lang altrimenti ritorna al chiave stessa
         * @param key
         * @param plural
         * @param params
         * @returns {*}
         */
        translate : function (key,context,plural,params) {
            var langKey = context ? context + '.' + key : key
            return this._translate(langKey, plural, params)

            //return this._translate(key,plural,params);
            //return translations_interface._translate.apply(this,[key,plural,params]);
        },

        _translate : function (key,plural,params) {
            let lang = CrudVars.lang;
            //console.log('_translate store',key,lang[key]);
            var testi = lang[key];
            if (!testi)
                return key;
            testi = testi.split('|');
            var testo = (plural && testi.length>1)?testi[1]:testi[0];
            //console.log('testi',testi);
            if (params instanceof Array) {
                for (var i = 0; i < params.length; i++) {
                    testo= testo.replace("(" + i +")", params[i] );
                }
            }
            return testo;
        },


        getDefaultViewConf(modelName,type) {
            let mn = 'Model' + CrudCore.upperCaseFirst(CrudCore.camelCase(modelName));
            let mc = CrudVars.modelConfs[mn] || {};
            console.log('ModelConfs key',mn,mc);
            if (mc[type]) {
                return CrudCore.clone(mc[type]); // TODO mettere il clone
            }
            let dt = CrudVars.viewTypeToViewConf[type];
            if (mc[dt]) {
                return CrudCore.clone(mc[dt]);
            }
            return CrudVars.viewDefaultConfs[type] || {
                modelName : modelName,
                type : type,
            };
        },



        waitStart(msg) {
            console.log('waitStart',msg);
        },
        waitEnd() {

        },
        alertError(msg,cTime) {
            let severity = 'error';
            let severitySummary = 'Error Message'
            if (cTime) {
                this.$toast.add({severity:severity, summary: severitySummary, detail:msg, life: cTime,group:'tr'});
            } else {
                this.$toast.add({severity:severity, summary: severitySummary, detail:msg, group:'tr'});

            }
        },
        alertInfo(msg,cTime) {
            let severity = 'info';
            let severitySummary = 'Info Message'
            if (cTime) {
                this.$toast.add({severity:severity, summary: severitySummary, detail:msg, life: cTime,group:'tr'});
            } else {
                this.$toast.add({severity:severity, summary: severitySummary, detail:msg, group:'tr'});

            }
        },
        alertWarning(msg,cTime) {
            let severity = 'warn';
            let severitySummary = 'Warning Message'
            if (cTime) {
                this.$toast.add({severity:severity, summary: severitySummary, detail:msg, life: cTime,group:'tr'});
            } else {
                this.$toast.add({severity:severity, summary: severitySummary, detail:msg, group:'tr'});

            }
        },
        alertSuccess(msg,cTime) {
            let severity = 'success';
            let severitySummary = 'Success Message'
            if (cTime) {
                this.$toast.add({severity:severity, summary: severitySummary, detail:msg, life: cTime,group:'tr'});
            } else {
                this.$toast.add({severity:severity, summary: severitySummary, detail:msg, group:'tr'});

            }
        },
        messageDialog(msg,props,callbacks) {
            this.__dialog('message',msg,props,callbacks);
        },
        errorDialog(msg,props,callbacks) {
            this.__dialog('error',msg,props,callbacks);
        },
        warningDialog(msg,props,callbacks) {
            this.__dialog('warning',msg,props,callbacks);
        },

        confirmDialog(msg,props,callbacks) {
            this.$confirm.require({
                message: msg,
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    //callback to execute when user confirms the action
                    let cOk = callbacks && callbacks.ok?callbacks.ok:function (){};
                    cOk();
                },
                reject: () => {
                    //callback to execute when user rejects the action
                    let cCancel = callbacks && callbacks.cancel?callbacks.cancel:function (){};
                    cCancel();
                }
            });
        },
        customDialog(msg,props,callbacks) {
            this.__dialog('custom',msg,props,callbacks)
        },

        componentDialog(compName,componentConf,title) {
            const div = document.createElement('div');
            document.body.appendChild(div);
            let  comp = defineAsyncComponent(() => import('./dialogs/dCustom.vue'))
            let d = createApp(comp,{
                conf : {
                    title : title,
                    componentName : compName,
                    componentConf : componentConf,
                    display : true,
                    callbacks : {},
                },
            });
            CrudCore.setupApp(d);
            d.mount(div);
        },

        __dialog(type,msg,props,callbacks) {
            const div = document.createElement('div');
            document.body.appendChild(div);
            callbacks = callbacks || {};
            let comp = null;
            switch (type) {
                case 'message':
                    comp = defineAsyncComponent(() => import('./dialogs/dMessage.vue'))
                    break;
                case 'error':
                    comp = defineAsyncComponent(() => import('./dialogs/dError.vue'))
                    break;
                case 'warning':
                    comp = defineAsyncComponent(() => import('./dialogs/dWarning.vue'))
                    break;
                case 'custom':
                    comp = defineAsyncComponent(() => import('./dialogs/dCustom.vue'))
                    break;
            }
            //let comp = defineAsyncComponent(() => import(componentPath))
            let d = createApp(comp,{
                conf : {
                    message : msg,
                    display : true,
                    callbacks : callbacks,
                },
            });
            d.use(PrimeVue);
            d.mount(div);
        }
    }
}
</script>

<style scoped>

</style>
