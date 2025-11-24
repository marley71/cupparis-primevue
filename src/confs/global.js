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

    // questi metodi NON e' consentito la sovrascrittura nella conf. se succede viene tirato su un errore.
    actionReservedKeys : [
        '_disabled','_visible','_text','_icon','_href'
    ]
}
