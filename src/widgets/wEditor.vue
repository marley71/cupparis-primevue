
<script>

import Editor from 'primevue/editor';
import wBase from "./wBase.vue"
import SshPre from 'simple-syntax-highlighter'
import 'simple-syntax-highlighter/dist/sshpre.css'

export default {
    name: 'wEditor',
    extends : wBase,
    components : {Editor,SshPre},
    data() {
        console.debug('wBase',this.conf);

        let editorConf = {
            showHtml: false,
            headerOptions: [],
            modules : {
                toolbar : this.conf.toolbar
            }
        };
        return Object.assign(editorConf,this.conf);
    },
    mounted() {
        let that =this;
        console.debug('wPrimeEditor',this.value);
        setTimeout(function () {
            that.addCustomButton();
        },1000)
    },
    methods: {
        addCustomButton() {
            // let that = this;
            // const customButton = document.querySelector('.ql-your-custom-button');
            // console.debug('custom button',customButton);
            // if (customButton) {
            //     customButton.innerHTML = 'cc'
            //     customButton.addEventListener('click', () => {
            //         // Inserisci qui la logica del tuo bottone
            //         console.log('Il tuo bottone personalizzato è stato cliccato!');
            //         that.showHtml = !that.showHtml;
            //     });
            // }
        },
        saveHtml(event) {
            console.debug('saveHtml',event);
            this.value = event;
            this.showHtml = false;
        },
        addHtmlButton() {
            let that = this;
            const customButton = document.querySelector('.ql-your-custom-button');
            console.debug('custom button',customButton);
            if (customButton) {
                customButton.innerHTML = '<i class="fa-brands fa-html5"></i>'
                customButton.addEventListener('click', () => {
                    // Inserisci qui la logica del tuo bottone
                    console.log('Il tuo bottone personalizzato è stato cliccato!');
                    that.showHtml = !that.showHtml;
                });
            }
        }
    }
}
</script>

<template>
    <input type="hidden" :name="name" v-model="value"/>
    <Editor v-show="!showHtml" v-model="value" :modules="modules"
            :placeholder="placeholder"
            @text-change="_change" editorStyle="height: 320px" @load="addHtmlButton">
        <template #toolbar>
            <div></div> <!-- mi serve per nascondere la toolbar di default -->
        </template>
        {{value}}
    </Editor>
    <div v-show="showHtml">
        <ssh-pre language="html" label="Sorgente Html" :editable="true" :copy-button="true" @copied="saveHtml" style="height: 320px">
            <template #copy-button>
                Salva
            </template>
            <div class="mt-5">
                {{value}}
            </div>
        </ssh-pre>

    </div>
</template>

<style scoped>

</style>
