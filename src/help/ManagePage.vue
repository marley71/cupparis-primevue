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
                'constraint' :  null,
            },
            dynamicCode : '',
            defaultCode : '',
            reload : false,
            editor : null,
            editorDefault : null,
            confReady : false, // serve per quelle configurazioni che hanno bisogno di un parametro prima di essere pronte
            manageLabels : {
                'constraint' : 'Manage con Constraint',
                'semplice' : 'Semplice',
                'm2' : 'Edit Insert Custom',
                'm3' : 'List Custom',
                'm4' : 'Custom Componente e azione'
            },
        }
    },
    mounted() {
        let that = this;
        setTimeout(function() {
            jsc.loadVisLib(function (error) {
                console.debug('error',error,document.getElementById('example'));
                if (!error) {
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
                }

                switch (that.manageSelected) {
                    case 'semplice':
                    case 'm2':
                    case 'm3':
                    case 'm4':
                        that.setCode();
                        that.confReady = true;
                        break;
                    case 'constraint':
                        manageConfs.constraint().then((conf) => {
                            that.setCode();
                            that.mConf.constraint = conf;
                            that.confReady = true;
                        })
                }
            })
        },200)
            //manageConfs.constraint()

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
        toggleHelp(event) {
            window.OH = this.$refs;
            this.$refs.oHelp.toggle(event);
        },
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
            <i class="fa fa-question-circle cursor-pointer mr-3" @click="toggleHelp"></i>Help Manages
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
                        <c-manage v-if="confReady && manageSelected==wName && !reload" :conf="conf" ></c-manage>
                    </template>
                </Fieldset>
                <Button class="p-button w-20 mt-1" label="Run" @click="updateCode"></Button>
                <hr />
                <div class="grid grid-cols-2">
                    <div class="">
                        <h6>Configurazione Manage</h6>
                        <div class="font-italic">Iniziare il codice sempre con var conf = </div>
                        <div id='example' class="h-40 w-full">

                        </div>
                    </div>
                    <div class="">
                        <h6>Configurazione di default</h6>
                        <div id="defaultCode" class="h-40 w-full">

                        </div>
                    </div>
                </div>
            </div>

            <Popover ref="oHelp" class="w-2/3">
                <div v-if="manageSelected==='semplice'">
                    <h4 class="text-xl">Semplice</h4>
                    <p>
                        Manage di default permette con configurazione minimale
                    </p>
                </div>
                <div v-if="manageSelected==='m2'">
                    <h4 class="text-xl">Edit Insert Custom</h4>
                    <p>
                        Manage con la ridefinizione della vista insert e/o edit attraverso l'implementazione di una view che poi
                        verrà utilizzata dalla manage in fase di inserimento o modifica.<br> In questo esempio componente che ridefinisce
                        la vista di default si trova nella cartella <span class="text-primary">help/components/InsertEditUser.vue</span> della libreria cupparis-primevue
                    </p>
                </div>
                <div v-if="manageSelected==='m3'">
                    <h4 class="text-xl">List Custom</h4>
                    <p>
                        Manage con la ridefinizione della vista lista attraverso l'implementazione di una view che poi
                        verrà utilizzata dalla manage in fase di visualizzazione degli elementi.<br>
                        In questo esempio componente che ridefinisce
                        la vista di default si trova nella cartella <span class="text-primary">help/components/ListUser.vue</span> della libreria cupparis-primevue
                    </p>
                </div>
                <div v-if="manageSelected==='m4'">
                    <h4 class="text-xl">Custom Componente e azione</h4>
                </div>
                <div v-if="manageSelected==='constraint'">
                    <h4 class="text-xl">Manage con constraint</h4>
                </div>
            </Popover>
        </template>
    </Card>
</template>

<style scoped>

</style>
