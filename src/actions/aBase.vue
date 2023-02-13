<template>
    <template v-if="controlType=='button' && _visible()">
        <Button :title="translate(title)" :label="translate(text)"
                :class=getActionClass()
                :icon="icon"
                v-on:click="_execute($event)" v-bind:disabled="_disabled()"
        />
    </template>
    <template v-else-if="controlType=='link' && _visible()">
        <a class="p-button p-button-outlined" :target="target" :href="_href()"
            :title="translate(title)" :class="css + icon?'p-button-icon':''" :disabled="_disabled()">
            <i class="m-1" v-show="icon" :class="icon"></i>
            <span>{{ translate(text) }}</span>
        </a>
    </template>
    <div v-if="['button','link'].indexOf(controlType) < 0">
        <b>controlType ({{ controlType }}) non riconosciuto</b>
    </div>
</template>

<script>
import CrudComponent from "../CrudComponent.vue";
import Server from "../lib/Server";
import WrapperConf from "./WrapperConf";

export default {
    name: "aBase",
    extends: CrudComponent,
    props: ['conf'],
    created() {
        let that = this;
        //console.log('CREATEDDD',that)
        that.overwriteMethods = {};
        var __call = function (lk) {
            that[lk] = function () {
                var localk = new String(lk);
                return that.overwriteMethods[localk].apply(that, arguments);
            }
        }

        for (let k in that.wConf) {
            //console.log('k',k,ext[k]);

            if (that.wConf[k] instanceof Function) {
                //console.log('found method',k);
                that.overwriteMethods[k] = that.wConf[k];
                __call(k);
            }
        }
        this.Server = Server;
    },
    // mounted() {
    //     let that = this;
    //     if(that.controlType == 'link') {
    //         that.execute();
    //     }   
    // },
    data() {
        let that = this;
        let wc = new WrapperConf();
        let ext = wc.loadConf(that.conf);
        let dt = {};
        for (let k in ext) {
            if (!(ext[k] instanceof Function)) {
                dt[k] = ext[k];
            }
        }
        
        dt.wConf = ext;
        //console.log('widget finalData',dt);
        return dt;
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
            if (that.conf.actionClass) {
                return that.conf.actionClass;
            }
            return that.getButtonSize() + ' '
                + that.getButtonClass() + ' '
                + that.conf.spacing;
        },
        _href() {
            if (this.href instanceof Function) {
                return this.href.apply(this);
            }
            return this.href;
        },
        _visible() {
            //console.log('_visible',this.visible);
            if (this.visible instanceof Function) {
                return this.visible.apply(this);
            }
            return this.visible;
        },
        _disabled() {
            //console.log('_disable',this.enabled);
            if (this.enabled instanceof Function) {
                return !this.enabled.apply(this);
            }
            return !this.enabled;
        },
        _execute(event) {
            if (this.execute) {
                return this.execute(event);
            }
            alert('execute non definita')
        },
        setEnabled(value) {
            this.enabled = value;
        },
        setVisible(value) {
            this.visible = value;
        }
    }
}
</script>

<style scoped>

</style>
