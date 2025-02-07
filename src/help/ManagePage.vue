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
            manageSelected : wSel,
            mConf : {
                'semplice' :  manageConfs.semplice(),
                'm2' :  manageConfs.m2(),
                'm3' :  manageConfs.m3(),
                'm4' :  manageConfs.m4(),
            },
            dynamicCode : '',
            defaultCode : '',
            reload : false,
            editor : null,
            editorDefault : null,
            manageLabels : {
                'semplice' : 'Semplice',
                'm2' : 'Edit Insert Custom',
                'm3' : 'List Custom',
                'm4' : 'Custom Componente e azione'
            },
        }
    },
    mounted() {
        let that = this;
        // setTimeout(function() {
        //     jsc.loadVisLib(function () {
        //         console.debug('OK',document.getElementById('example'));
        //         that.editor = ace.edit("example", {
        //             theme: "ace/theme/textmate",
        //             mode: "ace/mode/javascript",
        //             value: 'var conf = {}',
        //         });
        //         that.editorDefault = ace.edit("defaultCode", {
        //             theme: "ace/theme/textmate",
        //             mode: "ace/mode/javascript",
        //             value: 'var conf = {}',
        //         });
        //         if (that.manageSelected) {
        //             that.setCode();
        //         }
        //     })
        //
        // },200)

    },
    watch: {
        manageSelected() {
            //this.setCode();
        }
    },
    methods: {
        setCode() {
            let that = this;
            let conf = this.mConf[this.manageSelected];
            this.dynamicCode = jsc.getSourceCode(conf); //this.manageConf[this.manageSelected];
            if (this.editor) {
                this.editor.setValue('var conf = ' + this.dynamicCode);
            }

            let defaultConf = jsc.getManageDefaultConf();
            that.defaultCode = jsc.getSourceCode(defaultConf);
            if (this.editorDefault) {
                that.editorDefault.setValue('var conf = ' + that.defaultCode)
            }
        },
        getCodeJs() {
            let code = this.mConf[this.manageSelected];
            return jsc.getSourceCode(code);
        },
        updateCode() {
            let that = this;
            let s = that.editor.getValue();
            let fName = jsc.updateCode(s);
            that.reload = true;
            setTimeout(function () {
                try {
                    console.debug('chiamo',fName);
                    //that.mConf[that.manageSelected] = window[fName]();
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
                <template v-for="(conf,wName) in mConf" :key="wName">
                    <router-link class="p-button m-1 p-2" :class="manageSelected===wName?'':'p-button-outlined'" :to="'/test2-manage/'+wName" >
                        {{ manageLabels[wName] }}
                    </router-link>
                </template>
            </div>
            <hr />

            <div >

                <Fieldset legend="Area Manage">
                    <template v-for="(conf,wName) in mConf" :key="wName">
                        <c-manage v-if="manageSelected==wName && !reload" :conf="conf" ></c-manage>
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
