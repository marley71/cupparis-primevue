export default {
    modelName : null,
    search : null,
    insert : null, // se non specificato, e' uguale a edit
    edit : null,
    list : null,
    view : null, // se non specificato, e' uguale a edit
    custom : {},
    title : null,
    layout : null,
    sectionTitle : null,
    hideSearch : false,
    autoUpdateHash : true,
    constraintKey : null,
    constraintValue : null,
    editComponentName : 'v-edit',
    listComponentName : 'v-list',
    searchComponentName : 'v-search',
    insertComponentName : 'v-insert',
    viewComponentName : 'v-view',
    customComponentName : null,
    viewTitle : null,
    baseRouteName : 'manage', // indica il nome del path per la manage, di default e' manage ma in caso di oggetti estesi potrebbe essere diverso
    modalViewStyle : {"width": "50vw", "max-height": "90vh"},
    modalViewOkButton : false,
    modalViewHeaderCss : 'font-bold',
    viewInModal : true, // se true, la view viene mostrata in modalita' popup
}