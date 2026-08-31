
<script>

import _wBase from "./_wBase.vue"

export default {
    name: '_wEditor',
    extends : _wBase,
    data() {
        let rData = this._loadReactiveData(this.conf)


        let toolbar = rData.toolbar;
        let keyClass = 'bt_' + Date.now();
        let bt = {};
        bt[keyClass] = 'Custom';
        toolbar.push([bt]);
        let editorConf = {
            showHtml: false,
            headerOptions: [],
            modules : {
                toolbar : toolbar
            },
            keyClass : keyClass
        };
        return Object.assign(editorConf,rData);
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
                customButton.innerHTML = '<i class="fab fa-html5"></i>'
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
