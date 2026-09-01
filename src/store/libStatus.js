import {defineStore} from "pinia";

export const libStatus = defineStore('libStatus', {

    state: () => {
        return {
            advancedSearchActive : {
                //'cup_anag_anagrafica' : false,
            },
            aiSearchActive : {
                //'unico_anagrafica' : false,
            }
        }
    },
    actions : {
        clear() {
            this.advancedSearchActive = {}
        }
    },
    persist : true,
})
