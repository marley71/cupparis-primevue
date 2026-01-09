<script>
import Server from "../lib/Server";
import _wBase from './_wBase.vue';

export default {
  name: "_wSwap",
  extends: _wBase,
  props: {
    //modelValue: String,
    conf: Object,
  },
  data() {
    let rData = this._loadReactiveData(this.conf);
    let bValue = Boolean(rData.value);
    let inverse = this.isInverse();
    rData.toggleValue = inverse ? !bValue : bValue;
    return rData;
  },
  methods: {
    setRouteValues: function (route) {
      var that = this;
      route.setValues({
        modelName: that.modelName,
      });
      route.setParams({
        id: that.modelData.id,
        field: that.name,
        value: that.valueToPass(),
      });
      return route;
    },
    _swap: function () {
      var that = this;
      if (that.isAjax) {
        var r = that.createRoute(that.routeName);
        that.setRouteValues(r);
        that.waitStart()
        Server.route(r, function (json) {
          that.waitEnd();
          that.json = json;
          if (json.error) {
            that.errorDialog(json.msg);
            return;
          }
          that.value = that.valueToPass();
          that.change();
        })
      } else {
        that.value = that.valueToPass();
        that.change();
      }

    },
    swap(event) {
      var that = this;
      console.log('event', event)
      // event.preventDefault();
      that._swap();
    },
    isInverse() {
      return Boolean(this.conf.dataSwitched);
    },
    valueToPass() {
      var that = this;
      let value = Boolean(that.toggleValue);
      return that.isInverse() ? !value : value;
    }

  }
}
</script>

<style scoped>

</style>
