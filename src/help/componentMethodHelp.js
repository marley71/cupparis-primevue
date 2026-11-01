import { buildInheritance } from "./widgetMethodHelp";

const actionModules = import.meta.glob('../actions/_*.vue', { eager: true, query: '?raw', import: 'default' });
const dialogModules = import.meta.glob('../dialogs/_d*.vue', { eager: true, query: '?raw', import: 'default' });
const appModules = import.meta.glob('../app/_c*.vue', { eager: true, query: '?raw', import: 'default' });

function indexSources(modules) {
    const sources = {};
    Object.keys(modules).forEach(function (path) {
        const mod = modules[path];
        sources[path.split('/').pop()] = typeof mod === 'string' ? mod : ((mod && mod.default) || '');
    });
    return sources;
}

const actionSources = indexSources(actionModules);
const dialogSources = indexSources(dialogModules);
const appSources = indexSources(appModules);

const dialogFiles = {
    messageDialog: '_dMessage.vue',
    errorDialog: '_dError.vue',
    warningDialog: '_dWarning.vue',
    confirmDialog: '_dConfirm.vue',
    inputDialog: '_dInput.vue',
    customDialog: '_dCustom.vue',
    buttons: '_dCustom.vue',
    fcustom: '_dCustom.vue',
    vlist: '_dCustom.vue',
    vinsert: '_dCustom.vue',
    vview: '_dCustom.vue',
};

export function getActionContainerInheritance() {
    return buildInheritance('_cAction.vue', actionSources);
}

export function getActionBaseInheritance() {
    return buildInheritance('_aBase.vue', actionSources);
}

export function getDialogInheritance(command) {
    if (dialogFiles[command]) {
        return buildInheritance(dialogFiles[command], dialogSources);
    }
    if (!command) {
        return buildInheritance('_dBase.vue', dialogSources);
    }
    return buildInheritance('CrudComponent.vue', dialogSources);
}

export function getImportInheritance() {
    return buildInheritance('_cImport.vue', appSources);
}

export function getManageInheritance() {
    return buildInheritance('_cManage.vue', appSources);
}
