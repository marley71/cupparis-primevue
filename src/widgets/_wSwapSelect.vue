
<script>
import Server from "../lib/Server";
import _wBase from './_wBase.vue';

export default {
    name: "_wSwapSelect",
    extends: _wBase,

    props: {
        //modelValue: String,
        conf: Object,
    },
    data() {
      let rData = this._loadReactiveData(this.conf);
      //rData.options
        return Object.assign({
            options : rData.options,
            placeholder : rData.placeholder,
            extraBind : rData.extraBind,
            reload: rData.reload,

        },rData);

    },
    methods: {
        setRouteValues: function (route) {
            var that = this;
            route.setValues({
                modelName: that.modelName,
            });
            route.setParams({
                id: that.modelData.id,
                field: that.swapField || that.name,
                value: that.value,
            });
            return route;
        },
        _swap: function () {
            var that = this;
            if (that.isAjax) {
                var r = that.createRoute(that.routeName);
                that.setRouteValues(r);
                that.waitStart()
                Server.route(r, function (json) {
                    that.waitEnd();
                    that.json = json;
                    if (json.error) {
                        that.errorDialog(json.msg);
                        return;
                    }
                    that.change();
                    if (that.reload) {
                        that.viewInstance.reload();
                    }
                })
            } else {
                that.change();
            }

        },
        swap(event) {
            var that = this;
            console.log('event', event)
            // event.preventDefault();
            that._swap();
        },
        /**
         * sposta l'indice di uno e restituisce il valore successivo
         * @private
         */

        getFieldName(key) {
            return key;
        },

        getValue() {
            return this.value;
        },

        setValue(val) {
            let that = this;
            // siccome i valori possono essere diversi prima del check li trasformo in stringa
            let stringValues = that.options.map(a => a.id + "");
            let index = stringValues.indexOf(val + "");
            if (index >= 0) {
                that.value = that.options[index].id
            }

        },
        _disabled(event) {
            if (this.disabled instanceof Function) {
                return this.disabled.apply(this,[event]);
            }
            return this.disabled;
        },
        _labelTop() {
            if (!this.labelTop) {
                return '';
            }
            if (this.labelTop instanceof Function) {
                return this.labelTop.apply(this,[event]);
            }
            return this.labelTop;
        },
        _labelBottom() {
            if (!this.labelBottom) {
                return '';
            }
            if (this.labelBottom instanceof Function) {
                return this.labelBottom.apply(this,[event]);
            }
            return this.labelBottom;
        }
    }
}
</script>

<style scoped>

</style>
