import { buildInheritance } from "./widgetMethodHelp";

const viewModules = import.meta.glob('../views/_v*.vue', {
    eager: true,
    query: '?raw',
    import: 'default',
});

const sourceByFile = {};
for (const path in viewModules) {
    const file = path.split('/').pop();
    const mod = viewModules[path];
    sourceByFile[file] = typeof mod === 'string' ? mod : ((mod && mod.default) || '');
}

export function viewFileForType(type) {
    if (!type || type.indexOf('v-') !== 0) {
        return null;
    }
    const pascal = type.slice(2).split('-').filter(Boolean).map(function (part) {
        return part.charAt(0).toUpperCase() + part.slice(1);
    }).join('');
    return '_v' + pascal + '.vue';
}

export function getViewInheritance(type) {
    let file = viewFileForType(type);
    if (!file || !sourceByFile[file]) {
        file = '_vBase.vue';
    }
    return buildInheritance(file, sourceByFile);
}
