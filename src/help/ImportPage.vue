<template>
    <div>
        <div class="w-full">
            <template v-for="(conf,wName) in importsConf" :key="wName">
                <!--                        <a class="p-button m-1 p-1 p-button-outlined" href="javascript:void(0)" @click="wSelected=wName">{{ wName }}</a>-->
                <a class="p-button m-1 p-2" :class="importSelected===wName?'':'p-button-outlined'" :href="'#/test2-import/'+wName" >{{ wName }}</a>
            </template>
        </div>
        <div class="w-full mt-3">
<!--            <c-import :conf="importConf" v-if="!reload"></c-import>-->
            <c-import v-if="!reload && importSelected" :conf="importConf" ></c-import>
        </div>
        <div class="w-full">
            <div class="">
                <Button class="p-button w-20 mt-1 p-button-success" label="Run" @click="updateCode"></Button>
                <hr />
                <div class="grid grid-cols-2">
                    <div class="">
                        <h6>Configurazione import {{importSelected}}</h6>
                        <div class="font-italic">Iniziare il codice sempre con var conf = </div>
                        <div id='example' class="h-40 w-full">

                        </div>
                    </div>
                    <div class="">
                        <h6>Configurazione di default <span class="font-bold">{{ importSelected }}</span></h6>
                        <div id="defaultCode" class="h-40 w-full">

                        </div>
                    </div>
                </div>
                <div v-if="importSelected" class="grid mt-5">
                    <h5>codice</h5>
                    <pre v-html="getCodeJs()"></pre>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DCupGeoComune from './DCupGeoComune.js';
import cImport from '@templates/app/cImport.vue';
import JsToCode from "./JsToCode";
import importHelpConfs from "./importHelpConfs";
const jsc = new JsToCode();

export default {
  name: "TestImport",
    components: {cImport},
    // watch: {
    //     importSelected() {
    //         this.setCode();
    //     }
    // },
    data() {
      console.log('configuration',DCupGeoComune)

      return {
          importSelected : null,
          importsConf : {
              'semplice' : importHelpConfs.semplice(),
              'con dati aggiuntivi' : importHelpConfs.con_parametri(),
              'con template info html' : importHelpConfs.con_html(),
          },
          importConf : null,
          dynamicCode : '',
          editor : null,
          editorDefault : null,
          reload : false,
      }
    },
    mounted() {
        let that = this;
        setTimeout(function() {
            jsc.loadVisLib(function (error) {

                console.debug('error',error,document.getElementById('example'));
                if (!error) {
                    that.editor = window.ace.edit("example", {
                        theme: "ace/theme/textmate",
                        mode: "ace/mode/javascript",
                        value: 'var conf = {}',
                    });
                    that.editorDefault = window.ace.edit("defaultCode", {
                        theme: "ace/theme/textmate",
                        mode: "ace/mode/javascript",
                        value: 'var conf = {}',
                    });
                }

                let wSel = that.$route.params?(that.$route.params.case || null):null;
                if (wSel) {
                    wSel = decodeURI(wSel)
                    that.importSelected = wSel;
                    that.importConf = that.importsConf[wSel];
                    that.setCode();
                }

            })

        },200)

    },
    methods : {
        setCode() {
            let that = this;
            this.dynamicCode =  jsc.getSourceCode(that.importConf); //this.viewsConf[this.widgetSelected];
            //console.debug('connnnfff',this.editor,this.editorDefault,this.dynamicCode);
            if (this.editor) {
                this.editor.setValue('var conf = ' + this.dynamicCode);
            }

            // this.importSelected = that.viewsConf[that.vSelected].type;
            // let defaultConf = jsc.getViewDefaultConf(this.importSelected);
            // that.defaultCode = jsc.getSourceCode(defaultConf);
            // if (this.editorDefault) {
            //     that.editorDefault.setValue('var conf = ' + that.defaultCode)
            // }
        },
        getCodeJs() {
            let code = this.importsConf[this.importSelected];
            return jsc.getSourceCode(code);
        },
        updateCode() {
            let that = this;
            let s = that.editor.getValue();
            let fName = jsc.updateCode(s);
            that.reload = true;
            setTimeout(function () {
                try {
                    that.importConf = window[fName]();
                    that.reload = false;
                } catch(e) {
                    that.errorDialog(e);
                    throw e;
                }

            },20)
        }
    }
}
</script>

<style scoped>

</style>
