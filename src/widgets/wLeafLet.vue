<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer,LIcon,LMarker } from "@vue-leaflet/vue-leaflet";
import wBase from './wBase.vue'
import defaultIcon from '../assets/icons8-marker-50.png'

export default {
    name: "wLeafLet",
  extends : wBase,
    components: {
        LMap, LTileLayer, LIcon, LMarker
    },
    data() {
      console.debug('w-leaf-let',this.conf)
      let markers = this.valueToMarkers();
        return {
          markers : markers,
            zoom: 2,
            geojsonOptions: {
              // Options that don't rely on Leaflet methods.
            },
          iconWidth: 25,
          iconHeight: 25,
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
      valueToMarkers() {
        let markers = [];
        for (let i in this.conf.value) {
          if (Array.isArray(this.conf.value[i])) {
            markers.push({
              icon : this.conf.markerIcon || defaultIcon,
              latlng : this.conf.value[i],
              size : [this.conf.width,this.conf.height],
            })
          }
        }
        console.debug('markers',markers);
        return markers;
      },
    iconUrl(index) {
      if (this.markerIcon) {
        return this.markerIcon;
      }
      return defaultIcon; //`https://placekitten.com/${this.iconWidth}/${this.iconHeight}`;
    },
    iconSize(index) {
      return [this.iconWidth, this.iconHeight];
    },
  },
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
          <l-marker v-for="(item,index) in markers" :lat-lng="item.latlng" :key="index">
           <l-icon :icon-url="item.icon"  :icon-size="item.size" />
          </l-marker>
        </l-map>
    </div>
</template>

<style scoped>

</style>
