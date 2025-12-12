

<script>
import CrudComponent from "../CrudComponent.vue";

export default {
    name: "_cAction",
    extends: CrudComponent,
    props: {
        'whitelist': Array,
        'blacklist': Array,
        //'menubarTitle': String,
    },
    data() {
        let that = this;
        if (!that.conf) {
            console.warn('cAction conf null', that.conf);
        }
        // Crea una copia per evitare di modificare direttamente conf reattivo
        let cf = Object.assign({}, that.conf || {});
        cf.title = '';
        cf.layout = cf.layout?cf.layout:'buttons';
        // menubarActions verrà calcolato come computed property per evitare problemi di reattività
        return cf;
    },
    computed: {
        menubarActions() {
            if (this.layout === 'menubar') {
                return this.getMenubarActions();
            }
            return null;
        }
    },
    methods: {

        getConf(actionConf, actionKey) {
            var that = this;
            // Crea una copia per evitare di modificare direttamente oggetti reattivi
            let confCopy = Object.assign({}, actionConf);
            confCopy.spacing = that.getSpacing(actionConf, actionKey);
            return confCopy;
        },
        getSpacing(actionConf, actionKey) {
            var that = this;
            if (actionConf.spacing) {
                return actionConf.spacing;
            }
            switch (that.layout) {
                case 'simple':
                    return '';
                case 'buttons':
                    return (actionKey === that.getLastAction())
                        ? '' : 'mr-2';
                default:
                    return '';
            }
        },
        getActions() {
            var that = this;
            //console.log("GETA", that, that.actions);
            if (that.actions) {
                return that.actions;
            }
            return that;
        },

        getWhitelist() {
            var that = this;
            if (!that.whitelist) {

                var whitelist = that.conf.actions
                    ? Object.keys(that.conf.actions)
                    : Object.keys(that.conf);

                if (that.blacklist) {
                    for (var b in that.blacklist) {
                        var index = whitelist.indexOf(that.blacklist[b]);
                        if (index !== -1) {
                            whitelist.splice(index, 1);
                        }
                    }
                }
                //console.log("WHITELIST:::",whitelist);
                return whitelist;

            }
            //console.log("WHITELIST:::",that.whitelist);
            return that.whitelist;
        },
        inWhitelist(key) {
            var that = this;
            var whitelist = that.getWhitelist();
            //console.log("WHITELISTTTT",whitelist,key,whitelist.includes(key))
            return whitelist.includes(key);
        },
        getLastAction() {
            var that = this;
            var whitelist = that.getWhitelist();
            return (whitelist.length === 0) ? '' : whitelist[whitelist.length - 1];
        },
        getFirstAction() {
            var that = this;
            var whitelist = that.getWhitelist();
            return (whitelist.length === 0) ? '' : whitelist[0];
        },
        instance(key) {
            //console.log('actions ref', key, this.$refs, this.$refs[key])
            return this.$refs[key][0];
        },
        getMenubarActions() {
            let that = this;
            let items = [];
            //console.log('actions',that.conf);
            let actions = that.conf.actions;
            for (let name in actions) {
                // Crea una copia dell'oggetto action invece di modificarlo direttamente
                // per evitare loop infiniti di reattività
                let actionCopy = Object.assign({}, actions[name]);
                actionCopy.label = that.translate(actions[name].text);
                actionCopy.action = name;
                actionCopy.actionClass = (actions[name].actionClass?actions[name].actionClass:'');
                actionCopy.actionClass += ' w-full';
                items.push(actionCopy);
            }
            //console.log('menubar', items, that.conf);
            return [{
                label: this.conf.menubarTitle ? this.conf.menubarTitle : this.translate('app.actions'),
                //icon : this.conf.menubarIcon ? this.conf.menubarIcon : 'fa fa-ellipsis-v',
                items: items
            }]
        },
    }
}
</script>

<style scoped>

</style>
