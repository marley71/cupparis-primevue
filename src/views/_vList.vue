

<script>
import _vBase from './_vBase.vue';
import CrudCore from "../lib/CrudCore";

const defaultPanelConf = () => {
  return {
    componentName: null,
    componentConf: {},
    panelClass: 'w-1/3',
    hide() {
      Function.prototype();
    }
  }
}

export default {
  name: "_vList",
  extends: _vBase,
  //props: ['conf'],
  mounted() {
    if (this.autoload)
      this.load();
  },
  data() {
    return {
      rows: 5,
      menuCollection: [],
      panelConf: defaultPanelConf(),
      labelCols: {},
      layout: this.conf.layout ? this.conf.layout : 'default',
      tableKey: Date.now(),  // key per forzar3e l'aggionramento di vue del componente datatable nelle liste non ajax
    }
  },
  methods: {
    draw() {
      this.setActions();
      this.paginator = (this.getPerPage() < this.getTotal());
      this.loaded = true;
    },

    _afterLoadData() {
      if (this.conf.afterLoadData) {
        this.conf.afterLoadData.apply(this);
      }

      /*
          QUESTA PARTE SERVE PER MANTENERE LA SELEZIONE DELLE CASELLE DOPO IL RELOAD DELLA LISTA
       */
      let that = this;
      let ids = [];
      let selected = [];
      if (that.selected) {
        ids = that.selected.map(a => a[that.primaryKey]);
      }

      for (let i in ids) {

        let result = that.value.filter(row => row[that.primaryKey] === ids[i]);
        if (result && result[0]) {
          selected.push(result[0]);
        }
      }

      that.selected = selected;

    },

    _manageHashParams() {
      let that = this;
      let searchParams = that.getSearchParams();

      console.debug('searchParams', searchParams)
      for (let field in searchParams) {
        that.route.setParam(field, searchParams[field]);
      }
    },


    onRowContextMenu(event) {
      this.$refs.cm.show(event.originalEvent);
    },
    onPage(event) {
      console.log('page event', event)
      if (this.routeName) {
        //let page = Math.floor(event.first / event.rows) +1;
        let page = event.page + 1;
        this.route.setParam('page', page);
        this.reload();
      }

    },
    onSort(event) {
      let that = this;
      console.log('sort event', event)
      if (that.routeName) {
        let sortField = event.sortField;
        // se nella config e' definito il sort del field lo prendo da li
        if (that.orderFields[sortField]) {
          sortField = that.orderFields[sortField];
        }
        that.route.setParam('order_field', sortField);
        that.route.setParam('order_direction', event.sortOrder > 0 ? 'ASC' : 'DESC');
        that.reload();
      } else {
          let key = event.sortField;
          this.value.sort((a, b) => {
              // Convertiamo entrambi in numeri
              const numA = parseFloat(a[key]);
              const numB = parseFloat(b[key]);
              console.debug('confronto A,B',numA,numB)
              // Verifica se sono numeri, usa confronto numerico.
              if (!isNaN(numA) && !isNaN(numB)) {
                  if (event.sortOrder > 0) {
                      return numA - numB;
                  }
                  return numB - numA
              }

              // Se uno solo è un numero, lo considera minore
              if (!isNaN(numA) && isNaN(numB)) {
                  return -1;
              }

              if (isNaN(numA) && !isNaN(numB)) {
                  return 1;
              }

              // Se entrambi sono NaN, usa confronto alfanumerico
              if (event.sortOrder > 0) {
                  console.debug('confronto alfanumerico A,B',a[key],b[key])
                  return a[key].localeCompare(b[key]);
              } else {
                  console.debug('confronto alfanumerico B,A',b[key],a[key])
                  return b[key].localeCompare(a[key]);
              }


          });
          console.debug('value',this.value);
          this.tableKey = Date.now();
      }

    },
    viewRow() {
      console.log('viewRow', this.selectedRow)
    },
    deleteRow() {
      console.log('deleteRow', this.selectedRow)
    },

    setActions() {
      let that = this;
      this.menuModel = [
        {label: 'View', icon: 'pi pi-fw pi-search', command: () => this.viewRow()},
        {label: 'Delete', icon: 'pi pi-fw pi-times', command: () => this.deleteRow()}
      ]

      let rActions = {};
      let gActions = {};
      for (let i in that.actions) {
        let aName = that.actions[i];
        let aConf = CrudCore.getActionConf(aName, that.actionsConfig[aName]);
        //console.debug(aName, 'caso parent --view', aConf)
        if (aConf.actionType === 'record') {
          rActions[aName] = aConf;
        } else {
          gActions[aName] = aConf;
        }
      }
      that.recordActionsConf = [];
      that.collectionActions = {};


      //let rActions = ['action-delete','action-edit','action-view'];
      for (let i in that.value) {
        let rowActions = {};
        for (let aName in rActions) {
          let aConf = Object.assign({}, rActions[aName]);
          aConf.modelData = that.value[i];
          aConf.view = that;
          aConf.index = i;
          rowActions[aName] = aConf;
        }
        that.recordActionsConf.push({actions: rowActions});
      }
      that.collectionActions.actions = {};
      let needSelection = false;
      for (let aName in gActions) {
        let aConf = Object.assign({}, gActions[aName]);
        aConf.modelData = that.value;
        aConf.view = that;
        needSelection |= that._needSelection(aConf); // aConf.needSelection;
        that.collectionActions.actions[aName] = aConf;
      }
      this.selectionMode = needSelection ? 'multiple' : null;
      //console.debug('RECORDACTIONS', that.recordActionsConf)
      //console.debug('GLOBAL ACTIONS', that.collectionActions);
      this._setMenuCollection();
    },

      _needSelection(actionConf) {
          if (typeof actionConf.needSelection === 'function') {
              return actionConf.needSelection.apply(this);
          }
          return actionConf.needSelection
      },
    getWidgetConf(index, field, data) {
      let that = this;
      index = index % that.getPerPage();
      //console.log('GETWIDGETCONF',index,field,data);
      if (!that.widgetsConfig || !that.widgetsConfig[index] || !that.widgetsConfig[index][field]) {
        console.warn('conf non trovata', field, index);
        return {};
      }

      if (that.widgetsConfig[index][field] instanceof String) {
        that.widgetsConfig[index][field] = {
          type: that.widgetsConfig[index][field]
        }
      }
      // TODO perche faccio questo? il valore e' gia' settato.. se necessario devo fare il ceck dove si trovano i valori
      // if (field in this.value[index]) {
      //     that.widgetsConfig[index][field].value = data;
      // }

      if (("" + data) != 'undefined') {
        that.widgetsConfig[index][field].value = data;
      }
      return that.widgetsConfig[index][field];
    },
    getWidgetType(index,field) {
        let that = this;
        let fieldsConfig = that.fieldsConfig || {};
        if (that.fieldsConfig[field] && that.fieldsConfig[field].type) {
            return that.fieldsConfig[field].type;
        }
        return that.defaultWidgetType;
    },
    setWidgetsConfig() {
      this._setWidgetsConfig();
    },
    _setWidgetsConfig() {
      let that = this;
      // configurazioni widgets se non ci sono fields configurati prendo le keys dei valori
      if (!that.fields && that.value.length) {
        that.fields = Object.keys(that.value[0]);
      }
      // configurazione finale dei widgets
      let widgetsConfig = [];
      for (let i in that.value) {
        widgetsConfig.push({});
        for (let f in that.fields) {
          let key = that.fields[f];
          let val = that.value[i][key];
          widgetsConfig[i][key] = that.getWidgetConfig(key, val, that.value[i]);
          widgetsConfig[i][key].index = i;
        }
      }
      that.widgetsConfig = widgetsConfig;
    },

    _setWidgetsConfigOld() {
      let that = this;
      // configurazioni widgets
      if (!that.fields && that.value.length) {
        that.fields = Object.keys(that.value[0]);
      }
      let fConf = {};
      let fieldsConfig = that.fieldsConfig || {};
      //console.log('FIEDLS CONFIG',fieldsConfig,that.defaultWidgetType);
      // configurazione base mergiata con la configurazione passata
      for (let f in that.fields) {
        let key = that.fields[f];
        fConf[key] = {
          type: that.defaultWidgetType,
        }
        if (fieldsConfig[key]) {
          fConf[key] = Object.assign(fConf[key], CrudCore.normalizeConf(fieldsConfig[key]));
        }
        that.setFieldLabel(key, fConf[key]);
        that.labelCols[key] = fConf[key].label;
      }
      // configurazione finale dei widgets
      let widgetsConfig = [];
      for (let i in that.value) {
        widgetsConfig.push({});
        for (let f in that.fields) {
          let key = that.fields[f];
          let val = that.value[i][key];
          let md = Object.assign({}, (that.metadata[key] || {}));
          //console.log('field',key,'value',val);
          widgetsConfig[i][key] = Object.assign(md, fConf[key]);
          widgetsConfig[i][key].value = val;
          widgetsConfig[i][key].name = that.getFieldName(key);
          widgetsConfig[i][key].modelData = that.value[i];
          widgetsConfig[i][key].view = that;
          //widgetsConfig[i][key].label = that.getFieldLabel(key);
        }
      }
      that.widgetsConfig = widgetsConfig;
    },
    /**
     * ritorna la configurazione di un widget per poter instanziare widgets dinamici
     * @param key
     */
    getWidgetConfig(key, value, modelData) {
      let that = this;
      let md = Object.assign({}, (that.metadata[key] || {}));
      let fieldsConfig = that.fieldsConfig || {};
      let wc = {
        type: that.defaultWidgetType,
      };
      if (fieldsConfig[key]) {
        wc = Object.assign(wc, CrudCore.normalizeConf(fieldsConfig[key]));
      }
      wc = Object.assign(md, wc);
      // se il value e' undefined allora e' un campo custom della view non ci metto niente
      if (("" + value) != 'undefined') {
        wc.value = value;
      }

      wc.name = that.getFieldName(key);
      wc.modelData = modelData;
      wc.view = that;
      that.setFieldLabel(key, wc);
      that.labelCols[key] = wc.label;
      return wc;
    },

    columnLabel(col) {
      return this.labelCols[col];
    },
    isSortable(field) {
      var that = this;
      if (that.orderFields[field])
        return true;
      return false;

      //return (Object.key(this.orderFields).indexOf(field) >= 0);
    },
    sortDirection(field) {
      let that = this;
      var order = that.metadata.order || {};
      if (order.field == field) {
        if (order.direction.toLowerCase() == 'asc')
          return 1;
        return -1
      }
      return null;
    },
    getFirst() {
      let first = 0;
      if (this.routeName) {
        if (this.pagination && this.pagination.current_page) {
          first = (this.pagination.current_page - 1) * this.pagination.per_page;
        }
      }
      //console.log('first', first, this.pagination);
      return first;
    },
    getTotal() {
      if (this.routeName)
        return this.pagination.total;
      return this.value ? this.value.length : 0;
    },
    getSortField() {
      return (this.metadata.order && this.metadata.order.field) || null;
    },
    getSortOrder() {
      return (this.metadata.order && this.metadata.order.direction) ? (this.metadata.order.direction.toLowerCase() == 'asc' ? 1 : -1) : null;
    },
    getPerPage() {
      if (this.routeName)
        return this.pagination.per_page;
      let pagination = this.pagination || {};
      return (pagination.per_page ? pagination.per_page : this.getTotal());
      //return this.getTotal();
    },
    getPage() {
      console.log('pagination', this.pagination);
      if (this.routeName)
        return this.pagination.current_page;
      return parseInt(Math.floor(this.getTotal() / this.getPerPage()));
    },
    getRecordAction(index, name) {
      let key = 'r' + index
      console.log('getRecordAction', index, name, key, this.$refs);
      if (this.$refs[key]) {
        return this.$refs[key].instance(name);
      }
      return null;
    },
    /**
     * ritorna un vettore di primaryKey
     * @returns {*[]}
     */
    selectedRows() {
      let that = this;
      let ids = [];
      for (let i in that.selected) {
        console.log('selected', that.selected[i], that.selected[i][that.primaryKey])
        ids.push(that.selected[i][that.primaryKey])
      }
      return ids;
    },
    /**
     * ritorna tutti i dati delle righe selezionate
     * @returns {*}
     */
    selectedRowsData() {
      let that = this;
      let rows = [];
      for (let i in that.selected) {
        console.log('selected rows data', that.selected[i], that.selected)
        rows.push(that.selected[i])
      }
      return rows;
    },
    hasCollectionActions() {
      let that = this;
      //console.log('hasRecordActions',that.recordActionsConf);
      if (that.collectionActions && that.collectionActions.length && (Object.keys(that.collectionActions[0].actions).length > 0))
        return true;
      return false;
    },
    hasRecordActions() {
      let that = this;
      //console.log('hasRecordActions',that.recordActionsConf);
      if (that.recordActionsConf && that.recordActionsConf.length && (Object.keys(that.recordActionsConf[0].actions).length > 0))
        return true;
      return false;
    },
    getRecordActionsPosition() {
      let that = this;
      //console.log('getRecordActionsPosition, hasRecordActions',that.recordActionsConf,that.recordActionsPosition);
      switch (that.recordActionsPosition) {
        case 'end':
          return 'end';
        default:
          return 'start';
      }
    },
    _setMenuCollection() {
      let that = this;
      let items = [];
      for (let name in that.collectionActions.actions) {
        items.push({
          label: CrudCore.translate(that.collectionActions.actions[name].text),
          icon: that.collectionActions.actions[name].icon,
          command: () => that.collectionActions.actions[name].execute(),
          disabled: that.collectionActions.actions[name].disabled,
          action: name,
        })
      }
      that.menuCollection = items;
      console.log('menuCollection', that.menuCollection, that.collectionActions)
    },
    showPanel(event, conf) {
      if (conf) {
        this.panelConf = Object.assign(defaultPanelConf(), conf);
      } else {
        //this.panelConf.componentName = null;
        this.panelConf = defaultPanelConf();
      }
      this.$refs.panel.show(event);
    },
    hidePanel() {
      this.$refs.panel.hide();
    },

    getValue() {
      let that = this;
      let vs = [];
      for (let i in that.value) {
        let r = that.getRowData(i);
        vs.push(r);
      }
      return vs;
    },

    getRowData(index) {
      var that = this;
      var values = {};
      for (var k in that.fields) {
        let field = that.fields[k];
        //console.log('w ref','w'+index+'_'+field)
        let w = that.$refs['w' + index + '_' + field];
        if (w) {
          //WW = w;
          //console.log('w',w);
          values[field] = w[0].getValue()
        }
      }
      //console.log('rowData values',values);
      return values;
    },
    /**
     * ritorna i widgets di una riga
     * @param index
     * @returns {{}}
     */
    getRowWidgets(index) {
      var that = this;
      var widgets = {};
      for (var k in that.fields) {
        let field = that.fields[k];
        //console.log('w ref','w'+index+'_'+field)
        let w = that.$refs['w' + index + '_' + field];
        if (w) {
          widgets[field] = w[0];
        }
      }
      //console.log('rowData values',values);
      return widgets;
    },

    /**
     * ritorna la riga che ha come primarykey uguale a key
     * @param key
     */
    getRowDataByKey(key) {
      let idx = this.value.map(a => a[this.primaryKey]).indexOf(key);
      if (idx < 0) {
        throw "getRowDataByKey invalid idx " + idx
      }
      return this.getRowData(idx);
    },
    getVisibleFields() {
      var that = this;
      var visible = [];
      for (let i in that.fields) {
        let keyField = that.fields[i];
        if ((that.hiddenColumns.indexOf(keyField) < 0) &&
            (!that.isHiddenField(keyField))) {
          visible.push(keyField)
        }
      }
      //console.log('VISIBLE FIELDS',visible);
      return visible;
    },
    hideColumn(field) {
      if (this.hiddenColumns.indexOf(field) < 0) {
        this.hiddenColumns.push(field)
      }
    },
    showColumn(field) {
      let idx = this.hiddenColumns.indexOf(field);
      if (idx >= 0) {
        this.hiddenColumns.splice(idx, 1);
      } else {
        console.warn('widget', field, 'is not hidden column');
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.v-list-header {
  border-bottom: 2px solid var(--primary-color);
}

.p-datatable {
  :deep(.p-datatable-header) {
    background-color: transparent;
    padding: 1.25rem 0;
    margin-top: 0;
    margin-bottom: 1rem;
    border-top: 2px solid var(--primary-color);
  }

  :deep(.p-datatable-header .surface-section) {
    padding-left: 0.75rem !important;
    padding-right: 0.75rem !important;
  }

  :deep(.p-datatable-wrapper) {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

}


</style>
