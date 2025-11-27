
<script>
import Server from "../lib/Server";
import CrudCore from "../lib/CrudCore";
import _vList from './_vList.vue';

export default {
    name: "_vListEdit",
    extends: _vList,
    mounted() {
        this.load();
    },
    data() {
      return {
          rows:5,
          menuCollection : [],
          editMode : {},
      }
    },
    methods: {
        setWidgetsConfig() {
            this._setWidgetsConfig();
            this._setWidgetsEditConfig();
        },
        _setWidgetsEditConfig: function () {
            let that = this;
            let fConf = {};
            let fieldsEditConfig = that.fieldsEditConfig || {};
            for (let f in that.fields) {
                let key = that.fields[f];
                fConf[ key ] = {
                    type : 'w-input',
                }
                if (fieldsEditConfig[key]) {
                    fConf[key] = Object.assign(fConf[key],CrudCore.normalizeConf(fieldsEditConfig[key]));
                }
                that.setFieldLabel(key,fConf[key]);
                that.labelCols[key] = fConf[key].label;
            }

            // configurazione finale dei widgets
            let widgetsEditConfig = [];
            for (let i in that.value) {
                widgetsEditConfig.push({});
                for (let f in that.fields) {
                    let key = that.fields[f];
                    let val = that.value[i][key];
                    let md = Object.assign({},(that.metadata[key] || {}));
                    //console.log('field',key,'value',val);
                    widgetsEditConfig[i][key] = Object.assign(md,fConf[key]);
                    widgetsEditConfig[i][key].value = val;
                    widgetsEditConfig[i][key].name = that.getFieldName(key);
                    widgetsEditConfig[i][key].modelData = that.value[i];
                    //widgetsConfig[i][key].label = that.getFieldLabel(key);
                }
            }
            that.widgetsEditConfig = widgetsEditConfig;
        },
        getWidgetEditConf(index,field,data) {
            let that = this;
            if (!that.widgetsEditConfig || !that.widgetsEditConfig[index] || !that.widgetsEditConfig[index][field]) {
                return {};
            }
            that.widgetsEditConfig[index][field].value = data;
            return that.widgetsEditConfig[index][field];
        },

        getWidgetEditType(index,field) {
            let that = this;
            if (!that.widgetsEditConfig || !that.widgetsEditConfig[index] || !that.widgetsEditConfig[index][field]) {
                return that.defaultWidgetType;
            }
            if (that.widgetsEditConfig[index][field].type) {
                return that.widgetsEditConfig[index][field].type;
            }
            return that.defaultWidgetType;
        },
        setEditMode: function (index) {
            var that = this;
            //console.log('edit mode',index);
            if (that.actions.indexOf('action-delete') >= 0)
                that.hideRA(index, 'action-delete');
            if (that.actions.indexOf('action-edit-mode') >= 0)
                that.hideRA(index, 'action-edit-mode');
            if (that.actions.indexOf('action-view') >= 0)
                that.hideRA(index, 'action-view');

            if (that.actions.indexOf('action-view-mode') >= 0)
                that.showRA(index, 'action-view-mode');
            if (that.actions.indexOf('action-save-row') >= 0)
                that.showRA(index, 'action-save-row');
            //that.recordActions[index]['action-delete'].setVisible(false);
            that.editMode[index] = true;
        },
        setViewMode: function (index) {
            var that = this;
            that.editMode[index] = false;
            if (that.actions.indexOf('action-delete') >= 0)
                that.showRA(index, 'action-delete');
            if (that.actions.indexOf('action-edit-mode') >= 0)
                that.showRA(index, 'action-edit-mode');
            if (that.actions.indexOf('action-view') >= 0)
                that.showRA(index, 'action-view');

            if (that.actions.indexOf('action-view-mode') >= 0)
                that.hideRA(index, 'action-view-mode');
            if (that.actions.indexOf('action-save-row') >= 0)
                that.hideRA(index, 'action-save-row');
        },
        hideRA: function (index, name) {
            var that = this;
            var a = that.getRecordAction(index, name);
            if (a) {
                a._visible = false;
            }

        },
        showRA (index, name) {
            var that = this;
            var a = that.getRecordAction(index, name);
            if (a) {
                a._visible = true;
            }

        },
        getWidgetEdit (row, key) {
            let realKey = 'we'+(parseInt(row) % this.getPerPage()) +'_'+key
            console.debug('vListEdit.getWidgetEdit',row,realKey,this.$refs[realKey],Array.isArray(this.$refs[realKey]))
            return Array.isArray(this.$refs[realKey])?this.$refs[realKey][0]:this.$refs[realKey];
            // var wConf = this.widgetsEditConfig[row][key];
            // return this.store.cRefs[wConf.cRef];
        },
        getWidget (row, key) {
            let realKey = 'w'+(parseInt(row) % this.getPerPage()) +'_'+key
            console.debug('vListEdit.getWidget',row,realKey,this.$refs[realKey],Array.isArray(this.$refs[realKey]))
            return Array.isArray(this.$refs[realKey])?this.$refs[realKey][0]:this.$refs[realKey];
            // var wConf = this.widgetsEditConfig[row][key];
            // return this.store.cRefs[wConf.cRef];
        },
        setRowData (index,values) {
            var that = this;

            //console.log('fields',that.fields,'values',values);
            try {
                for (var i in that.fields) {
                    var key = that.fields[i];
                    that.widgetsEditConfig[index][key].value = values[key];
                    that.widgetsConfig[index][key].value = values[key];
                    var we = that.getWidgetEdit(index,key);
                    var w = that.getWidget(index,key);
                    console.debug('setR',we,w,values[key])
                    if (we) {
                        console.debug('we instance',we.instance())
                    }
                    if (w) {
                        console.debug('w instance',w.instance())
                    }
                    if (we) we.setValue(values[key]);
                    if (w) w.setValue(values[key]);
                }
            } catch (e) {
                console.error('vListEdit.setRowData',e);
            }

        },
        getRowEditData (index) {
            let that = this;
            let values = {};
            for (let i in that.fields) {
                let field = that.fields[i];
                console.log('prendo ' +index + ' ' + field,that.$refs['we'+index+'_'+field]);
                let w = that.$refs['we'+index+'_'+field];
                if (Array.isArray(w)) {
                    w = w[0];
                }
                if (w) {
                    values[field] = w.getValue()
                }
            }
            console.log('rowEditData values',values);
            return values;
        },
        /**
         * salva una riga
         * @param {indice della row da salvare} index
         */
        save(index,callback) {
            let that = this;
            var values = that.getRowEditData(index);

            //var id = that.viewInstance.value[that.index][that.viewInstance.primaryKey];
            var r = that.createRoute('update');
            r.setValues({
                modelName: that.modelName,
                pk : that.value[index][that.primaryKey]
            });

            //that.setRouteValues(r);
            r.setParams(values);
            Server.route(r, function (json) {
                if (json.error) {
                    that.errorDialog(json.msg);
                    callback(false)
                    return;
                }
                var msg = json.msg?json.msg:that.translate('app.salvataggio-ok');
                that.alertSuccess(msg,3000);
                var values = json.result;
                that.setRowData(index,values);
                that.setViewMode(index);
                setTimeout(function () {
                    that.setRowData(index,values);
                    callback(true)
                },20)

                //that.viewInstance.reload();
            })
            //console.log('values', values);
        }
    }
}
</script>

<style scoped>

</style>
