<template>
    <Card class="w-full">
        <template #title>
            <div class="flex items-center justify-between gap-2 w-full">
                <span>Help dialogs</span>
                <Button
                    class="p-button p-button-outlined p-button-sm"
                    icon="fa fa-code"
                    label="Codice"
                    :disabled="!selectedCommand"
                    @click="codeOpen = true"
                ></Button>
            </div>
        </template>
        <template #content>
            <div>
                <template v-for="(wname,index) in dialogs" :key="index">
                    <a class="p-button p-button-secondary p-2 m-1" :class="isSelected(wname)?'':'p-button-outlined'" type="button" v-on:click="doCmd(wname)">{{ Array.isArray(wname)?wname[0] + ' con ' + wname[1]:wname }}</a>
                </template>
            </div>
            <hr />

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
        :header="'Codice ' + (dialogType || 'dialog')"
        :style="{ width: '42rem', maxWidth: '95vw' }"
        :contentStyle="{ overflow: 'auto', maxHeight: '75vh' }"
        @show="onCodeShow"
        @hide="onCodeHide"
    >
        <div class="font-italic mb-2">Modifica il codice ed esegui</div>
        <div id="dialogExample" class="code-editor w-full"></div>
        <div class="flex items-center gap-2 mt-2">
            <Button class="p-button" label="Run" @click="updateCode"></Button>
            <Button class="p-button p-button-outlined p-button-sm" :label="copiedKey === 'code' ? 'Copiato' : 'Copia'" @click="copyCode"></Button>
        </div>

        <div class="mt-4">
            <div class="flex items-center justify-between gap-2 mb-2">
                <h6 class="m-0">Codice originale</h6>
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

import CrudCore from "../lib/CrudCore";
import CrudComponent from "../CrudComponent.vue";
import JsToCode from "./JsToCode";
import { getDialogInheritance } from "./componentMethodHelp";
const jsc = new JsToCode();

