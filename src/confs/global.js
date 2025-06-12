export default {
    widgetOverloadMethods : [
        // questi sono i metodi che viene consentita la sovrascrittura nella conf.
        'change','reset','getFieldName','disabled',
        // metodi autocomplete
        'getAutocompleteLabel','search'
    ],
    viewOverloadMethods : [
        // questi sono i metodi che viene consentita la sovrascrittura nella conf.
        'beforeLoadData','afterLoadData',
    ]
}
