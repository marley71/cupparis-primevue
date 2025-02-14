<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer,LIcon,LMarker } from "@vue-leaflet/vue-leaflet";
import wBase from './wBase.vue'
export default {
    name: "wLeafLet",
  extends : wBase,
    components: {
        LMap, LTileLayer, LIcon, LMarker
    },
    data() {
      console.debug('w-leaf-let',this.conf)
        return {
            zoom: 2,
            geojsonOptions: {
              // Options that don't rely on Leaflet methods.
            },
          iconWidth: 25,
          iconHeight: 40,
        };
    },
  async beforeMount() {
    // HERE is where to load Leaflet components!
    const { circleMarker } = await import("leaflet/dist/leaflet-src.esm");

    // And now the Leaflet circleMarker function can be used by the options:
    this.geojsonOptions.pointToLayer = (feature, latLng) =>
        circleMarker(latLng, { radius: 8 });
    this.mapIsReady = true;
  },
  methods:{
    iconUrl() {
      return `https://placekitten.com/${this.iconWidth}/${this.iconHeight}`;
    },
  },
  computed: {
    iconSize() {
      return [this.iconWidth, this.iconHeight];
    },
  }
}
</script>

<template>
    <div class="w-full" style="height:300px">
        <l-map ref="map" v-model:zoom="zoom" :center="[47.41322, -1.219482]" :useGlobalLeaflet="false">
            <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
            ></l-tile-layer>
          <l-marker v-for="(item,index) in value" :lat-lng="item" :key="index">
<!--            <l-icon :icon-size="iconSize" />-->
          </l-marker>
        </l-map>
    </div>
</template>

<style scoped>

</style>
