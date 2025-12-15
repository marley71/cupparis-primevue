const defaultConf = () => {
    return {
        name : '',
        value: null,
        defaultValue : null,
        placeholder : '',
        extraBind: {},
        type : 'w-input',
        label : '',
        rules:'',
        customRules : {},
        rowType : '',
        errors : [],
        inPopup : false, // per alcuni controlli permette di eseguire css se visualizzati in popup
    }
}
const WidgetConf = {
    wAutocomplete:() => {
        return {
            ...defaultConf(),
            route:null,
            suggestions:[],
            autocompleteValue:null,
            autocompleteParams:null,
            clearButton:false,
            extraBind:{
                "option-label":"label",
            },
        }
    },
    wInput:() => {
        return {
            ...defaultConf(),
            type : 'w-input',
        }
    },
    wDatePicker: () => {
        return {
            ...defaultConf(),
            type : 'w-date-picker',
        }
    },
    wDateRangePicker : () => {
        return {
            ...defaultConf(),
            type : 'w-date-range-picker',
        }
    },
    wAutocomplete : () => {
        return {
            ...defaultConf(),
            type : 'w-autocomplete',
        }
    },
    wBelongsto : () => {
        return {
            ...defaultConf(),
            type : 'w-belongsto',
        }
    },
    wBelongstoMany : () => {
        return {
            ...defaultConf(),
            type : 'w-belongsto-many',
        }
    },
    wCheckbox : () => {
        return {
            ...defaultConf(),
            type : 'w-checkbox',
        }
    },
    wChip : () => {
        return {
            ...defaultConf(),
            type : 'w-chip',
        }
    },
    wColorPicker : () => {
        return {
            ...defaultConf(),
            type : 'w-color-picker',
        }
    },
    wCustom : () => {
        return {
            ...defaultConf(),
            type : 'w-custom',
        }
    },
    wEditor : () => {
        return {
            ...defaultConf(),
            type : 'w-editor',
        }
    },
    wHasmany : () => {
        return {
            ...defaultConf(),
            type : 'w-hasmany',
        }
    },
    wHasmanyListed : () => {
        return {
            ...defaultConf(),
            type : 'w-hasmany-listed',
        }
    },
    wHidden : () => {
        return {
            ...defaultConf(),
            type : 'w-hidden',
        }
    },
    wInputSet : () => {
        return {
            ...defaultConf(),
            type : 'w-input-set',
        }
    },
    wObject : () => {
        return {
            ...defaultConf(),
            type : 'w-object',
        }
    },
    wMultiSelect : () => {
        return {
            ...defaultConf(),
            type : 'w-multi-select',
        }
    },
    wRadio : () => {
        return {
            ...defaultConf(),
            type : 'w-radio',
        }
    },
    wSelect : () => {
        return {
            ...defaultConf(),
            type : 'w-select',
        }
    },  
    wSelectButton : () => {
        return {
            ...defaultConf(),
            type : 'w-select-button',
        }
    },  
    wTable : () => {
        return {
            ...defaultConf(),
            type : 'w-table',
        }
    },  
    wLeafLeft : () => {
        return {
            ...defaultConf(),
            type : 'w-leaf-let',
        }
    },  
    wLeafLeftIcon : () => {
        return {
            ...defaultConf(),
            type : 'w-leaf-let-icon',
        }
    }
}
export default WidgetConf;