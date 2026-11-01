<template>
    <Card class="w-full">
        <template #title>
            <div class="flex items-center justify-between gap-2 w-full">
                <span>Help import</span>
                <Button
                    class="p-button p-button-outlined p-button-sm"
                    icon="fa fa-code"
                    label="Codice"
                    :disabled="!importSelected"
                    @click="codeOpen = true"
                ></Button>
            </div>
        </template>
        <template #content>
            <div class="w-full">
                <template v-for="(conf,wName) in importsConf" :key="wName">
                    <a class="p-button m-1 p-2" :class="importSelected===wName?'':'p-button-outlined'" :href="'#/test2-import/'+wName" >{{ wName }}</a>
                </template>
            </div>
            <hr />
            <Fieldset legend="Area Import">
                <c-import v-if="!reload && importSelected" :conf="importConf" ></c-import>
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
        </template>
    </Card>

    <Dialog
        v-model:visible="codeOpen"
        :modal="false"
        :draggable="true"
        position="right"
        :header="'Codice ' + (importSelected || 'import')"
        :style="{ width: '42rem', maxWidth: '95vw' }"
        :contentStyle="{ overflow: 'auto', maxHeight: '75vh' }"
        @show="onCodeShow"
        @hide="onCodeHide"
    >
        <div class="font-italic mb-2">Iniziare il codice sempre con var conf = </div>
        <div id="importExample" class="code-editor w-full"></div>
        <div class="flex items-center gap-2 mt-2">
            <Button class="p-button" label="Run" @click="updateCode"></Button>
            <Button class="p-button p-button-outlined p-button-sm" :label="copiedKey === 'code' ? 'Copiato' : 'Copia'" @click="copyCode"></Button>
        </div>

        <div class="mt-4">
            <div class="flex items-center justify-between gap-2 mb-2">
                <h6 class="m-0">Configurazione originale {{ importSelected }}</h6>
                <Button class="p-button p-button-outlined p-button-sm" :label="copiedKey === 'original' ? 'Copiato' : 'Copia'" @click="copyOriginal"></Button>
            </div>
            <textarea
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

<script>
import DCupGeoComune from './DCupGeoComune.js';
import cImport from '@templates/app/cImport.vue';
import JsToCode from "./JsToCode";
import importHelpConfs from "./importHelpConfs";
import { getImportInheritance } from "./componentMethodHelp";
const jsc = new JsToCode();

export default {
  name: "TestImport",
    components: {cImport},
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
          originalCode : '',
          copiedKey : '',
          editor : null,
          codeOpen : false,
          reload : false,
          inheritance : getImportInheritance(),
      }
    },
    computed: {
        originalRows() {
            let lines = (this.originalCode || '').split('\n').length;
            return Math.min(Math.max(lines + 1, 8), 32);
        },
    },
    mounted() {
        let that = this;
        let wSel = that.$route.params?(that.$route.params.case || null):null;
        if (wSel) {
            wSel = decodeURI(wSel)
            that.importSelected = wSel;
            that.importConf = that.importsConf[wSel];
            that.setCode();
        }
    },
    beforeUnmount() {
        this.onCodeHide();
    },
    methods : {
        setCode() {
            let that = this;
            if (!that.importConf) {
                that.dynamicCode = '';
                that.originalCode = '';
                return;
            }
            this.dynamicCode = jsc.getSourceCode(that.importConf);
            this.originalCode = 'var conf = ' + this.dynamicCode;
            this.copiedKey = '';
            if (this.editor) {
                this.editor.setValue('var conf = ' + this.dynamicCode);
                this.editor.clearSelection();
            }
        },
        onCodeShow() {
            let that = this;
            let boot = function () {
                that.$nextTick(function () {
                    setTimeout(function () {
                        let el = document.getElementById('importExample');
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
                    that.importConf = window[fName]();
                    that.reload = false;
                } catch(e) {
                    that.errorDialog(e);
                    throw e;
                }
            },20)
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
    }
}
</script>

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
