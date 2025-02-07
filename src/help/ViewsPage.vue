<script>
import cView from "../views/cView.vue";
import JsToCode from "./JsToCode";
import viewConfs from "./viewConfs";
const jsc = new JsToCode();

export default {
    name: "ViewsPage",
    components: {cView},
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
                'lista statica' :           viewConfs.staticList(),
                'record statico' :          viewConfs.staticRecord(),
                'user list' :               viewConfs.userList(),
                'list edit' :               viewConfs.listEdit(),
                'user view' :               viewConfs.userView(),
                'user edit' :               viewConfs.userEdit(),
                'user edit validate js':    viewConfs.userEditValidate(),
                'user search' :             viewConfs.userSearch(),
                'lista con panel' :         viewConfs.userListPanel(),
                'lista hide column' :       viewConfs.userListHideColumn(),
                'lista action select' :     viewConfs.userListActionSelect(),
                'lista con azione doppia' : viewConfs.userListTwoAction(),
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
            setTimeout(function () {
                try {
                    that.viewsConf[that.vSelected] = window[fName]();
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
            <div class="grid overflow-auto">
                <div class="col-12 ">
                    <Fieldset class=""  legend="Area View">
                        <div class="w-full">
                            <template v-for="(conf,wName) in viewsConf" :key="wName">
                                <div class="">
                                    <c-view class="w-full" v-if="vSelected==wName && !reload" :conf="conf"></c-view>
                                </div>
                            </template>
                        </div>
                    </Fieldset>
                </div>
            </div>
            <div class="grid">
                <div class="col-12">
                    <Button class="p-button w-4 mt-1 p-button-success" label="Run" @click="updateCode"></Button>
                    <hr />
                    <div class="grid">
                        <div class="col-6">
                            <h6>Configurazione View {{ vSelected }}</h6>
                            <div class="font-italic">Iniziare il codice sempre con var conf = </div>
                            <div id='example' class="h-20rem w-full">

                            </div>
                        </div>
                        <div class="col-6">
                            <h6>Configurazione di default {{ viewType }}</h6>
                            <div id="defaultCode" class="h-20rem w-full">

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
