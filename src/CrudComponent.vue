<script>

import Route from "./lib/Route";
import CrudCore from "./lib/CrudCore.js";
import {createApp,defineAsyncComponent} from 'vue'
import PrimeVue from "primevue/config";
import routeConfs from "./confs/routes";
import CrudVars from "./lib/CrudVars";

export default {
    name: "CrudComponent",
    props: {
        conf: Object,
    },
    data() {
        return Object.assign({},(this.conf || {}));
    },
    methods: {
        /**
         * istanzia una nuova route a partire dalla configurazione trovata in store
         * @param routeName : nome della configurazione della route
         */
        createRoute : function(routeName) {
            return CrudCore.createRoute(routeName);
            // let routeConf =  JSON.parse(JSON.stringify(routeConfs[routeName]))  //Object.assign({},routeConfs[routeName]);
            // console.log('routeName',routeName,routeConf);
            // if (!routeConf)
            //     throw "Impossibile trovare la route " + routeName;
            // return new Route(routeConf);
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
            return CrudCore.translate(langKey, plural, params)
        },

        translateUc : function (key,context,plural,params) {
            var langKey = context ? context + '.' + key : key
            return CrudCore.upperCaseFirst(CrudCore.translate(langKey, plural, params))
        },

        getDefaultViewConf(modelName,type) {
            let mn = 'Model' + CrudCore.upperCaseFirst(CrudCore.camelCase(modelName));
            let mc = CrudVars.modelConfs[mn] || {};
            console.log('ModelConfs key',mn,mc);
            if (mc[type]) {
                return CrudCore.clone(mc[type]); // TODO mettere il clone
            }
            let dt = CrudVars.viewTypeToViewConf[type];
            console.log('ModelConfs.'+modelName+'.'+dt,mc[dt])
            if (mc[dt]) {
                return CrudCore.clone(mc[dt]);
            }
            return CrudVars.viewDefaultConfs[type] || {
                modelName : modelName,
                type : type,
            };
        },

        waitStart(msg) {
            CrudCore.waitStart(msg);
        },
        waitEnd() {
            console.log('waitEnd');
            CrudCore.waitEnd()
        },
        alertError(msg,cTime) {
            CrudCore.alertError(msg,cTime);
        },
        alertInfo(msg,cTime) {
            CrudCore.alertInfo(msg,cTime);
        },
        alertWarning(msg,cTime) {
            CrudCore.alertWarning(msg,cTime);
        },
        alertSuccess(msg,cTime) {
            CrudCore.alertSuccess(msg,cTime);
        },
        messageDialog(msg,props,callbacks) {
            CrudCore.messageDialog(msg,props,callbacks);
        },
        errorDialog(msg,props,callbacks) {
            CrudCore.errorDialog(msg,props,callbacks);
        },
        warningDialog(msg,props,callbacks) {
            CrudCore.warningDialog(msg,props,callbacks);
        },

        confirmDialog(msg,props,callbacks) {
            CrudCore.confirmDialog(msg,props,callbacks);
        },
        customDialog(msg,props,callbacks) {
            CrudCore.customDialog(msg,props,callbacks);
        },

        componentDialog(compName,componentConf,title,dialogConf) {
            const div = document.createElement('div');
            document.body.appendChild(div);
            let  comp = defineAsyncComponent(() => import('./dialogs/dCustom.vue'))
            dialogConf = dialogConf || {
                title : title,
                display : true,
                callbacks : {},
            };
            let cc = {
                componentName : compName,
                componentConf : componentConf,
            };
            let d = createApp(comp,{
                confComponent : cc,
                conf : dialogConf
            });
            CrudCore.setupApp(d);
            d.mount(div);
            return d;
        },
    }
}
</script>

<style scoped>

</style>
