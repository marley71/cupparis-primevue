<script>
import JsToCode from "./JsToCode";
import viewHelpConfs from "./viewHelpConfs";
import CrudCore from "../lib/CrudCore";
const jsc = new JsToCode();

export default {
    name: "ViewsPage",
    inject: ['store'],
    data() {
        console.debug('route params',this.$route.params)
        let wSel = this.$route.params?(this.$route.params.case || null):null;
        if (wSel) {
            wSel = decodeURI(wSel)
        }
        return {
            vSelected:wSel,
            viewsConf : {
                'lista statica' :           viewHelpConfs.staticList(),
                'record statico' :          viewHelpConfs.staticRecord(),
                'user list' :               viewHelpConfs.userList(),
                'list edit' :               viewHelpConfs.listEdit(),
                'user view' :               viewHelpConfs.userView(),
                'user edit' :               viewHelpConfs.userEdit(),
                'user edit validate js':    viewHelpConfs.userEditValidate(),
                'user search' :             viewHelpConfs.userSearch(),
                'lista con panel' :         viewHelpConfs.userListPanel(),
                'lista hide column' :       viewHelpConfs.userListHideColumn(),
                'lista action select' :     viewHelpConfs.userListActionSelect(),
                'lista con azione doppia' : viewHelpConfs.userListTwoAction(),
            },
            viewType : '',
            reload : false,
            editor : null,
            editorDefault : null,
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
                if (that.vSelected ) {
                    that.setCode();
                }
            })
        },200)

    },
    watch: {
        vSelected() {
            this.setCode();
        }
    },
    methods:{
        setCode() {
            let that = this;
            let conf = this.viewsConf[this.vSelected];
            this.dynamicCode =  jsc.getSourceCode(conf); //this.viewsConf[this.widgetSelected];
            //console.debug('connnnfff',this.editor,this.editorDefault,this.dynamicCode);
            if (this.editor) {
                this.editor.setValue('var conf = ' + this.dynamicCode);
            }

            this.viewType = that.viewsConf[that.vSelected].type;
            let defaultConf = jsc.getViewDefaultConf(this.viewType);
            that.defaultCode = jsc.getSourceCode(defaultConf);
            if (this.editorDefault) {
                that.editorDefault.setValue('var conf = ' + that.defaultCode)
            }
        },
        getCodeJs() {
            let code = this.viewsConf[this.vSelected];
            return jsc.getSourceCode(code);
        },
        updateCode() {
            let that = this;
            let s = that.editor.getValue();
            let fName = jsc.updateCode(s);
            that.reload = true;
            console.debug('fName',fName)
            setTimeout(function () {
                try {
                    that.viewsConf[that.vSelected] = window[fName]();
                    that.reload = false;
                } catch(e) {
                    CrudCore.errorDialog(e);
                    throw e;
                }

            },20)

        },
    }
}
</script>

<template>
    <Card class="w-full">
        <template #title>
            Help views
        </template>
        <template #content>
            <div class="w-full">
                <template  v-for="(conf,wName) in viewsConf" :key="wName">
                    <!-- <button class="p-button w-full m-1" type="button" v-on:click="vSelected=wName">{{wName}}</button> -->
                    <!--                        <a class="p-button m-1 p-2" :class="vSelected===wName?'':'p-button-outlined'" href="javascript:void(0)" @click="wSelected=wName">{{ wName }}</a>-->
                    <a class="p-button m-1 p-2" :class="vSelected===wName?'':'p-button-outlined'" :href="'#/test2-views/'+wName" >{{ wName }}</a>
                </template>
            </div>
            <div class="grid grid-cols-1 overflow-auto">
                <div class="">
                    <Fieldset class=""  legend="Area View">
                        <div class="w-full">
                            <template v-for="(conf,wName) in viewsConf" :key="wName">
                                <div class="">
                                    <component :is="conf.type" class="w-full" v-if="vSelected==wName && !reload" :conf="conf"></component>
                                </div>
                            </template>
                        </div>
                    </Fieldset>
                </div>
            </div>
            <div class="grid grid-cols-1 ">
                <div class="">
                    <Button class="p-button w-20 mt-1 p-button-success" label="Run" @click="updateCode"></Button>
                    <hr />
                    <div class="grid grid-cols-2">
                        <div class="">
                            <h6>Configurazione View {{ vSelected }}</h6>
                            <div class="font-italic">Iniziare il codice sempre con var conf = </div>
                            <div id='example' class="h-40 w-full">

                            </div>
                        </div>
                        <div class="">
                            <h6>Configurazione di default {{ viewType }}</h6>
                            <div id="defaultCode" class="h-40 w-full">

                            </div>
                        </div>
                    </div>
                    <div v-if="vSelected" class="grid mt-5">
                        <h5>codice</h5>
                        <pre v-html="getCodeJs()"></pre>
                    </div>
                </div>
            </div>
        </template>
    </Card>
</template>

<style scoped>

</style>
