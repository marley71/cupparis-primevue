<template>
    <div>
        <input :name="getFieldName()" type="hidden" :value="toggleValue?1:0">
        <InputSwitch v-model="toggleValue" @change="swap()" :disabled="extraBind.disabled?true:false"/>
    </div>
</template>

<script>
import Server from "../lib/Server";
import CrudComponent from "../CrudComponent.vue";

export default {
    name: "wSwap",
    extends: CrudComponent,
    props: {
        //modelValue: String,
        conf : Object,
    },
    data () {
        //console.log('VALUE',this.conf.value);
        return Object.assign({
            toggleValue : this.conf.value?true:false,
        },this.conf);
    },
    methods: {
        _ready() {
            var that = this;
            var keys = Object.keys(that.domainValues);
            that.currentIndex = keys.indexOf(''+that.value);
            that.toggleActive = that.currentIndex?true:false;
            //console.log('index e toggle ',that.currentIndex,that.toggleActive,keys,that.value,that.domainValues);
        },
        setRouteValues: function (route) {
            var that = this;
            route.setValues({
                modelName: that.modelName,
            });
            route.setParams({
                id: that.modelData.id,
                field: that.name,
                value: that.toggleValue?1:0,
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
                    that.value = that.toggleValue?1:0;
                    that.change();
                })
            } else {
                that.value = that.toggleValue?1:0;
                that.change();
            }

        },
        swap(event) {
            var that = this;
            console.log('event',event)
            // event.preventDefault();
            that._swap();
        },
        /**
         * sposta l'indice di uno e restituisce il valore successivo
         * @private
         */
        _getNext() {
            var that = this;
            window.SW = this;
            var keys = Object.keys(that.domainValues);
            var newIndex = (that.currentIndex + 1) % keys.length;
            //console.log('_getNext','value',keys[newIndex], 'index', newIndex);
            that.currentIndex = newIndex;
            return keys[newIndex];
        },

        getFieldName() {
            return this.name;
        },
        getValue() {
            return this.value;
        },
    }
}
</script>

<style scoped>

</style>
