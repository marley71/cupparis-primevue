<script>
import manageConfs from "./manageConfs";
import JsToCode from "./JsToCode";
import { getManageInheritance } from "./componentMethodHelp";
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
            originalCode : '',
            copiedKey : '',
            reload : false,
            editor : null,
            codeOpen : false,
            confReady : false,
            inheritance : getManageInheritance(),
            manageLabels : {
                'constraint' : 'Manage con Constraint',
                'semplice' : 'Semplice',
                'm2' : 'Edit Insert Custom',
                'm3' : 'List Custom',
                'm4' : 'Custom Componente e azione'
            },
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
                    that.mConf.constraint = conf;
                    that.setCode();
                    that.confReady = true;
                })
        }
    },
    beforeUnmount() {
        this.onCodeHide();
    },
    methods: {
        toggleHelp(event) {
            this.$refs.oHelp.toggle(event);
        },
        setCode() {
            let that = this;
            let conf = this.mConf[this.manageSelected];
            this.dynamicCode = conf ? jsc.getSourceCode(conf) : '';
            let defaultConf = jsc.getManageDefaultConf();
            that.originalCode = 'var conf = ' + jsc.getSourceCode(defaultConf);
            that.copiedKey = '';
            if (this.editor) {
                this.editor.setValue('var conf = ' + (this.dynamicCode || '{}'));
                this.editor.clearSelection();
            }
        },
        onCodeShow() {
            let that = this;
            let boot = function () {
                that.$nextTick(function () {
                    setTimeout(function () {
                        let el = document.getElementById('manageExample');
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
                    //that.mConf[that.manageSelected] = window[fName]();
                    that.reload = false;
                } catch (e) {
                    console.debug('funzione chiamata', fName, window[fName]);
                    that.errorDialog(e);
                    throw e;
                }
            }, 20)
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

<template>
    <Card class="w-full">
        <template #title>
            <div class="flex items-center justify-between gap-2 w-full">
                <span><i class="fa fa-question-circle cursor-pointer mr-3" @click="toggleHelp"></i>Help Manages</span>
                <Button
                    class="p-button p-button-outlined p-button-sm"
                    icon="fa fa-code"
                    label="Codice"
                    :disabled="!manageSelected"
                    @click="codeOpen = true"
                ></Button>
            </div>
        </template>
        <template #content>
            <div class="w-full">
                <template v-for="(conf,wName) in mConf" :key="wName">
                    <router-link class="p-button m-1 p-2" :class="manageSelected===wName?'':'p-button-outlined'" :to="'/test2-manage/'+wName" >
                        {{ manageLabels[wName] }}
                    </router-link>
                </template>
            </div>
            <hr />
            <Fieldset legend="Area Manage">
                <template v-for="(conf,wName) in mConf" :key="wName">
                    <c-manage v-if="confReady && manageSelected==wName && !reload" :conf="conf" ></c-manage>
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

    <Dialog
        v-model:visible="codeOpen"
        :modal="false"
        :draggable="true"
        position="right"
        header="Codice manage"
        :style="{ width: '42rem', maxWidth: '95vw' }"
        :contentStyle="{ overflow: 'auto', maxHeight: '75vh' }"
        @show="onCodeShow"
        @hide="onCodeHide"
    >
        <div class="font-italic mb-2">Iniziare il codice sempre con var conf = </div>
        <div id="manageExample" class="code-editor w-full"></div>
        <div class="flex items-center gap-2 mt-2">
            <Button class="p-button" label="Run" @click="updateCode"></Button>
            <Button class="p-button p-button-outlined p-button-sm" :label="copiedKey === 'code' ? 'Copiato' : 'Copia'" @click="copyCode"></Button>
        </div>

        <div class="mt-4">
            <div class="flex items-center justify-between gap-2 mb-2">
                <h6 class="m-0">Configurazione originale</h6>
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
