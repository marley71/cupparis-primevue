
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
        let toolbar = this.conf.toolbar;
        let keyClass = 'bt_' + Date.now();
        let bt = {};
        bt[keyClass] = 'Custom';
        toolbar.push([bt]);
        let editorConf = {
            showHtml: false,
            headerOptions: [],
            modules : {
                toolbar : this.conf.toolbar
            },
            keyClass : keyClass
        };
        return Object.assign(editorConf,this.conf);
    },
    mounted() {
        let that =this;
        // console.debug('wPrimeEditor',this.value);
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
            // console.debug('saveHtml',event);
            this.value = event;
            this.showHtml = false;
        },
        addHtmlButton() {
            let that = this;
            const customButton = document.querySelector('.ql-' + that.keyClass);
            // console.debug('custom button',customButton);
            const saveButton = document.querySelectorAll('.ssh-pre__copy');

            saveButton.forEach(function (node) {
                node.setAttribute('type','button');
            });

                // setAttribute('type','button');
            // console.debug('save button',saveButton);
            if (customButton) {
                customButton.innerHTML = '<i class="fa-brands fa-html5"></i>'
                customButton.addEventListener('click', () => {
                    // Inserisci qui la logica del tuo bottone
                    // console.log('Il tuo bottone personalizzato è stato cliccato!');
                    that.showHtml = !that.showHtml;
                });
            }
        }
    }
}
</script>

<template src="@templates/widgets/wEditor.html"></template>


<style scoped>

</style>
