<script>
import _wBase from './_wBase.vue'
import defaultIcon from '../assets/icons8-marker-50.png'

export default {
    name: "_wLeafLet",
  extends : _wBase,
    data() {
      let rData = this._loadReactiveData(this.conf);



      console.debug('w-leaf-let',this.conf)
      let markers = this.valueToMarkers();


      let leafData = {
          markers : markers,
            zoom: 2,
            geojsonOptions: {
              // Options that don't rely on Leaflet methods.
            },
          iconWidth: 25,
          iconHeight: 25,
        };
        return Object.assign(leafData,rData);
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
