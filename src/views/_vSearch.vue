<script>
import CrudHelpers from '../lib/CrudHelpers';
import _vRecord from './_vRecord.vue';

export default {
  name: "_vSearch",
  extends: _vRecord,
  emits: ['search'],
  data() {
    return {
      s_basic_query: '',
    }
  },

  methods: {

    _afterDraw() {
      let that = this;
      setTimeout(() => {
       
        that.setSearchParamsValue();
        if (that.conf.afterDraw) {
          that.conf.afterDraw.apply(that);
        }
      }, 10);
      
    },

    _beforeLoadData() {
      let that = this;
      //console.debug('SEARCH context',context);
      if (that.conf.beforeLoadData) {
        that.conf.beforeLoadData.apply(this);
      }
    },

    _manageHashParams() {
      let that = this;
      let searchParams = that.getSearchParams();
      for (let key in searchParams) {
        let fieldName = key.substring(2); // tolgo il prefisso s_{fieldName}
        if (fieldName.indexOf('[]') > 0) {  // se il campo è un array
          fieldName = fieldName.replace('[]','');
        }
        
        if (that.fields.indexOf(fieldName) >= 0) {
          let config = that.fieldsConfig[fieldName] || {};
          config.value = searchParams[key];
          that.fieldsConfig[fieldName] = config;
          
        }
        that.route.setParam(key, searchParams[key]);

      }
      //console.debug(that.fields, 'search manageHashParams', JSON.parse(JSON.stringify(that.fieldsConfig)));
    },

    search(type, event) {
      //console.debug('type', type, event);
      // gestione evento change e submit della form
      if (event) {
        event.preventDefault();
        if (event.type != 'submit' && event.type != 'keyup') {
          return true;
        }
      }
      let that = this;
      type = type || that.defaultSearch();
      let form = 'formSearch';
      var formData = that.getViewData(form);
      //console.debug('ciccio', formData);

      if (this.updateHash) {
        this.setHash(formData)
      } else {
        this.$emit('search', formData);
      }
      return true;
    },
    setHash(formData) {
      let that = this;
      //console.debug('setHash', that.$route, formData);
      let currentParams = {...this.$route.params};
      let routeName = this.$route.name;
      //
      // let confName = this.$route.params.cConf;
      // let params = that.getViewList().route.getParams();
      let context = [];
      if (formData && formData instanceof FormData) {
        let handledKeys = new Set();
        for (let key of formData.keys()) {
          if (handledKeys.has(key)) {
            continue;
          }
          handledKeys.add(key);
          let values = formData.getAll(key);
          if (Array.isArray(values)) {
            values.forEach((value) => {
              context.push(key + ':' + value);
            });
          } else {
            context.push(key + ':' + values);
          }
        }
      } else if (formData && formData instanceof Object) {
        for (let key in formData) {
          let values = formData[key];
          if (Array.isArray(values)) {
            values.forEach((value) => {
              context.push(key + ':' + value);
            });
          } else {
            context.push(key + ':' + values);
          }

        }
      }
      currentParams.context = context;
      that.$router.push({name: routeName, params: currentParams});
    },

    getFieldName(field) {
      return 's_' + field;
    },

    getBasicFields() {
      var fields = this.getVisibleFields();
      var advancedFields = this.conf.advancedFields;
      var realBasicFields = fields.filter(function (n) {
        return advancedFields.indexOf(n) === -1;
      });
      //console.log('basicFields', fields, advancedFields, realBasicFields);
      return realBasicFields;
    },
    getAdvancedFields() {
      var fields = this.fields;
      var advancedFields = this.conf.advancedFields;
      var realAdvancedFields = fields.filter(function (n) {
        return advancedFields.indexOf(n) !== -1;
      });
      //console.log('advancedFields', fields, advancedFields, realAdvancedFields);
      return realAdvancedFields;
    },
    defaultSearch() {
      if (this.conf.defaultSearchType) {
        this.conf.defaultSearchType;
      }
      if (this.hasBasicSearch()) {
        return 'basic';
      }
      return 'advanced';
    },
    hasBasicSearch() {
      //console.log("BSSS:::", this.conf);
      return this.conf.basicSearch;
    },
    hasAdvancedSearch() {
      var advancedFields = this.getAdvancedFields();
      return advancedFields.length > 0;
    },
    hasAdvancedSearchAccordion() {
      //console.log("ASSS:::", this.conf);
      return this.conf.advancedSearchAccordion;
    },

    advancedSearchHeader() {
      if (this.conf.advancedSearchHeaderLabel) {
        return this.translate(this.conf.advancedSearchHeaderLabel);
      }
      return this.translate("app.ricerca_avanzata");
    },
    hasSearchLabel() {
      if (this.conf.searchLabel === false || this.conf.searchLabel === null || this.conf.searchLabel === undefined) {
        return false;
      }
      return true;
    },
    _searchLabel() {
      console.debug('vSearch _searchLabel', this.conf.searchLabel)
      if (this.conf.searchLabel) {
        if (this.conf.searchLabel instanceof Function) {
          return this.searchLabel.apply(this);
        }
        return this.translate(this.conf.searchLabel);
      }
      return this.translate("app.search_label");
    },
    isAdvancedSearchOpen() {
      return this.advancedSearchOpen ? '0' : null;
    },
    getBasicSearchPlaceholder() {
      return this.conf.basicSearchPlaceholder ?
          this.conf.basicSearchPlaceholder :
          this.translate('app.search_placeholder');
    },
    /**
     * setta il valore speciale del campo s_basic_query
     */
    setSpecialField(name, value) {
      if (name == 's_basic_query') {
        this.s_basic_query = value;
      }
    },
    isSpecialField(name) {
      if (name == 's_basic_query') {
        return true;
      }
      return false;
    },
    reset() {
      let that = this;
      let fields = this.fields || [];
      for (let i in fields) {
        let w = that.getWidget(fields[i]);
        if (w) {
          w._reset();
        }
      }
      setTimeout(function () {
        that.search();
      }, 10)
    },
    /**
     * setta i valori del widget ad eventuali valori presenti nell'url come s_{nome_campo}
     * o nel vettore passato che può essere array associativo o FormData
     */
    setSearchParamsValue(values) {
      let that = this;

      let searchParams = null;
      if (values) {
        searchParams =CrudHelpers.formDataToAssociativeArray(values);
      } else {
        searchParams = that.getSearchParams();
      }
      //console.debug('searchParams', searchParams);
      for (let key in searchParams) {
        if (that.isSpecialField(key)) {
          that.setSpecialField(key, searchParams[key]);
        } else {
          let fieldName = key.substring(2); // tolgo il prefisso s_{fieldName}
          if (fieldName.indexOf('[]') > 0) {  // se il campo è un array
            fieldName = fieldName.replace('[]','');
          }
          //console.debug('searchParams', that.fields, fieldName);
          if (that.fields.indexOf(fieldName) >= 0) {
            let w = this.getWidget(fieldName);
            //console.debug('searchParams', w, fieldName);
            if (w) {
              w.setValue(searchParams[key]);
            }
          }
        }
      }
    }

  }
}
</script>

