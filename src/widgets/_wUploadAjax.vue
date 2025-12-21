<script>

import _wBase from "./_wBase.vue"
import Server from "../lib/Server";

export default {
  name: '_wUploadAjax',
  extends: _wBase,
  methods: {
    uploadFile(event) {
      this.files = event.files;
      this.sendAjax();
    },
    getFileValue() {
      return this.files;
    },
    sendAjax() {
      var that = this;
      var fDesc = that.getFileValue();
      if (!fDesc || !fDesc[0])
        throw 'descrittore file upload non valido';
      fDesc = fDesc[0];
      // var fileName = fDesc.filename;
      var route = that.createRoute(that.routeName);
      that.setRouteValues(route);
      that.error = false;
      that.complete = false;

      var realUrl = Server.getUrl(route.getUrl());
      console.log('realurl', route.getUrl())
      var fdata = new FormData();
      //data.append('file',jQuery(that.$el).find('[c-image-file]').prop('files')[0]);
      fdata.append('file', fDesc)
      console.log('ajaxFields', that.ajaxFields)
      for (var k in that.ajaxFields)
        fdata.append(k, that.ajaxFields[k])
      that.waitStart("Caricamento file...");
      Server.post(realUrl, fdata, function (data) {
        that.json = data;
        if (!data.error) {
          console.log("Success: Files sent!", data);
          that.$emit('success', that);
          that.complete = true;

          console.log('done, data.result', data.result);

          //that.lastUpload = Object.assign({},data.result);
          that.fileInfo = Object.assign({}, data.result);
          // TODO sfruttare meglio l'oggetto upload primeface
          that.value = JSON.stringify(data.result); //.replace(/\\"/g, '"');
          //that.$refs.preview.setValue(data.result);
          that.onSuccess();
          that.waitEnd();
        } else {
          console.log("An error occurred, the files couldn't be sent!");
          that.fileInfo = null;
          that.error = true;
          that.errorMessage = Server.getErrorMessage(data.msg);
          that.value = JSON.stringify({});
          that.onError();
          that.waitEnd();
        }

      });
    },
    setRouteValues(route) {
      if (this.conf.setRouteValues) {
        this.conf.setRouteValues.apply(this, [route]);
        return route;
      }
      route.setValues({
        modelName: this.modelName
      })
      return route;
    },
    onError(event) {
      if (this.conf.onError) {
        return this.conf.onError.apply(this, [event])
      }

    },
    onSuccess(event) {
      if (this.conf.onSuccess) {
        return this.conf.onSuccess.apply(this, [event])
      }

    },
    bgUrl(url) {
      return 'background-image: url("' + url + '") !important;"';
    },
  }
}
</script>
