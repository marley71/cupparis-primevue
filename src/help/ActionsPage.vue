<template>
    <Card>
        <template #title>
            Help Actions
        </template>
        <template #content>
            <div>
                <template v-for="(conf,wName) in actionsConf" :key="wName">
                    <a class="p-button m-1 p-1 p-button-outlined" href="javascript:void(0)" @click="aSelected=wName">{{ wName }}</a>
                </template>
            </div>
            <hr />
            <div >
                <div >
                    <template v-if="['w-hasmany','w-hasmany-list'].indexOf(aSelected) >= 0">
                        <div><Button icon="fa fa-plus" @click="addHasmany" label="setValue dall'esterno"></Button></div>
                    </template>

                    <Fieldset legend="Area Widget">
                        <template class="col-12" v-for="(conf,wName) in actionsConf" :key="wName">
                            <c-action class="w-full" :ref="wName" v-if="aSelected==wName && !reload" :conf="conf" :layout="actionLayout"></c-action>
                        </template>
                    </Fieldset>
                    <Button class="p-button w-4 mt-1" label="Run" @click="updateCode"></Button>
                    <hr />
                    <div class="grid">
                        <div class="col-6">
                            <h6>Configurazione Action {{ widgetType }}</h6>
                            <div class="font-italic">Iniziare il codice sempre con var conf = </div>
                            <div id='example' class="h-20rem w-full">

                            </div>
                        </div>
                        <!--                            <div class="col-6">-->
                        <!--                                <h6>Configurazione di default {{ widgetType }}</h6>-->
                        <!--                                <div id="defaultCode" class="h-20rem w-full">-->

                        <!--                                </div>-->
                        <!--                            </div>-->
                    </div>
                </div>

            </div>
        </template>
    </Card>
</template>

<script>

import JsToCode from "./JsToCode";
import actionConfs from "./actionHelpConfs";
import CrudComponent from "../CrudComponent.vue";
import CrudCore from "../lib/CrudCore";
const jsc = new JsToCode();
export default {
    name: "TestActions",
    extends : CrudComponent,
    data() {
        return {
            aSelected : null,
            actionLayout : 'simple',
            actionsConf : {
                'Action Singola' : actionConfs.actionSingola(),
                'Action default e Ridefinita' : actionConfs.actionDefaultDoppia(),
                'Action custom' : actionConfs.actionCustom()
            },
            fIndex : 0,
            dynamicCode : '',
            defaultCode : '',
            reload : false,
            editor : null,
            editorDefault : null,
            widgetType : '',
        }
    },
    mounted() {
        let that = this;
        setTimeout(function() {
            jsc.loadVisLib(function () {
                console.debug('OK',document.getElementById('example'));
                that.editor = ace.edit("example", {
                    theme: "ace/theme/textmate",
                    mode: "ace/mode/javascript",
                    value: 'var conf = {}',
                });
                // that.editorDefault = ace.edit("defaultCode", {
                //     theme: "ace/theme/textmate",
                //     mode: "ace/mode/javascript",
                //     value: 'var conf = {}',
                // });
            })
        },200)

    },
    watch: {
        aSelected() {
            let that = this;
            let actionSelected =  this.actionsConf[that.aSelected];
            for (let a in actionSelected.actions) {
                let conf = Object.assign({},(actionSelected.actions[a]?actionSelected.actions[a]:{}));
                actionSelected.actions[a] = CrudCore.getActionConf(a, conf);
            }

            console.debug('action conf',that.aSelected,actionSelected)
            this.dynamicCode =  jsc.getSourceCode(actionSelected); //this.actionsConf[this.aSelected];
            if (this.editor) {
                this.editor.setValue('var conf = ' + this.dynamicCode);
            }
            // that.defaultCode = jsc.getSourceCode(actionSelected);
            // if (this.editorDefault) {
            //     that.editorDefault.setValue('var conf = ' + defaultCode)
            // }
        }
    },
    methods:{
        // getConf(wname) {
        //     return this.actionsConf[wname];
        // },

        updateCode() {
            let that = this;
            let s = that.editor.getValue();
            let fName = jsc.updateCode(s);
            that.reload = true;
            setTimeout(function () {
                try {
                    that.actionsConf[that.aSelected] = window[fName]();
                    that.reload = false;
                } catch(e) {
                    that.errorDialog(e);
                    throw e;
                }

            },20)


        },
    }
}
</script>

<style scoped>
textarea {
    width: 100%;
    height: 100%;
    background: #1f1f1f;
    color : #FFFFFF;
    padding: 10px 20px;
    border : 0;
    outline: 0;
    font-size: 12px;
}
</style>
