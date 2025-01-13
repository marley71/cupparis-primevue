<script>

import manageConfs from "./manageConfs";
import JsToCode from "./JsToCode";

const jsc = new JsToCode();

export default {
    name: "ManagePage",
    data() {
        let wSel = this.$route.params?(this.$route.params.case || null):null;
        if (wSel) {
            wSel = decodeURI(wSel)
        }
        return {
            selectedManage: {
                name: 'Semplice', code: 'simple'
            },

            manageSelected : wSel,
            manageConf : {
                'm1' :            manageConfs.m1(),
                'm2' :            manageConfs.m2(),
                'm3' :             manageConfs.m3(),
                'm4' :            manageConfs.m4(),
            },
            editor : null,
            editorDefault : null,
            manages: [
                {
                    name: 'Semplice', code: 'simple'
                },
                {
                    name: 'Edit Insert Custom', code: 'edit_insert'
                },
                {
                    name: 'List Custom', code: 'list'
                },
                {
                    name: 'Custom componente e azione', code: 'custom'
                }
            ]
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
                that.editorDefault = ace.edit("defaultCode", {
                    theme: "ace/theme/textmate",
                    mode: "ace/mode/javascript",
                    value: 'var conf = {}',
                });
                if (that.widgetSelected) {
                    that.setCode();
                }
            })

        },200)

    },
    watch: {
        widgetSelected() {
            this.setCode();
        }
    },
    methods: {
        setCode() {
            let that = this;
            let conf = this.widgetsConf[this.widgetSelected];
            this.dynamicCode = jsc.getSourceCode(conf); //this.widgetsConf[this.widgetSelected];
            if (this.editor) {
                this.editor.setValue('var conf = ' + this.dynamicCode);
            }

            this.widgetType = that.widgetsConf[that.widgetSelected].type;
            let defaultConf = jsc.getWidgetDefaultConf(this.widgetType);
            that.defaultCode = jsc.getSourceCode(defaultConf);
            if (this.editorDefault) {
                that.editorDefault.setValue('var conf = ' + that.defaultCode)
            }
        },
        updateCode() {
            let that = this;
            let s = that.editor.getValue();
            let fName = jsc.updateCode(s);
            that.reload = true;
            setTimeout(function () {
                try {
                    that.widgetsConf[that.widgetSelected] = window[fName]();
                    that.reload = false;
                } catch (e) {
                    console.debug('funzione chiamata', fName, window[fName]);
                    that.errorDialog(e);
                    throw e;
                }

            }, 20)


        },
    }
}
</script>

<template>
    <Card class="w-full">
        <template #title>
            Help Manages
        </template>
        <template #content>
            <div>
                <template v-for="(conf,wName) in manageConf" :key="wName">
                    <!--                        <a class="p-button m-1 p-1 p-button-outlined" href="javascript:void(0)" @click="wSelected=wName">{{ wName }}</a>-->
                    <a class="p-button m-1 p-2" :class="manageSelected===wName?'':'p-button-outlined'" :href="'#/test2-manage/'+wName" >{{ wName }}</a>
                </template>
            </div>
            <hr />

            <div >

                <Fieldset legend="Area Widget">
                    <template v-for="(conf,wName) in widgetsConf" :key="wName">
                        <c-widget class="w-full" :ref="wName" v-if="widgetSelected==wName && !reload" :conf="conf"></c-widget>
                    </template>
                </Fieldset>
                <Button class="p-button w-4 mt-1" label="Run" @click="updateCode"></Button>
                <hr />
                <div class="grid">
                    <div class="col-6">
                        <h6>Configurazione Manage</h6>
                        <div class="font-italic">Iniziare il codice sempre con var conf = </div>
                        <div id='example' class="h-20rem w-full">

                        </div>
                    </div>
                    <div class="col-6">
                        <h6>Configurazione di default</h6>
                        <div id="defaultCode" class="h-20rem w-full">

                        </div>
                    </div>
                </div>
            </div>


        </template>
    </Card>

<!--    <div class="grid">-->
<!--        <div class="col-12">-->
<!--            <div class="card">-->
<!--                <h5>Esempi di Manage</h5>-->
<!--                <SelectButton v-model="selectedManage" :options="manages" optionLabel="name" />-->
<!--                <hr>-->
<!--                <div v-if="selectedManage.code == 'simple'">-->
<!--                    <h6>Manage con configurazione di default</h6>-->
<!--                    <c-manage  :conf="m1()"></c-manage>-->
<!--                </div>-->
<!--                <div v-if="selectedManage.code == 'edit_insert'">-->
<!--                    <h6>Manage con insert e edit custom</h6>-->
<!--                    <c-manage  :conf="m2()"></c-manage>-->
<!--                </div>-->
<!--                <div v-if="selectedManage.code == 'list'">-->
<!--                    <h6>Manage con lista custom</h6>-->
<!--                    <c-manage  :conf="m3()"></c-manage>-->
<!--                </div>-->
<!--                <div v-if="selectedManage.code == 'custom'">-->
<!--                    <h6>Manage con azione custom e componente custom</h6>-->
<!--                    <c-manage  :conf="m4()"></c-manage>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
<!--    </div>-->
</template>

<style scoped>

</style>
