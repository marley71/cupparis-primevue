export default {
    // questi sono i metodi che viene consentita la sovrascrittura nella conf e vengono gestiti dalla libreria.
    widgetOverloadMethods : [
        // metodi comuni a tutti i widget
        'change','reset','getFieldName','disabled',
        // metodi autocomplete
        'getAutocompleteLabel','search'
    ],
    viewOverloadMethods : [
        'beforeLoadData','afterLoadData',
    ],
    actionOverloadMethods : [
        'href','text','icon','execute'
    ],
 
    dialogOverloadMethods : [
        'hide'
    ],
    // questi metodi NON e' consentito la sovrascrittura nella conf. se succede viene tirato su un errore.
    actionReservedKeys : [
        '_disabled','_visible','_text','_icon','_href','_title','_click'
    ],
    overloadMethodsCheck : false, // se true verifica se il metodo e' consentito, se false non verifica
    // questa configurazione viene usata per dire alla libreria quale configurazione usare per i widgets creati nell'applicazione
    widgetWrapperConf : {
        //'my-widget' : 'w-input',   esempio per dire che il mio widget my-widget usa la configurazione w-input
    }
}
