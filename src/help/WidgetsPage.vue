<script>
import widgetHelpConfs from "./widgetHelpConfs";
import JsToCode from "./JsToCode";
import CrudCore from "../lib/CrudCore";
import { getWidgetInheritance } from "./widgetMethodHelp";
const jsc = new JsToCode();

export default {
    name: "WidgetsPage",
    components : {},
    data() {
        let wSel = this.$route.params?(this.$route.params.case || null):null;
        if (wSel) {
            wSel = decodeURI(wSel)
        }
        return {
            widgetSelected : wSel,
            widgetsConf : {
              'w-autocomplete' :              widgetHelpConfs.wAutocompleteConf(),
              'w-autocomplete con aggiunta' : widgetHelpConfs.wAutocompleteAddConf(),
              'w-belongsto':                  widgetHelpConfs.wBelongstoConf(),
              'w-belongsto-many':             widgetHelpConfs.wBelongstoManyConf(),
              'w-checkbox' :                  widgetHelpConfs.wCheckboxConf(),
              'w-chip' :                      widgetHelpConfs.wChipConf(),
              'w-color-picker':               widgetHelpConfs.wColorPickerConf(),
              'w-custom':                     widgetHelpConfs.wCustomConf(),
              'w-date-picker':                widgetHelpConfs.wDatePickerConf(),
              'w-date-range-picker':          widgetHelpConfs.wDateRangePickerConf(),
              'w-date-text':                  widgetHelpConfs.wDateTextConf(),
              'w-date-text2':                 widgetHelpConfs.wDateTextConf2(),
              'w-editor':                     widgetHelpConfs.wEditor(),
              'w-hasmany type record' :       widgetHelpConfs.wHasmany('record'),
              'w-hasmany type list' :         widgetHelpConfs.wHasmany('list'),
              'w-hasmany type view-only' :    widgetHelpConfs.wHasmany('view-only'),
              'w-hasmany type panel' :        widgetHelpConfs.wHasmany('panel'),
              'w-hidden' :                    widgetHelpConfs.wHiddenConf(),
              'w-image' :                     widgetHelpConfs.wImage(),
              'w-image-avatar' :              widgetHelpConfs.wImageAvatarConf(),
              'w-input' :                     widgetHelpConfs.wInputConf(),
              'w-input-set' :                 widgetHelpConfs.wInputSetConf(),
              'w-leaf-let' :                  widgetHelpConfs.wLeafLeft(),
              'w-leaf-let con icona' :        widgetHelpConfs.wLeafLeftIcon(),
              'w-object' :                    widgetHelpConfs.wObject(),
              'w-multi-select':               widgetHelpConfs.wMultiSelectConf(),
              'w-radio' :                     widgetHelpConfs.wRadioConf(),
              'w-select' :                    widgetHelpConfs.wSelectConf(),
              'w-select-button' :             widgetHelpConfs.wSelectButtonConf(),
              'w-table' :                     widgetHelpConfs.wTable(),
              'w-text' :                      widgetHelpConfs.wTextConf(),
              'w-textarea':                   widgetHelpConfs.wTextareaConf(),
              'w-texthtml':                   widgetHelpConfs.wTexthtmlConf(),
              'w-status con icon':            widgetHelpConfs.wStatusConf(),
              'w-status con testo':           widgetHelpConfs.wStatusTextConf(),
              'w-upload' :                    widgetHelpConfs.wUploadConf(),
              'w-upload-ajax' :               widgetHelpConfs.wUploadAjaxConf(),
              'w-swap':                       widgetHelpConfs.wSwapConf(),
              'w-swap-select':                widgetHelpConfs.wSwapSelectConf(),
            },
            fIndex : 0,
            dynamicCode : '',
            originalCode : '',
            copiedKey : '',
            reload : false,
            editor : null,
            codeOpen : false,
            widgetType : '',
            inheritance : getWidgetInheritance(null),
        }
    },
    created() {
        this.setCode();
    },
    mounted() {
        if (this.widgetSelected) {
            this.setCode();
        }
    },
    beforeUnmount() {
        if (this.editor) {
            this.editor.destroy();
            this.editor = null;
        }
    },
    computed: {
        originalRows() {
            let lines = (this.originalCode || '').split('\n').length;
            return Math.min(Math.max(lines + 1, 8), 32);
        },
    },
    watch: {
        widgetSelected() {
            this.setCode();
        }
    },
    methods: {
        changeVue(event) {
            console.debug('changeVue',event);
            CrudCore.alertInfo('changeVue')
        },
        setCode() {
            let that = this;
            let conf = this.widgetsConf[this.widgetSelected];
            if (!conf) {
                that.widgetType = '';
                that.originalCode = '';
                that.inheritance = getWidgetInheritance(null);
                return;
            }
            this.dynamicCode = jsc.getSourceCode(conf);
            this.widgetType = conf.type;
            let defaultConf = jsc.getWidgetDefaultConf(this.widgetType);
            that.originalCode = 'var conf = ' + jsc.getSourceCode(defaultConf);
            that.inheritance = getWidgetInheritance(this.widgetType);
            that.copiedKey = '';
            if (this.editor) {
                this.editor.setValue('var conf = ' + this.dynamicCode);
                this.editor.clearSelection();
            }
        },
        copyCode() {
            let text = this.editor ? this.editor.getValue() : ('var conf = ' + (this.dynamicCode || '{}'));
            this.writeClipboard(text, 'code');
        },
        copyOriginal() {
            this.writeClipboard(this.originalCode || '', 'original');
        },
        writeClipboard(text, key) {
            let that = this;
            let done = function () {
                that.copiedKey = key;
                setTimeout(function () {
                    if (that.copiedKey === key) {
                        that.copiedKey = '';
                    }
                }, 1500);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(done).catch(function () {
                    that.copyFallback(text, done);
                });
                return;
            }
            that.copyFallback(text, done);
        },
        copyFallback(text, done) {
            let el = document.createElement('textarea');
            el.value = text;
            el.setAttribute('readonly', '');
            el.style.position = 'fixed';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            done();
        },
        onCodeShow() {
            let that = this;
            let boot = function () {
                that.$nextTick(function () {
                    setTimeout(function () {
                        let el = document.getElementById('example');
                        if (!el || !window.ace) {
                            return;
                        }
                        if (that.editor) {
                            that.editor.destroy();
                            that.editor = null;
                        }
                        that.editor = window.ace.edit(el, {
                            theme: "ace/theme/textmate",
                            mode: "ace/mode/javascript",
                            value: 'var conf = ' + (that.dynamicCode || '{}'),
                        });
                        that.editor.clearSelection();
                        that.editor.resize();
                    }, 30);
                });
            };
            if (window.ace) {
                boot();
                return;
            }
            jsc.loadVisLib(boot);
        },
        onCodeHide() {
            if (this.editor) {
                this.editor.destroy();
                this.editor = null;
            }
        },
        updateCode() {
            let that = this;
            if (!that.editor) {
                return;
            }
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
            <div class="flex items-center justify-between gap-2 w-full">
                <span>Help widgets</span>
                <Button
                    class="p-button p-button-outlined p-button-sm"
                    icon="fa fa-code"
                    label="Codice"
                    :disabled="!widgetSelected"
                    @click="codeOpen = true"
                ></Button>
            </div>
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
                        <component  :is="conf.type" class="w-full" :ref="wName" v-if="widgetSelected==wName && !reload" :conf="conf" @change="changeVue"></component>
                    </template>
                </Fieldset>

                <div class="inheritance">
                    <template v-for="(name, index) in inheritance.chain" :key="name">
                        <span v-if="index > 0" class="inheritance-arrow" aria-hidden="true">→</span>
                        <span class="inheritance-node">{{ name }}</span>
                    </template>
                </div>
                <Fieldset v-for="group in inheritance.groups" :key="group.file" :legend="'Metodi di ' + group.file" class="component-help">
                    <div v-for="method in group.methods" :key="group.file + method.signature" class="method-row">
                        <code class="method-name">{{ method.signature }}</code>
                        <div v-if="method.description" class="method-desc">{{ method.description }}</div>
                    </div>
                </Fieldset>
            </div>


        </template>
    </Card>

    <Dialog
        v-model:visible="codeOpen"
        :modal="false"
        :draggable="true"
        position="right"
        :header="'Codice ' + widgetType"
        :style="{ width: '42rem', maxWidth: '95vw' }"
        :contentStyle="{ overflow: 'auto', maxHeight: '75vh' }"
        @show="onCodeShow"
        @hide="onCodeHide"
    >
        <div class="font-italic mb-2">Iniziare il codice sempre con var conf = </div>
        <div id="example" class="code-editor w-full"></div>
        <div class="flex items-center gap-2 mt-2">
            <Button class="p-button" label="Run" @click="updateCode"></Button>
            <Button class="p-button p-button-outlined p-button-sm" :label="copiedKey === 'code' ? 'Copiato' : 'Copia'" @click="copyCode"></Button>
        </div>

        <div class="mt-4">
            <div class="flex items-center justify-between gap-2 mb-2">
                <h6 class="m-0">Configurazione originale {{ widgetType }}</h6>
                <Button class="p-button p-button-outlined p-button-sm" :label="copiedKey === 'original' ? 'Copiato' : 'Copia'" @click="copyOriginal"></Button>
            </div>
            <textarea
                ref="originalCodeEl"
                class="code-text"
                readonly
                spellcheck="false"
                wrap="off"
                :rows="originalRows"
                :value="originalCode"
            ></textarea>
        </div>
    </Dialog>
</template>

<style scoped>
:deep(.p-card-title) {
    width: 100%;
}
.code-text {
    width: 100%;
    resize: vertical;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
    line-height: 1.45;
    padding: 10px 12px;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    background: #f7f7f7;
    color: #1f1f1f;
}
.code-editor {
    height: 22rem;
    border: 1px solid #d0d0d0;
}
.inheritance {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.7rem;
}
.inheritance-node {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 4.25rem;
    padding: 0.7rem 1.15rem;
    border-radius: 999px;
    background: #e5f6fd;
    border: 1px solid #b7e3f5;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 1.2;
}
.inheritance-arrow {
    color: #3d8eb0;
    font-size: 1.35rem;
    line-height: 1;
}
.component-help {
    margin-top: 2rem;
}
.component-help :deep(.p-fieldset-legend) {
    background: #e5f6fd;
    border-color: #b7e3f5;
}
.method-row {
    padding: 0.55rem 0;
    border-bottom: 1px solid #e5e7eb;
}
.method-row:last-child {
    border-bottom: 0;
}
.method-name {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.92rem;
    font-weight: 600;
}
.method-desc {
    margin-top: 0.25rem;
    white-space: pre-wrap;
    font-size: 0.875rem;
    line-height: 1.4;
    color: #4b5563;
}
</style>
