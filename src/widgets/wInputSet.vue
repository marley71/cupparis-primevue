<template>
    <div class="flex">
<!--        <InputText class="w-full" :name="name" :type="inputType" v-model="value" v-bind="extraBind"-->
<!--                   @change="_change" :class="errors.length?'p-invalid':''"></InputText>-->
        <span>{{value}}</span>
        <Button icon="fa fa-edit" class="p-button-sm ml-1 p-1" outlined :disabled="!canUpdate"
                @click="toggle"></Button>
        <OverlayPanel ref="panel" @hide="cancel()">
            <h6>Modifica</h6>
            <div class="my-1 grid w-24rem">
                <span class="mt-1">{{ label }}:</span>
                <InputText v-model="value"/>
                <Button label="Salva" @click="set()"></Button>
            </div>
        </OverlayPanel>
    </div>
</template>

<script>
import Server from "../lib/Server";
import wBase from "./wBase.vue";

export default {
    name: "wInputSet",
    extends: wBase,
    props: {
        conf : Object,
    },
    data () {
        return Object.assign({
            oldValue : this.conf.value,
        },this.conf);
    },
    methods: {

        cancel() {
            this.$refs.panel.hide();
            this.value = this.oldValue;
        },
        toggle(event) {
            this.$refs.panel.toggle(event);
        },
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
                value: that.value
            });
            return route;
        },
        set: function () {
            var that = this;
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
                that.oldValue = that.value;
                //that.value = that.toggleValue?1:0;
                that._change();
            })
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
