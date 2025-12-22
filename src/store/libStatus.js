import {defineStore} from "pinia";

export const libStatus = defineStore('libStatus', {

    state: () => {
        return {
            advancedSearchActive : {
                //'cup_anag_anagrafica' : false,
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
