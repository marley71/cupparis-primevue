<template>
    <div>
        <div class="flex gap-1 m-5">
            <Button label="prova axios" @click="serverTest"></Button>
            <Button label="Lista con slot ridefinit" @click="showEsperimento='lista-template-custom'"></Button>
            <Button label="Lista con search" @click="showEsperimento='lista-e-search'"></Button>
        </div>
        <v-list v-if="showEsperimento=='lista-template-custom'" :conf="muList">
            <template #header="slotProps">
                <div>
                    header personarle
                    <div v-for="item in slotProps.collectionActions.actions">
                        aaa
                    </div>
                </div>
            </template>
            <template #content="slotProps">
                <div v-for="(val,index) in slotProps.value" :key="index">
                    {{val}}
                </div>
            </template>
            <template #footer>
                footerrr
            </template>
        </v-list>
        <div v-if="showEsperimento=='lista-e-search'">
            <component :is="searchConf.type" :conf="searchConf" @search="searchList"></component>
            <component :is="Mu.list.type" :conf="Mu.list" ref="muList"></component>
        </div>
        <div v-if="showEsperimento=='serverTest'">
            <div>{{dataList}}</div>
        </div>
    </div>
</template>

<script>

//import Mu from '@/data/modelsConfs/app/ModelUser'
// import cupparis from 'cupparis-primevue'
// import _ from 'lodash'
import Mu from './ModelUser';
import CrudCore from "../lib/CrudCore";
import CrudComponent from "../CrudComponent.vue";
import Server from "../lib/Server";

export default {
    name: "Esperimenti",
    extends : CrudComponent,
    data() {
        let muList = CrudCore.clone(Mu.list);  // _.cloneDeep(Mu.list);
        let searchConf = CrudCore.clone(Mu.search);
        searchConf.updateHash = false;
        return  {
            searchConf : searchConf,
            showEsperimento : null,
            muList : muList,
            Mu:Mu,
            dataList : null
        }
    },
    methods:{
        serverTest() {
            this.showEsperimento = "serverTest"
            try {
                console.log(Server.get("/api/foorm/user/search",{},(json) => {
                    this.dataList = json.result
                }))
            } catch (e) {
                console.log(e)
            }
        },
        searchList(event) {
            console.log('searchList',event,this.$refs);
            this.$refs.muList.instance().setParams(event);
        },
    }
}
</script>

<style scoped>

</style>