export default {
    name: "TestDialogs",
    extends: CrudComponent,
    inject: ['store'],
    data() {
        return {
            dialogs: [
                'messageDialog',
                'errorDialog',
                'warningDialog',
                'confirmDialog',
                'inputDialog',
                'customDialog',
                ['customDialog','buttons'],
                ['customDialog','fcustom'],
                ['customDialog','vlist'],
                ['customDialog','vinsert'],
                ['customDialog','vview'],
                'infoAlert',
                'warningAlert',
                'errorAlert',
                'successAlert',
                ['successAlert','acustom']
            ],
            dialogType : '',
            selectedCommand : null,
            stringCode : '',
            dynamicCode : '',
            originalCode : '',
            copiedKey : '',
            editor : null,
            codeOpen : false,
            inheritance : getDialogInheritance(null),
        }
    },
    computed: {
        originalRows() {
            let lines = (this.originalCode || '').split('\n').length;
            return Math.min(Math.max(lines + 1, 8), 32);
        },
    },
    beforeUnmount() {
        this.onCodeHide();
    },
    methods: {
        isSelected(wname) {
            if (Array.isArray(wname)) {
                return this.selectedCommand === wname[1];
            }
            return this.selectedCommand === wname;
        },
        doCmd: function (command) {
            var that = this;
            var wConf = '';
            if (Array.isArray(command)) {
                wConf = command[1];
                that.selectedCommand = command[1];
            } else {
                wConf =  CrudCore.camelCase(command) + 'Func';
                that.selectedCommand = command;
            }
            that.inheritance = getDialogInheritance(that.selectedCommand);
            that[wConf]();
        },
        setCode(code) {
            this.dynamicCode = code;
            this.originalCode = code;
            this.stringCode = code;
            this.copiedKey = '';
            if (this.editor) {
                this.editor.setValue(code);
                this.editor.clearSelection();
            }
        },
        onCodeShow() {
            let that = this;
            let boot = function () {
                that.$nextTick(function () {
                    setTimeout(function () {
                        let el = document.getElementById('dialogExample');
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
                            value: that.dynamicCode || that.stringCode || '',
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
                this.dynamicCode = this.editor.getValue();
                this.stringCode = this.dynamicCode;
                this.editor.destroy();
                this.editor = null;
            }
        },
        updateCode() {
            let that = this;
            if (that.editor) {
                let s = that.editor.getValue();
                jsc.updateCode(s);
            }
            setTimeout(function () {
                try {
                    if (that.editor) {
                        let s = that.editor.getValue();
                        eval(jsc.getCodeString(s))
                    } else {
                        eval(that.stringCode)
                    }
                } catch(e) {
                    that.errorDialog(e);
                    throw e;
                }
            },20)
        },
        copyCode() {
            let text = this.editor ? this.editor.getValue() : (this.dynamicCode || this.stringCode || '');
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
        messageDialogFunc() {
            let that = this;
            let jsFunc = "\n\
CrudCore.messageDialog('Dialog generale per messaggi',null,{\n\
    ok : function() {\n\
        this.hide();\n\
        CrudCore.messageDialog('Dialog generale per messaggioosss',{title:'titolo custom'})\n\
    }\n\
})\n\
"
            that.setCode(jsFunc);
            that.dialogType = "messageDialog"
            that.updateCode();
        },
        inputDialogFunc() {
            let that = this;
            let jsFunc = "\n\
CrudCore.inputDialog('Inseririsci un numero',2).then((risposta) => {\n\
        CrudCore.messageDialog('Il numero che hai digitato ' + risposta)\n\
})\n\
"
            that.setCode(jsFunc);
            that.dialogType = "inputDialog"
            that.updateCode();
        },
        errorDialogFunc() {
            let that = this;
let jsFunc = "\n\
CrudCore.errorDialog('Dialog generale di errori',null,{\n\
    ok : function() {\n\
        this.hide();\n\
        CrudCore.errorDialog('Dialog generale di errori',{title:'titolo custom'})\n\
    }\n\
})\n\
";
            that.setCode(jsFunc);
            that.dialogType = "errorDialog";
            that.updateCode();
        },
        warningDialogFunc() {
            let that = this;
            let jsFunc = "\n\
CrudCore.warningDialog('Dialog generale di warning')\n\
";
            that.setCode(jsFunc);
            that.dialogType = "warningDialog";
            that.updateCode();
        },
        confirmDialogFunc() {
            let that = this;
            let jsFunc = "\n\
CrudCore.confirmDialog('Dialog generale di conferma',{},{\n\
    ok : function() {\n\
        alert('ok')\n\
    },\n\
    cancel: function() {\n\
        alert('cancel');\n\
    }\n\
});\n\
";
            that.setCode(jsFunc);
            that.dialogType = "confirmDialog";
            that.updateCode();
        },
        customDialogFunc() {
            let that = this;
            let jsFunc = "\n\
CrudCore.customDialog('Dialog custom con bottoni',{},{\n\
    button1 : function() {\n\
        alert('button1')\n\
    },\n\
    button2: function() {\n\
        alert('button2');\n\
    },\n\
    button3: function() {\n\
        alert('button3');\n\
    }\n\
});\n\
";
            that.setCode(jsFunc);
            that.dialogType = "customDialog Con bottoni";
            that.updateCode();
        },

        fcustom() {
            let that = this;
            let jsFunc = "\n\
CrudCore.customDialog('Dialog custom senza bottoni');\n\
";
            that.setCode(jsFunc);
            that.dialogType = "customDialog no bottoni";
            that.updateCode();
        },

        buttons() {
            let that = this;
            let jsFunc = "\n\
CrudCore.customDialog('Dialog con bottoni customizzabili',{\n\
    buttons : [\n\
        {\n\
            label : 'Bottone1',\n\
            icon : 'pi pi-bitcoin',\n\
            callback : function() {\n\
                alert('yeah')\n\
            },\n\
            css : 'bg-bluegray-600 hover:bg-bluegray-400 border-bluegray-700'\n\
        },\n\
        {\n\
            callback() {\n\
                alert('bt2');\n\
                this.hide();\n\
            }\n\
        }\n\
    ]\n\
});\n\
";
            that.setCode(jsFunc);
            that.dialogType = "customDialog no bottoni";
            that.updateCode();
        },

        vlist() {
            let that = this;
            let jsFunc = "\n\
let cConf = {\n\
    modelName:'user',\n\
    actions:[],\n\
    fields: ['email'],\n\
    type : 'v-list',\n\
}\n\
CrudCore.componentDialog('v-list',cConf);\n\
";
            that.setCode(jsFunc);
            that.dialogType = "componentDialog v-list";
            that.updateCode();
        },
        vinsert() {
            let that = this;
            let jsFunc = "\n\
let cConf = {\n\
    modelName:'user',\n\
    actions:['action-save'],\n\
    fields: ['email','name'],\n\
    fieldsConfig : {\n\
        email : {\n\
            rules : 'required'\n\
        }\n\
    },\n\
    type : 'v-insert',\n\
}\n\
CrudCore.componentDialog('v-insert',cConf);\n\
";
            that.setCode(jsFunc);
            that.dialogType = "componentDialog v-insert";
            that.updateCode();
        },
        vview() {
            let that = this;
            let jsFunc = "\n\
let cConf = {\n\
    modelName:'user',\n\
    actions:[],\n\
    fields: ['email','name'],\n\
    pk : 1,\n\
    type : 'v-view',\n\
}\n\
CrudCore.componentDialog('v-view',cConf);\n\
";
            that.setCode(jsFunc);
            that.dialogType = "componentDialog v-view";
            that.updateCode();
        },
        acustom() {
            let that = this;
            let jsFunc = "\n\
CrudCore.alertSuccess('Alert Succes permanente',0);\n\
";
            that.setCode(jsFunc);
            that.dialogType = "successAlert";
            that.updateCode();
        },

        infoAlertFunc() {
            let that = this;
            let jsFunc = "\n\
CrudCore.alertInfo('Alert',2000);\n\
";
            that.setCode(jsFunc);
            that.dialogType = "infoAlert";
            that.updateCode();
        },
        warningAlertFunc() {
            let that = this;
            let jsFunc = "\n\
CrudCore.alertWarning('Alert warning',2000);\n\
";
            that.setCode(jsFunc);
            that.dialogType = "warningAlert";
            that.updateCode();
        },
        errorAlertFunc() {
            let that = this;
            let jsFunc = "\n\
CrudCore.alertError('Alert error',2000);\n\
";
            that.setCode(jsFunc);
            that.dialogType = "errorAlert";
            that.updateCode();
        },
        successAlertFunc() {
            let that = this;
            let jsFunc = "\n\
CrudCore.alertSuccess('Alert Succes',2000);\n\
";
            that.setCode(jsFunc);
            that.dialogType = "successAlert";
            that.updateCode();
        }
    },
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
