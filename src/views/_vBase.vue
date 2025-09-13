<script>
import CrudComponent from "../CrudComponent.vue";
import Server from "../lib/Server";
import WrapperConf from "./WrapperConf";
import CrudCore from "../lib/CrudCore";
import global from "../confs/global";

export default {
  name: "_vBase",
  extends: CrudComponent,
  emits: ['loaded'],
  beforeCreate() {
    //CrudCore.viewComponentCreate(this);

    let that = this;
    ///console.debug('_vBase.beforeCreate ',that.conf);
    //console.log('CREATEDDD',that)
    that.overwriteMethods = {};
    var __call = function (lk) {
      that[lk] = function () {
        var localk = new String(lk);
        return that.overwriteMethods[localk].apply(that, arguments);
      }
    }

    for (let k in that.conf) {
      //console.log('k',k,ext[k]);
      // se la funzione non e' tra i metodi sovrascribili allora la istanzio come una nuova funzione dell'oggetto
      // altrimenti ci pensano i singoli metodi sovrascribili a fare la chiamata
      if ((global.viewOverloadMethods.indexOf(k) < 0) && that.conf[k] instanceof Function) {
        console.debug('_vBase.created ', k, 'metodo non fa parte dei sovrascribili')
        that.overwriteMethods[k] = that.conf[k];
        __call(k);
      }
    }
    this.Server = Server;
  },
  mounted() {
    this.createViewRoute();
  },
  data() {
    return this._loadReactiveData(this.conf)
  },
  watch: {
    loaded() {
      if (this.loaded) {
        //console.log('LOADEDDDDDD',this.type)
        this.$emit('loaded', this.loaded);
      }
    }
  },
  methods: {

    draw() {
      this.setActions();
      this.loaded = true;
    },

    setActions() {

    },
    load() {
      let that = this;
      that.setRouteValues();
      that._beforeLoadData();
      that.loadData(function (json) {
        that.json = CrudCore.clone(json);
        that.fillData(json);
        that._afterLoadData(json);
        that.setWidgetsConfig();
        that.draw();
      });
    },

    reload() {
      let that = this;
      that.loaded = false;
      that.load();
    },

    createViewRoute() {
      let that = this;
      if (!that.routeName)
        return;
      if (!that.route) {
        that.route = that.createRoute(that.routeName);
      }
    },

    setRouteValues() {
      let that = this;
      if (!that.routeName)
        return;
      that.route.setValuesFromObj(that);
      that._manageHashParams();
      that._addDefaultParams();
    },
    _manageHashParams() {
      // questa metodo permette di aggiungere eventuali parametri in hash
    },

    _addDefaultParams() {
      // controlla che ci siano parametri di default in configurazione.
    },

    _beforeLoadData() {
      if (this.conf.beforeLoadData) {
        this.conf.beforeLoadData.apply(this);
      }
    },

    loadData(callback) {
      let that = this;
      if (!that.route) {
        callback({});
        return;
      }
      //console.log('fetchData',route.getConf());
      Server.route(that.route, function (json) {
        if (json.error) {
          //that.errorDialog(json.msg).show();
          that.alertError(json.msg, 3000);
          that.errorMsg = json.msg;
          return
        }
        //that.afterLoadData(json);
        callback(json);
      })
    },
    _afterLoadData() {
      if (this.conf.afterLoadData) {
        this.conf.afterLoadData.apply(this);
      }
    },

    /**
     * riempe la view con i dati che arrivano dalla chiamata ajax della route
     * attraverso il protocollo definito nella route
     * @param route
     * @param json
     */
    fillData: function (json) {
      var that = this;
      if (that.route) {
        var protocol = that.createProtocol(that.route.getProtocol());
        console.log('fillData', json);
        protocol.jsonToData(json);
        var prop = Object.getOwnPropertyNames(protocol);
        for (var i in prop) {
          that[prop[i]] = protocol[prop[i]];
        }
      }
      that.json = json;
    },
    /**
     * inserisce nei value anche i fields definiti custom dall'utente con valori statici
     */
    fillCustomFields() {

    },

    setParams(params) {
      console.log('route set params', params);
      this.route.setParams(params);
      this.reload();
    },
    getParams() {
      return this.route.getParams();
    },

    getFieldName(field) {
          if (this.conf.getFieldName && (this.conf.getFieldName instanceof Function) ) {
        return this.conf.getFieldName.apply(this, [field]);
      }
      return field;
    },

    setFieldLabel(key, conf) {
      let that = this;
      if (!('label' in conf)) {
        conf.label = key;
        // se c'e' un langContext, applico la regola
        if (that.langContext) {
          conf.label = that.translate(key + '.label', that.langContext);
        }
      } else {
        conf.label = that.translate(conf.label);
      }
      return conf;
    },
    getType() {
      return this.type.replace('v-', '');
    },
    instance() {
      return this;
    },
    getVisibleFields() {
      var that = this;
      var visible = [];
      for (let i in that.fields) {
        if (!that.isHiddenField(that.fields[i]))
          visible.push(that.fields[i]);
      }
      //console.log('VISIBLE FIELDS',visible);
      return visible;
    },
    getWidgetLayout(field, prop) {
      var that = this;
      var layout = that.widgetsConfig[field].layout;
      //console.debug(field,prop,"PROPLAYOUT",layout,'view layout',that.layout);
      if (!layout) {
        layout = that.layout;
      } else {
        layout = layout || {};
        for (var p in that.layout) {
          if (!layout[p]) {
            layout[p] = that.layout[p];
          }
        }
      }
      //console.debug(field,"PROPLAYOUT",layout,prop);
      if (!prop) {
        return layout;
      }
      return layout[prop];
    },
    isHiddenField: function (key) {
      //console.debug('idHiddenField key',key);
      let type = this.defaultWidgetType;
      if (this.fieldsConfig[key] && this.fieldsConfig[key].type) {
        type = this.fieldsConfig[key].type
      }
      //console.log('idHiddenField',type);
      if (type == 'w-hidden' ||
          (type == 'w-input' &&
              this.fieldsConfig[key] &&
              this.fieldsConfig[key].inputType === 'hidden')
      ) {
        return true;
      }
      return false;
    },
    getHiddenFields() {
      var that = this;
      var hidden = [];
      for (let i in that.fields) {
        if (that.isHiddenField(that.fields[i]))
          hidden.push(that.fields[i]);
      }
      //console.log('HIDDEN FIELDS',hidden);
      return hidden;
    },
    block() {
      this.blocked = true;
    },
    unblock() {
      this.blocked = false;
    },
    isBlocked() {
      return this.blocked;
    },
    /**
     * ritorna evenutali parametri di ricerca nel context della route
     */
    getSearchParams() {
      let that = this;
      let params = {};
      let context = that.$route.params.context;
      let listParams = (context && context.filter(a => a.indexOf('s_') == 0)) || [];
      let pageParam = context && context.filter(a => a.indexOf('page') == 0);
      let orderParam = context && context.filter(a => a.indexOf('order_') == 0);

      listParams = pageParam ? listParams.concat(pageParam) : listParams;
      listParams = orderParam ? listParams.concat(orderParam) : listParams;

      // params = params.concat( context.filter( a => a.indexOf('order_') == 0));
      for (let i in listParams) {
        let tmp = listParams[i].split(':');
        if (tmp.length != 2) {
          console.warn('non riesco a definire il valore da filtrare per il parmetro', listParams[i], tmp);
          continue;
        }
        params[tmp[0]] = tmp[1];
      }
      console.debug('page params', params, context)
      return params;
    },
    /**
     * questa funzione normalizza la configurazione che mi arriva e restituisco solo i dati che devono essere realmente reactive
     */
    _loadReactiveData(conf) {
      let wc = new WrapperConf()
      let ext = wc.loadConf(conf);
      let dt = {};
      for (let k in ext) {
        if (!(ext[k] instanceof Function)) {
          dt[k] = ext[k];
        }
      }
      //dt.errors = [];
      console.debug('_vBase.data ', dt)
      return dt;
    }
  },
}
</script>
