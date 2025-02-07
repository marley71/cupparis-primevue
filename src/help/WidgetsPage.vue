<script>
import widgetConfs from "./widgetConfs";
import JsToCode from "./JsToCode";
const jsc = new JsToCode();

export default {
    name: "WidgetsPage",
    data() {
        let wSel = this.$route.params?(this.$route.params.case || null):null;
        if (wSel) {
            wSel = decodeURI(wSel)
        }
        return {
            widgetSelected : wSel,
            widgetsConf : {
                'w-hidden' :            widgetConfs.wHiddenConf(),
                'w-himage' :            widgetConfs.wImage(),
                'w-table' :             widgetConfs.wTable(),
                'w-text' :              widgetConfs.wTextConf(),
                'w-input' :             widgetConfs.wInputConf(),
                'w-input-set' :         widgetConfs.wInputSetConf(),
                'w-select' :            widgetConfs.wSelectConf(),
                'w-select-button' :     widgetConfs.wSelectButtonConf(),
                'w-autocomplete' :      widgetConfs.wAutocompleteConf(),
                'w-checkbox' :          widgetConfs.wCheckboxConf(),
                'w-radio' :             widgetConfs.wRadioConf(),
                'w-hasmany' :           widgetConfs.wHasmany('record'),
                'w-hasmany type list' :      widgetConfs.wHasmany('list'),
                'w-hasmany type view-only' :      widgetConfs.wHasmany('view-only'),
                'w-hasmany type panel' :      widgetConfs.wHasmany('panel'),
                'w-belongsto':          widgetConfs.wBelongstoConf(),
                'w-belongsto-many':     widgetConfs.wBelongstoManyConf(),
                'w-custom':             widgetConfs.wCustomConf(),
                'w-color-picker':       widgetConfs.wColorPickerConf(),
                'w-date-picker':        widgetConfs.wDatePickerConf(),
                'w-date-range-picker':  widgetConfs.wDateRangePickerConf(),
                'w-date-text':          widgetConfs.wDateTextConf(),
                'w-date-text2':         widgetConfs.wDateTextConf2(),
                'w-textarea':           widgetConfs.wTextareaConf(),
                'w-multi-select':       widgetConfs.wMultiSelectConf(),
                'w-swap':               widgetConfs.wSwapConf(),
                'w-swap-select':        widgetConfs.wSwapSelectConf(),
                'w-status con icon':    widgetConfs.wStatusConf(),
                'w-status con testo':   widgetConfs.wStatusTextConf(),
                'w-texthtml':           widgetConfs.wTexthtmlConf(),
                'w-upload' :            widgetConfs.wUploadConf(),
                'w-upload-ajax' :       widgetConfs.wUploadAjaxConf(),
                'w-chip' :              widgetConfs.wChipConf(),
                'w-object' :            widgetConfs.wObject(),
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
            this.dynamicCode =  jsc.getSourceCode(conf); //this.widgetsConf[this.widgetSelected];
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
                } catch(e) {
                    console.debug('funzione chiamata',fName,window[fName]);
                    that.errorDialog(e);
                    throw e;
                }

            },20)



        },
        getWidget(wname) {
            return this.$refs[wname][0].instance();
        },
        makeid(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        },
        aggiornaText() {
            //this.widgetsConf['w-text'].value = this.makeid(10);
            this.widgetsConf['w-text'].value = this.makeid(10);
            //tt.value = this.makeid(10);
            //this.$refs['w-text'].value = this.makeid(10);
            //this.$refs['w-text'].$set('conf',tt);
            //this.$refs['w-text'].setValue(this.makeid(10));
            //console.log('aaa',this.widgetsConf['w-text'])
        },
        addHasmany() {
            let that = this;
            let widget = that.$refs[that.widgetSelected][0];
            let nitem = 1 + parseInt(Math.floor(Math.random() * 10)) % 2;
            console.log('nitem',nitem);

            that.$refs[that.widgetSelected][0].setValue([
                {
                    //id : 3,
                    nome : that.makeid(7),
                    descrizione : that.makeid(23),
                    resource : that.makeid(10)
                },
                {
                    ///id : 4,
                    nome : that.makeid(7),
                    descrizione : that.makeid(23),
                    resource : that.makeid(10)
                },
                {
                    //id : 5,
                    nome : that.makeid(7),
                    descrizione : that.makeid(23),
                    resource : that.makeid(10)
                }
            ])
        },
    }
}
</script>

<template>
    <Card class="w-full">
        <template #title>
            Help widgets
        </template>
        <template #content>
            <div>
                <template v-for="(conf,wName) in widgetsConf" :key="wName">
                    <!--                        <a class="p-button m-1 p-1 p-button-outlined" href="javascript:void(0)" @click="wSelected=wName">{{ wName }}</a>-->
                    <a class="p-button m-1 p-2" :class="widgetSelected===wName?'':'p-button-outlined'" :href="'#/test2-widgets/'+wName" >{{ wName }}</a>
                </template>
            </div>
            <hr />

            <div >
                <template v-if="['w-hasmany','w-hasmany-list'].indexOf(widgetSelected) >= 0">
                    <div><Button icon="fa fa-plus" @click="addHasmany" label="setValue dall'esterno"></Button></div>
                </template>

                <Fieldset legend="Area Widget">
                    <template v-for="(conf,wName) in widgetsConf" :key="wName">
                        <c-widget class="w-full" :ref="wName" v-if="widgetSelected==wName && !reload" :conf="conf"></c-widget>
                    </template>
                </Fieldset>
                <Button class="p-button w-4 mt-1" label="Run" @click="updateCode"></Button>
                <hr />
                <div class="grid">
                    <div class="col-6">
                        <h6>Configurazione Widget {{ widgetType }}</h6>
                        <div class="font-italic">Iniziare il codice sempre con var conf = </div>
                        <div id='example' class="h-20rem w-full">

                        </div>
                    </div>
                    <div class="col-6">
                        <h6>Configurazione di default {{ widgetType }}</h6>
                        <div id="defaultCode" class="h-20rem w-full">

                        </div>
                    </div>
                </div>
            </div>


        </template>
    </Card>
</template>

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
