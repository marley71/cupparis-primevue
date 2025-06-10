
<template>
  <div class="w-full" style="height:300px">
    <l-map ref="map" v-model:zoom="zoom" :center="[47.41322, -1.219482]" :useGlobalLeaflet="false">
      <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
      ></l-tile-layer>
      <l-marker v-for="(item,index) in markers" :lat-lng="item.latlng" :key="index">
        <l-icon :icon-url="item.icon"  :icon-size="item.size" />
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer,LIcon,LMarker } from "@vue-leaflet/vue-leaflet";
import _wLeafLet from '../../widgets/_wLeafLet.vue'
import RulesErrors from "./RulesErrors.vue";


export default {
    name: "wLeafLet",
    extends : _wLeafLet,
    components: {
        LMap, LTileLayer, LIcon, LMarker
    },
}
</script>

<style scoped>

</style>
