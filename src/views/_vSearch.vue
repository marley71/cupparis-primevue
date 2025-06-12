<script>
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
    mounted() {

    },
    methods: {

        _afterDraw() {
            let that = this;
            that.setSearchParamsValue();
            if (that.conf.afterDraw) {
                that.conf.afterDraw.apply(that);
            }
        },

        _beforeLoadData() {
            let that =this;
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
            if (that.fields.indexOf(fieldName) >=0 )  {
              let config = that.fieldsConfig[fieldName] || {};
              config.value = searchParams[key];
              that.fieldsConfig[fieldName] = config;
              console.debug('has fieldName',fieldName,config)
            }
            that.route.setParam(key,searchParams[key]);

          }
          console.debug(that.fields,'search manageHashParams',JSON.parse(JSON.stringify(that.fieldsConfig)));
        },

        search(type, event) {
            console.debug('type', type, event);
            // gestione evento change e submit della form
            if (event) {
                event.preventDefault();
                if ((type == 'basic') && event.type != 'submit') {
                    return true;
                }
            }
            let that = this;
            type = type || that.defaultSearch();
            if (type === 'basic') {
                for (let i in this.fields) {
                    let widget = this.getWidget(this.fields[i]);
                    if (widget) {
                        widget.setValue('');
                    }

                }
            } else {
                this.s_basic_query = '';
            }
            let form = type === 'basic' ? 'formBasic' : 'form';
            var formData = that.getViewData(form);
            if (this.updateHash) {
              this.setHash(formData)
            } else {
              this.$emit('search', formData);
            }
            return true;
        },
        setHash(formData) {
          let that = this;
          // let path = that.$route.path.split('?');
          // let params = Object.fromEntries(formData.entries());
          console.debug('setHash',that.$route,formData);
          let currentParams = { ...this.$route.params };
          let routeName = this.$route.name;
          //
          // let confName = this.$route.params.cConf;
          // let params = that.getViewList().route.getParams();
          let context = [];
          if (formData && formData instanceof FormData) {
            for (let key of formData.keys()) {
              let values = formData.getAll(key);
              context.push(key+':'+values.join('&'));
            }
          } else if (formData  && formData instanceof Object) {
            for (let key in formData) {
              let values = formData[key];
              if (Array.isArray(values)) {
                context.push(key+':'+values.join('&'));
              } else {
                context.push(key+':'+values);
              }

            }
          }
          currentParams.context = context;
          that.$router.push({name:routeName,params : currentParams});

          //
          //
          //
          //
          // let url = '';
          // for (let key in params) {
          //     url += url?('&'+url):url;
          //     url += key + '=' + params[key];
          // }
          // that.$router.push(path[0] + '?' + url);
        },

        getFieldName(field) {
            return 's_' + field;
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
            return this.conf.searchType === 'basic' || this.conf.searchType === 'both';
        },
        hasAdvancedSearch() {
            //console.log("ASSS:::", this.conf);
            return this.conf.searchType === 'advanced' || this.conf.searchType === 'both';
        },
        hasAdvancedSearchAccordion() {
            //console.log("ASSS:::", this.conf);
            return this.conf.advancedSearchAccordion;
        },
        hasBothSearches() {
            return this.conf.searchType === 'both';
        },
        advancedSearchHeader() {
            if (this.conf.advancedSearchHeaderLabel) {
                return this.translate(this.conf.advancedSearchHeaderLabel);
            }
            if (this.hasBothSearches()) {
                return this.translate("app.ricerca_avanzata");
            }
            return this.translate("app.ricerca");
        },
        basicSearchClass() {
            if (this.hasBothSearches()) {
                return "col-12 md:col-4 lg:col-3";
            }
            return "col-12 md:col-6";
        },
        advancedSearchClass() {
            if (this.hasBothSearches()) {
                return "col-12 md:col-8 lg:col-9";
            }
            return "col-12";
        },
        hasSearchLabel() {
            if (this.conf.searchLabel === false  || this.conf.searchLabel === null) {
                return false;
            }
            return true;
        },
        _searchLabel() {
            console.debug('vSearch _searchLabel',this.conf.searchLabel)
            if (this.conf.searchLabel) {
                if (this.conf.searchLabel instanceof Function) {
                    return this.searchLabel.apply(this);
                }
                return this.translate(this.conf.searchLabel);
            }
            return this.translate("app.search_label");
        },
        isAdvancedSearchOpen() {
            return this.conf.advancedSearchOpen ? 0 : null;
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
            for  (let i in fields) {
                let w = that.getWidget(fields[i]);
                if (w) {
                    w._reset();
                }
            }
            setTimeout(function () {
                that.search();
            },10)
        },
        /**
         * setta i valori del widget ad eventuali valori presenti nell'url come s_{nome_campo}
         */
        setSearchParamsValue() {
          let that = this;
          let searchParams = that.getSearchParams();
          for (let key in searchParams) {
            let fieldName = key.substring(2); // tolgo il prefisso s_{fieldName}
            if (that.fields.indexOf(fieldName) >=0 )  {
                let w = this.getWidget(fieldName);
                if (w) {
                    w.setValue(searchParams[key]);
                }

              // let config = that.fieldsConfig[fieldName] || {};
              // config.value = searchParams[key];
              // that.fieldsConfig[fieldName] = config;
              // console.debug('has fieldName',fieldName,config)
            }
          }


            // let params = CrudHelpers.getContextParams(this);
            // console.debug('vSearch context params',params);
            // for (let param of params) {
            //     let tmp = param.split(':');
            //     console.debug('vSearch param',tmp);
            //     let field = tmp[0].substring(2);
            //     console.debug('vSearch field',field);
            //     let w = this.getWidget(field);
            //     if (w) {
            //         w.setValue(tmp[1]);
            //     }
            //
            // }
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
