<script>
import _vBase from './_vBase.vue';
import Server from "../lib/Server";
import viewConfs from "../confs/views";
import {defineRule, validate} from 'vee-validate';
import AllRules from "../lib/AllRules";
import CrudCore from "../lib/CrudCore";


export default {
  name: "_vRecord",
  extends: _vBase,
  props: ['inlist', 'indexInlist'],
  emits: ['deleteInlist'],
  mounted() {
    if (this.autoload)
      this.load();
  },
  data() {
    //console.log('vRecord', this.conf);
    let ly = this.conf.layout || {};
    //console.log('layouttttttt',ly);
    // const { handleSubmit, resetForm } = useForm();
    // const { value, errorMessage } = useField('value', this.validateField);
    return {
      layout: ly,
      isInlist: true,
      blocked: false,
      removedWidgets: [], // rimuove il widget usando v-if
      hiddenWidgets: [],   // nasconde il widget usando v-show
      myShow: false,
      removedGroups: [], // rimuove il widget usando v-if
      hiddenGroups: [],   // nasconde il widget usando v-show

    }
  },
  methods: {
    draw() {
      let that = this;

      that.setLayout();
      //console.debug('record widgetsConfig',this.widgetsConfig);
      //console.debug('draw',that.hiddenWidgets);
      for (let k in this.widgetsConfig) {
        if (this.widgetsConfig[k].removeWidget) {
          this.removedWidgets.push(k);
        }
        if (this.widgetsConfig[k].hiddenWidget) {
          this.hiddenWidgets.push(k);
        }
      }
      this.setActions();
      this.loaded = true;
    },

    setLayout() {
      let that = this;
      let ly = that.layout || {};
      if (ly instanceof String) {
        ly = viewConfs.recordLayouts()[ly] || viewConfs.recordLayouts().default;
      } else {
        let tmp = Object.assign({}, viewConfs.recordLayouts().default);
        ly = Object.assign(tmp, ly);
      }
      ly.colClass = this.getColClass(ly.cols);
      that.layout = ly;
    },

    removeFromList() {
      this.isInlist = false;
    },
    inlistAction(index, action) {
      console.log('EMIT---ACTIONINLIST::: ', index, action);
      this.$emit('actionInlist', index, action);
    },
    hasActionsDivider() {
      return this.actionDivider;
    },
    getGroups() {
      return Array.isArray(this.groups) ? this.groups : false;
    },
    getGroupVisibleFields(groupFields) {
      var groupVisibleFields = [];
      for (var i in groupFields) {
        var f = groupFields[i];
        if (!this.isHiddenField(f))
          groupVisibleFields.push(f);
      }
      console.log("GVF:::: ", groupVisibleFields)
      return groupVisibleFields;
    },
    getGroupWrapper(group) {
      return group.wrapper || false;
    },
    getGroupHeader(group) {
      return group.header || false;
    },
    getGroupName(group) {
      return group.name || '';
    },
    getGroupActions(group) {
      return Array.isArray(group.actions) ? group.actions : false;
    },
    getGroupTitle(group) {
      return group.title ?
          this.translateUc(group.title) :
          (CrudCore.upperCaseFirst(CrudCore.sentenceCase(group.name)) || '');
    },
    getGroupClass(group) {
      let classes = '';
      classes += this.groupClass;
      classes += ' group-' + this.getGroupName(group);
      if (group.severity) {
        classes += ' group-' + group.severity;
      }
      classes += ' ' + group.cssClass;
      return classes;
    },
    getGroupIsClosed(group) {
      return group.closed ? "1" : "0";
    },
    hideGroup(group) {
      if (this.hiddenGroups.indexOf(group) < 0) {
        this.hiddenGroups.push(group);
      }
      //console.debug('hideGroup',group,this.hiddenGroups)
    },
    showGroup(group) {
      let idx = this.hiddenGroups.indexOf(group);
      if (idx >= 0) {
        this.hiddenGroups.splice(idx, 1);
      } else {
        console.warn('group', group, 'is not hidden');
      }
    },
    getColClass(col) {
      if (!this.colsClasses) {
        return 'col-span-12';
      }
      return this.colsClasses[col] || this.colsClasses[0];
    },
    setActions() {
      let that = this;
      that.recordActionsConf = {
        actions: {}
      };
      let rActions = that.actions;
      console.log('actionsConfig', that.actionsConfig)
      for (let k in rActions) {
        let aName = rActions[k];
        let currenConfig = Object.assign({}, (that.actionsConfig[aName] || {}));
        currenConfig.modelData = that.value;
        currenConfig.viewInstance = that;
        let aConf = CrudCore.getActionConf(aName, currenConfig);
        that.recordActionsConf.actions[aName] = aConf;
      }
      console.log('recordActionsConf', that.recordActionsConf)
    },
    getActionsWhitelist() {
      if (Array.isArray(this.actionsWhitelist)) {
        return this.actionsWhitelist
      }
      return this.actions;
    },
    getWidgetConf(index, field, data) {
      let that = this;
      that.widgetsConfig[index][field].value = data;
      return Object.assign({}, that.widgetsConfig[index][field]);
    },
    setWidgetsConfig() {
      let that = this;
      // configurazioni widgets
      if (!that.fields && that.value) {
        that.fields = Object.keys(that.value);
      }

      let fConf = {};
      let fieldsConfig = that.fieldsConfig || {};
      for (let f in that.fields) {
        let key = that.fields[f];
        fConf[key] = {
          type: that.defaultWidgetType,
        };

        if (fieldsConfig[key]) {
          fConf[key] = Object.assign(fConf[key], CrudCore.normalizeConf(fieldsConfig[key]));
        }
        that.setFieldLabel(key, fConf[key]);
      }
      let widgetsConfig = {};
      for (let f in that.fields) {
        let key = that.fields[f];
        let val = that.value[key];
        let md = that.metadata[key] || {};
        widgetsConfig[key] = Object.assign(md, fConf[key]);
        // il valore del campo puo' essere il nome del field o se c'e' il bind il nome del bind o se c'e' bind_all_data true il valore di tutti i campi
        if (widgetsConfig[key].bind) {
          val = that.value[widgetsConfig[key].bind];
        } else if (widgetsConfig[key].bind_all_data) {
          val = that.value;
        } else {
          val = that.value[key];
        }
        widgetsConfig[key].value = val || widgetsConfig[key].value || widgetsConfig[key].defaultValue;
        widgetsConfig[key].name = that.getFieldName(key);
        widgetsConfig[key].modelData = that.value;
        widgetsConfig[key].viewInstance = that;
        widgetsConfig[key].rules = fConf[key].rules || '';
      }
      console.log('vRecord setWidgetsConfig', widgetsConfig)
      that.widgetsConfig = widgetsConfig;

    },
    save(callback) {
      var that = this;
      let route = null;
      that.resetWidgetsErrors();
      that.validate().then((res) => {
        if (!res) {
          that.alertError('Controllare i dati, ci sono degli errori di validazione');
          return;
        }

        if (that.type == 'v-edit') {
          route = that.createRoute('update');
          var pk = that.cPk || that.pk || 0;
          route.setValues({
            modelName: that.modelName,
            foormName: (that.foormName || 'edit'),
            pk: pk
          });
        } else {
          route = that.createRoute('create');
          route.setValues({
            modelName: that.modelName,
            foormName: (that.foormName || 'insert'),
          });
        }
        route.setParams(that.getViewData());
        that.block();

        Server.route(route, function (json) {
          that.unblock();
          callback(json);
        })
      })


    },
    getViewData(ref) {
      let that = this;
      let form = ref || 'form';
      const formData = new FormData(that.$refs[form]);
      // console.log('formData', formData);
      if (!that.formToJson) {
        return formData;
      }
      const formDataJson = new CrudCore.formDataToJson(formData);
      // console.log('formDataJson', formDataJson);
      return formDataJson
    },
    getWidget(field) {
      try {
        var fieldRefName = 'fields-' + field;
        //console.log("searchParams REFSSSS",field,this.$refs,this.$refs[fieldRefName])
        var fieldRef = this.$refs[fieldRefName];
        if (Array.isArray(fieldRef)) {
          if (fieldRef.length > 0) {
            return this.$refs[fieldRefName][0].$refs[field]
                ? this.$refs[fieldRefName][0].$refs[field]
                : this.$refs[fieldRefName][0];
          }
          //return fieldRef;
        }
        if (this.$refs[fieldRefName]) {
          return this.$refs[fieldRefName].$refs[field];
        }
        return null;
      } catch (error) {
        console.error('error getWidget', field, error);
        return null;
      }

    },
    getAction(name) {
      //console.log('getAction',name,this.recordActionsConf);
      return this.$refs.actions.instance(name);
    },
    callAction(name) {
      let action = this.getAction(name);
      if (!action) {
        this.alertError('Azionenon trovata ' + name);
        return;
      }
      action.execute();
    },
    getValue() {
      var that = this;
      var values = {};
      for (var k in that.fields) {
        let field = that.fields[k];
        let w = that.getWidget(field);
        if (!w) {
          console.warn('vRecord.getValue widget not found', field);
        } else {
          values[field] = w.getValue();
        }
      }
      //console.log('rowData ', that.value);
      return values;
    },
    setValue(values) {
      let that = this;
      for (let key in values) {
        if (that.fields.indexOf(key) >= 0) {
          let w = that.getWidget(key);
          //console.log('set Value w', w, key);
          if (w) {
            w.setValue(values[key]);
          }
        }
      }
    },
    /**
     * esegue la validazione della form prima di inviarla al server in base
     * alle rules definite in configurazione su ogni campo.
     */
    async validate() {
      //console.log(AllRules)
      let that = this;
      //console.log('widgetsConfig',that.widgetsConfig);

      that.defineRules();
      let isValid = true;
      for (let i in that.fields) {
        let name = that.fields[i];
        // se e' nascoto o rimosso salto la validazione;
        if (that.isHiddenWidget(name) || that.isRemovedWidget(name)) {
          continue;
        }
        let widget = this.getWidget(name);

        if (widget) {
          if (widget.rules) {
            let res = await validate(widget.getValue(),
                widget.rules,
                {
                  name: name,
                  label: widget.label,
                  bails: false,
                });
            isValid = isValid && res.valid;
            widget.setErrors(res.errors);
          }
          // se e' un hasmany devo anche validare i campi interni
          if (that.widgetsConfig[name].type == 'w-hasmany') {
            let res = await widget.validate();
            isValid = isValid && res.valid;
          }

        }
      }
      console.log('isValid', isValid)
      return isValid;
    },
    /**
     * definisce tutte le rules definite nel campo rules per poterle richiamare in fase di validate form
     */
    defineRules() {
      let that = this;
      let rulesArray = [];
      for (let i in that.fields) {
        let name = that.fields[i];
        let widget = this.getWidget(name);
        // TODO pezza  per gli hasmany.. capire come arrivare ai campi per la validazione.
        if (widget) {
          //console.debug('name', name, that.widgetsConfig[name].type);
          rulesArray = rulesArray.concat(widget.rules ? widget.rules.split('|') : []);
          // controllo che non ci siano rules custom e se i sono devono essere definite in customRules del widget
          for (let i in rulesArray) {
            let rName = rulesArray[i].split(':')[0];
            //console.debug('rName',rName,AllRules[rName]);
            if (!AllRules[rName]) {
              if (!widget.customRules[rName]) {
                throw "Regola " + rName + ' non è stata definita';
              } else {
                AllRules[rName] = function () {
                  return widget.customRules[rName].apply(widget, []);
                }
              }
            }
          }
          if (that.widgetsConfig[name].type == 'w-hasmany') {
            rulesArray = rulesArray.concat(widget.getRules());
          }
        }
      }
      for (let i in rulesArray) {
        let ruleName = rulesArray[i].split(':')[0];
        if (ruleName) {
          defineRule(ruleName, AllRules[ruleName]);
        }
      }
    },
    /**
     * se esiste un regola required aggiunge l'asterisco alla label del campo
     * @param {} field
     */
    isRequired(field) {
      if (this.widgetsConfig[field].rules.indexOf('required') >= 0) {
        return ' *';
      }
      return ''
    },
    /**
     * resetta gli errori segnalati in un eventuale validate
     */
    resetWidgetsErrors() {
      let that = this;
      //window.VT = this;
      for (let i in that.fields) {
        let name = that.fields[i];
        // TODO pezza  per gli hasmany.. capire come arrivare ai campi per la validazione.
        //let tt = (that.widgetsConfig[name] && that.widgetsConfig[name].type)?that.widgetsConfig[name].type:that.defaultWidgetType;
        let widget = this.getWidget(name);
        if (widget) {
          //console.debug('setErrors',name,widget);
          widget.setErrors([]);
          // if (widget.setErrors) {
          //   widget.setErrors([]);
          // } else {
          //   console.warn('setErrors non trovata per il widget ' + name);
          // }
          if (that.widgetsConfig[name].type == 'w-hasmany') {
            widget.resetWidgetsErrors();
          }
        }


      }
    },
    isRemovedWidget(field) {
      //console.debug('isRemovedWidget',field,(this.removedWidgets.indexOf(field) >= 0))
      return (this.removedWidgets.indexOf(field) >= 0);
    },
    removeWidget(field) {
      if (this.removedWidgets.indexOf(field) < 0) {
        this.removedWidgets.push(field);
      }
    },
    putInWidget(field) {
      let idx = this.removedWidgets.indexOf(field)
      if (idx >= 0) {
        this.removedWidgets.splice(idx, 1);
      } else {
        console.warn('widget', field, 'is not removed');
      }
    },
    isHiddenWidget(field) {
      //console.debug('isHiddenWidget',field,(this.hiddenWidgets.indexOf(field) >= 0))
      return (this.hiddenWidgets.indexOf(field) >= 0);
    },
    isHiddenGroup(group) {
      //console.debug('isHiddenWidget',field,(this.hiddenWidgets.indexOf(field) >= 0))
      return (this.hiddenGroups.indexOf(this.getGroupName(group)) >= 0);
    },
    hideWidget(field) {
      if (this.hiddenWidgets.indexOf(field) < 0) {
        this.hiddenWidgets.push(field);
      }
      //console.debug('hideWidget',field,this.hiddenWidgets)
    },
    showWidget(field) {
      let idx = this.hiddenWidgets.indexOf(field);
      if (idx >= 0) {
        this.hiddenWidgets.splice(idx, 1);
      } else {
        console.warn('widget', field, 'is not hidden');
      }
    },
    hasDividerBefore(field) {
      return this.widgetsConfig[field].divider === 'before';
    },
    hasDividerAfter(field) {
      return this.widgetsConfig[field].divider === 'after';
    },
    getDividerInfo(field) {
      let conf = this.widgetsConfig[field];
      return {
        'class': conf.dividerClass || '',
        'content': conf.dividerContent || false,
        'contentClass': conf.dividerContentClass || 'font-bold',
        'description': conf.dividerDescription || false
      }
    },
    getLabelInfo(field) {
      let conf = this.widgetsConfig[field];
      let layout = this.getWidgetLayout(field);
      return {
        'label': this.translateUc(conf.label),
        'position': layout.labelPosition,
        'required': this.isRequired(field),
      }
    },
    reset() {
      let fields = this.fields || [];
      for (let i in fields) {
        let w = this.getWidget(fields[i]);
        if (w) {
          w._reset();
        }
      }
    },
    getTitleMsg() {
      console.log("TITLE MSG::: ", this, this.value)
      if (this.conf.titleMsg) {
        return this.conf.titleMsg.apply(this, [this.value]);
      }
      if (this.title) {
        return this.title;
      }
      return null;
    },
    waitWidget(field, callback) {
      let that = this;
      let widget = that.getWidget(field);
      if (widget) {
        callback(widget);
      } else {
        setTimeout(() => {
          that.waitWidget(field, callback);
        }, 100);
      }

    },
  }
}
</script>

<style lang="scss" scoped>

label.labelTop {
  font-size: 12px;
  color: var(--surface-text);
  position: relative;
  top: -0.25rem;
  left: 0.25rem;
}

</style>