<style lang="scss" scoped>

.panel-search-content-both {
  background-color: var(--primary-50);
}

.actionsDivider.p-divider-horizontal:before {
  border-color: var(--primary-100);
}

.actionsDivider {
  :deep(.p-tag) {
    background-color: var(--primary-50);
    color: var(--primary-color)
  }
}

.preSearch {
  width: 100%;
  text-align: center;
  margin-bottom: 2rem;

  :deep(.p-tag) {
    background-color: transparent;
    color: var(--primary-color);
    font-size: 0.95rem;
  }
}

.actionsButtons {
  :deep(.p-button-outlined) {
    border-color: var(--primary-400);
    color: var(--primary-400)
  }
}

label.labelTop {
  font-size: 12px;
  color: var(--surface-text);
  position: relative;
  top: -0.25rem;
  left: 0.25rem;
}


.panel-search-content {

  :deep(.p-accordion-header-text) {
    color: var(--primary-color);
  }

  :deep(.p-accordion-toggle-icon) {
    color: var(--primary-color);
  }

  :deep(.p-accordion-tab a) {
    background-color: white;
    padding: 1rem;
  }

  :deep(.p-accordion-header:hover) {

    //background-color: var(--primary-color);

    .p-panel-title {
      color: var(--primary-color);
    }

    .p-accordion-toggle-icon {
      color: var(--primary-color);
    }
  }


  //
  //.p-accordion-content {
  //    border-color: var(--primary-color);
  //}

  //.p-accordion-header {
  //    border-color: var(--primary-color);
  //}
}


</style>
