<template>
    <div>
        <input type="hidden" :name=getFieldName() :value="value">
        <Dropdown class="w-full" :name=getFieldName() v-model="value" :options="options"
                  option-label="label" option-value="id" :placeholder="placeholder || translate('app.seleziona')"
                   @change="swap()" v-bind="extraBind">
            <template #option="slotProps">
                <div
                    :class="'select-button-option select-button-option-'+name+ ' select-button-option-'+name+'-'+slotProps.option.id"
                    v-html="slotProps.option.label">
                </div>
            </template>
        </Dropdown>
    </div>
</template>

<script>
import Server from "../lib/Server";
import CrudComponent from "../CrudComponent.vue";

export default {
    name: "wSwapSelect",
    extends: CrudComponent,

    props: {
        //modelValue: String,
        conf: Object,
    },
    data() {
        return Object.assign({
            options : this.conf.options,
            placeholder : this.conf.placeholder,
            extraBind : this.conf.extraBind,

        },this.conf);

    },
    methods: {
        _ready() {

        },
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
    }
}
</script>

<style scoped>

</style>
