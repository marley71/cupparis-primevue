<template src="@templates/widgets/wSwapSelect.html">

</template>

<script>
import Server from "../lib/Server";
//import CrudComponent from "../CrudComponent.vue";
import wBase from './wBase.vue';

export default {
    name: "wSwapSelect",
    extends: wBase,

    props: {
        //modelValue: String,
        conf: Object,
    },
    data() {
        return Object.assign({
            options : this.conf.options,
            placeholder : this.conf.placeholder,
            extraBind : this.conf.extraBind,
            reload: this.conf.reload,

        },this.conf);

    },
    methods: {
        setRouteValues: function (route) {
            var that = this;
            route.setValues({
                modelName: that.modelName,
            });
            route.setParams({
                id: that.modelData.id,
                field: that.name,
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
                        that.view.reload();
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
