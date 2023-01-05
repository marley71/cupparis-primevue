<script>
import CrudComponent from "../CrudComponent.vue";
import Server from "../lib/Server";
import WrapperConf from "../views/WrapperConf";

export default {
    name: "vBase",
    extends: CrudComponent,
    props: ['conf'],
    created() {
        let that = this;
        var __call = function (lk) {
            that[lk] = function () {
                var localk = new String(lk);
                return that.__methods[localk].apply(that, arguments);
            }
        }
        for (let k in that.__methods) {
            __call(k);
        }
        that.Server = Server;
    },
    data() {
        let that = this;
        let dt = {
            __methods:{}
        };
        let wc = new WrapperConf(that);
        let ext = wc.loadConf(that.conf);
        for (let k in ext) {
            if (!(ext[k] instanceof Function) ) {
                dt[k] = ext[k];
            } else {
                dt.__methods[k] = ext[k];
            }
        }
        console.log('view Props',dt);
        return dt;
    },
    methods : {
        draw() {
            this.setActions();
            this.loaded = true;
        },

        setActions() {

        },
        load() {
            let that = this;
            that.setRouteValues();
            that.beforeLoadData();
            that.loadData(function (json) {
                that.json = json;
                that.fillData(json);
                that.afterLoadData(json);
                that.setWidgetsConfig();
                that.draw();
            });
        },

        reload() {
            let that = this;
            that.loaded = false;
            that.load();
        },

        setRouteValues() {
            let that = this;
            if (!that.routeName)
                return ;
            if (!that.route) {
                that.route = that.createRoute(that.routeName);
            }
            that.route.setValuesFromObj(that);
        },
        beforeLoadData() {

        },

        loadData(callback) {
            let that = this;
            if (!that.route) {
                callback({});
                return;
            }
            //console.log('fetchData',route.getConf());
            Server.route(that.route, function (json) {
                if (json.error) {
                    //that.errorDialog(json.msg).show();
                    that.alertError(json.msg,3000);
                    that.errorMsg = json.msg;
                    return
                }
                //that.afterLoadData(json);
                callback(json);
            })
        },
        afterLoadData() {

        },

        /**
         * riempe la view con i dati che arrivano dalla chiamata ajax della route
         * attraverso il protocollo definito nella route
         * @param route
         * @param json
         */
        fillData: function (json) {
            var that = this;
            if (that.route) {
                var protocol = that.createProtocol(that.route.getProtocol());
                console.log('fillData',json);
                protocol.jsonToData(json);
                var prop = Object.getOwnPropertyNames(protocol);
                for (var i in prop) {
                    that[prop[i]] = protocol[prop[i]];
                }
            }
            that.json = json;
        },

        setParams(params) {
            console.log('route set params',params);
            this.route.setParams(params);
            this.reload();
        },
        getFieldName(field) {
            return field;
        },
        getFieldLabel(field) {
            return field;
        },
        instance() {
            return this;
        }
    }
}
</script>

<style scoped>

</style>
