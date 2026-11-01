/**
 * Estrae i metodi dichiarati nel blocco `methods` di un componente widget
 * e la descrizione presa dal commento immediatamente precedente, se c'è.
 */

import crudComponentSource from '../CrudComponent.vue?raw';

const widgetModules = import.meta.glob('../widgets/_w*.vue', {
    eager: true,
    query: '?raw',
    import: 'default',
});

const sourceByFile = {};
for (const path in widgetModules) {
    const file = path.split('/').pop();
    const mod = widgetModules[path];
    sourceByFile[file] = typeof mod === 'string' ? mod : ((mod && mod.default) || '');
}

export function widgetFileForType(type) {
    if (!type || type.indexOf('w-') !== 0) {
        return null;
    }
    const pascal = type.slice(2).split('-').filter(Boolean).map(function (part) {
        return part.charAt(0).toUpperCase() + part.slice(1);
    }).join('');
    return '_w' + pascal + '.vue';
}

export function getBaseMethodHelp() {
    return parseWidgetMethods(sourceByFile['_wBase.vue'] || '');
}

export function getCrudComponentMethodHelp() {
    return parseWidgetMethods(crudComponentSource);
}

export function getWidgetMethodHelp(type) {
    const file = widgetFileForType(type);
    if (!file || file === '_wBase.vue' || !sourceByFile[file]) {
        return [];
    }
    return parseWidgetMethods(sourceByFile[file]);
}

export function getWidgetInheritance(type) {
    let file = widgetFileForType(type);
    if (!file || !sourceByFile[file]) {
        file = '_wBase.vue';
    }
    return buildInheritance(file, sourceByFile);
}

export function buildInheritance(startFile, sources) {
    const names = [];
    const groups = [];
    let file = startFile;
    const seen = {};
    while (file && !seen[file]) {
        seen[file] = true;
        const name = file.replace(/\.vue$/, '');
        const source = name === 'CrudComponent' ? crudComponentSource : sources[file];
        if (!source) {
            break;
        }
        names.push(name);
        const methods = parseWidgetMethods(source);
        if (methods.length) {
            groups.push({
                file: file,
                name: name,
                methods: methods,
            });
        }
        if (name === 'CrudComponent') {
            break;
        }
        const parent = parentComponent(source);
        if (!parent) {
            break;
        }
        file = parent + '.vue';
    }
    return {
        chain: names,
        groups: groups,
    };
}

function parentComponent(source) {
    const match = source.match(/\bextends\s*:\s*([A-Za-z_][A-Za-z0-9_]*)/);
    return match ? match[1] : null;
}

export function parseWidgetMethods(source) {
    if (!source) {
        return [];
    }
    const scriptMatch = source.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i);
    const code = scriptMatch ? scriptMatch[1] : source;
    const body = extractMethodsBody(code);
    if (body == null) {
        return [];
    }
    return scanMethods(body);
}

function extractMethodsBody(code) {
    let i = 0;
    const n = code.length;
    let state = 'code';
    while (i < n) {
        const c = code[i];
        if (state === 'line') {
            if (c === '\n') {
                state = 'code';
            }
            i++;
            continue;
        }
        if (state === 'block') {
            if (c === '*' && code[i + 1] === '/') {
                state = 'code';
                i += 2;
                continue;
            }
            i++;
            continue;
        }
        if (state === 'sq' || state === 'dq' || state === 'tpl') {
            if (c === '\\') {
                i += 2;
                continue;
            }
            const end = state === 'sq' ? "'" : (state === 'dq' ? '"' : '`');
            if (c === end) {
                state = 'code';
            }
            i++;
            continue;
        }
        if (c === '/' && code[i + 1] === '/') {
            state = 'line';
            i += 2;
            continue;
        }
        if (c === '/' && code[i + 1] === '*') {
            state = 'block';
            i += 2;
            continue;
        }
        if (c === "'") {
            state = 'sq';
            i++;
            continue;
        }
        if (c === '"') {
            state = 'dq';
            i++;
            continue;
        }
        if (c === '`') {
            state = 'tpl';
            i++;
            continue;
        }
        if (isIdentStart(c)) {
            const start = i;
            i++;
            while (i < n && isIdentPart(code[i])) {
                i++;
            }
            if (code.slice(start, i) === 'methods') {
                let j = skipWsAndComments(code, i);
                if (code[j] === ':') {
                    j = skipWsAndComments(code, j + 1);
                    if (code[j] === '{') {
                        const end = matchCloser(code, j, '{', '}');
                        if (end > j) {
                            return code.slice(j + 1, end);
                        }
                    }
                }
            }
            continue;
        }
        i++;
    }
    return null;
}

function scanMethods(body) {
    const methods = [];
    let i = 0;
    let pending = [];
    const n = body.length;
    while (i < n) {
        while (i < n && isWs(body[i])) {
            i++;
        }
        if (i >= n) {
            break;
        }
        if (body[i] === ',') {
            i++;
            continue;
        }
        if (body.startsWith('//', i)) {
            const end = body.indexOf('\n', i);
            pending.push({type: 'line', text: body.slice(i + 2, end === -1 ? n : end)});
            i = end === -1 ? n : end + 1;
            continue;
        }
        if (body.startsWith('/*', i)) {
            const end = body.indexOf('*/', i + 2);
            pending.push({type: 'block', text: body.slice(i + 2, end === -1 ? n : end)});
            i = end === -1 ? n : end + 2;
            continue;
        }
        const parsed = readProperty(body, i);
        if (!parsed) {
            break;
        }
        if (parsed.method && parsed.name.charAt(0) !== '_') {
            const description = formatComments(pending);
            methods.push({
                name: parsed.name,
                signature: (parsed.async ? 'async ' : '') + parsed.name + '(' + parsed.params + ')',
                description: description,
            });
        }
        pending = [];
        i = parsed.next;
    }
    return methods;
}

function readProperty(body, i) {
    let asyncFlag = false;
    let j = i;
    if (matchWord(body, j, 'async')) {
        const after = skipWs(body, j + 5);
        if (after !== j + 5 && isIdentStart(body[after])) {
            asyncFlag = true;
            j = after;
        }
    }
    let name = null;
    if (body[j] === "'" || body[j] === '"') {
        const quote = body[j];
        const end = body.indexOf(quote, j + 1);
        if (end < 0) {
            return null;
        }
        name = body.slice(j + 1, end);
        j = end + 1;
    } else if (isIdentStart(body[j])) {
        const start = j;
        j++;
        while (isIdentPart(body[j])) {
            j++;
        }
        name = body.slice(start, j);
    } else {
        return null;
    }
    j = skipWsAndComments(body, j);
    if (body[j] === '(') {
        const paramsEnd = matchCloser(body, j, '(', ')');
        if (paramsEnd < 0) {
            return null;
        }
        const params = cleanParams(body.slice(j + 1, paramsEnd));
        let k = skipWsAndComments(body, paramsEnd + 1);
        if (body[k] !== '{') {
            return null;
        }
        const bodyEnd = matchCloser(body, k, '{', '}');
        if (bodyEnd < 0) {
            return null;
        }
        return {method: true, name: name, async: asyncFlag, params: params, next: bodyEnd + 1};
    }
    if (body[j] === ':') {
        j = skipWsAndComments(body, j + 1);
        let fnAsync = false;
        if (matchWord(body, j, 'async')) {
            const afterAsync = skipWs(body, j + 5);
            if (matchWord(body, afterAsync, 'function')) {
                fnAsync = true;
                j = afterAsync;
            }
        }
        if (matchWord(body, j, 'function')) {
            j = skipWs(body, j + 8);
            if (isIdentStart(body[j])) {
                j++;
                while (isIdentPart(body[j])) {
                    j++;
                }
                j = skipWs(body, j);
            }
            if (body[j] !== '(') {
                return null;
            }
            const paramsEnd = matchCloser(body, j, '(', ')');
            if (paramsEnd < 0) {
                return null;
            }
            const params = cleanParams(body.slice(j + 1, paramsEnd));
            let k = skipWsAndComments(body, paramsEnd + 1);
            if (body[k] !== '{') {
                return null;
            }
            const bodyEnd = matchCloser(body, k, '{', '}');
            if (bodyEnd < 0) {
                return null;
            }
            return {method: true, name: name, async: asyncFlag || fnAsync, params: params, next: bodyEnd + 1};
        }
        const next = skipValue(body, j);
        return {method: false, next: next};
    }
    return null;
}

function skipValue(code, i) {
    let j = skipWsAndComments(code, i);
    if (code[j] === '{' || code[j] === '[' || code[j] === '(') {
        const close = code[j] === '{' ? '}' : (code[j] === '[' ? ']' : ')');
        const end = matchCloser(code, j, code[j], close);
        return end < 0 ? code.length : end + 1;
    }
    if (code[j] === "'" || code[j] === '"' || code[j] === '`') {
        const end = matchString(code, j);
        return end < 0 ? code.length : end + 1;
    }
    while (j < code.length && code[j] !== ',' && code[j] !== '}') {
        j++;
    }
    return j;
}

function formatComments(pending) {
    const parts = [];
    for (let i = 0; i < pending.length; i++) {
        const comment = pending[i];
        if (comment.type === 'block') {
            const text = cleanBlock(comment.text);
            if (text) {
                parts.push(text);
            }
        } else if (isProseLine(comment.text)) {
            parts.push(comment.text.trim());
        }
    }
    return parts.join('\n').trim();
}

function cleanBlock(raw) {
    return raw.split('\n').map(function (line) {
        return line.replace(/^\s*\*\s?/, '').trim();
    }).filter(function (line) {
        return line.length > 0;
    }).join('\n');
}

function isProseLine(line) {
    const text = (line || '').trim();
    if (!text || text.indexOf('//') === 0) {
        return false;
    }
    if (/[=;{}]/.test(text)) {
        return false;
    }
    if (/^(console|if|else|let|var|const|return|this|for|while|switch|function|import|export|case|break|continue|new|typeof|await|yield|window|that|conf|event)\b/.test(text)) {
        return false;
    }
    if (/^(that|conf|event|window|this)\./.test(text)) {
        return false;
    }
    if (text.split(/\s+/).length < 3) {
        return false;
    }
    return true;
}

function cleanParams(raw) {
    return raw.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ').replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ').trim();
}

function matchString(code, i) {
    const quote = code[i];
    let j = i + 1;
    while (j < code.length) {
        if (code[j] === '\\') {
            j += 2;
            continue;
        }
        if (code[j] === quote) {
            return j;
        }
        j++;
    }
    return -1;
}

function matchCloser(code, openIndex, openChar, closeChar) {
    let i = openIndex + 1;
    let depth = 1;
    let state = 'code';
    let lastToken = openChar;
    while (i < code.length) {
        const c = code[i];
        if (state === 'line') {
            if (c === '\n') {
                state = 'code';
            }
            i++;
            continue;
        }
        if (state === 'block') {
            if (c === '*' && code[i + 1] === '/') {
                state = 'code';
                i += 2;
                continue;
            }
            i++;
            continue;
        }
        if (state === 'sq' || state === 'dq') {
            if (c === '\\') {
                i += 2;
                continue;
            }
            if (c === (state === 'sq' ? "'" : '"')) {
                state = 'code';
                lastToken = c;
            }
            i++;
            continue;
        }
        if (state === 'tpl') {
            if (c === '\\') {
                i += 2;
                continue;
            }
            if (c === '`') {
                state = 'code';
                lastToken = '`';
                i++;
                continue;
            }
            if (c === '$' && code[i + 1] === '{') {
                const endExpr = matchCloser(code, i + 1, '{', '}');
                i = endExpr < 0 ? code.length : endExpr + 1;
                lastToken = '}';
                continue;
            }
            i++;
            continue;
        }
        if (state === 'regex') {
            if (c === '\\') {
                i += 2;
                continue;
            }
            if (c === '[') {
                state = 'regexClass';
                i++;
                continue;
            }
            if (c === '/') {
                state = 'code';
                lastToken = '/';
                i++;
                continue;
            }
            i++;
            continue;
        }
        if (state === 'regexClass') {
            if (c === '\\') {
                i += 2;
                continue;
            }
            if (c === ']') {
                state = 'regex';
            }
            i++;
            continue;
        }
        if (c === '/' && code[i + 1] === '/') {
            state = 'line';
            i += 2;
            continue;
        }
        if (c === '/' && code[i + 1] === '*') {
            state = 'block';
            i += 2;
            continue;
        }
        if (c === "'") {
            state = 'sq';
            i++;
            continue;
        }
        if (c === '"') {
            state = 'dq';
            i++;
            continue;
        }
        if (c === '`') {
            state = 'tpl';
            i++;
            continue;
        }
        if (c === '/' && canStartRegex(lastToken)) {
            state = 'regex';
            i++;
            continue;
        }
        if (isIdentStart(c)) {
            const start = i;
            i++;
            while (i < code.length && isIdentPart(code[i])) {
                i++;
            }
            lastToken = code.slice(start, i);
            continue;
        }
        if (c === openChar) {
            depth++;
            lastToken = c;
            i++;
            continue;
        }
        if (c === closeChar) {
            depth--;
            if (depth === 0) {
                return i;
            }
            lastToken = c;
            i++;
            continue;
        }
        if (!isWs(c)) {
            if ((c === '=' || c === '&' || c === '|' || c === '!' || c === '<' || c === '>') && code[i + 1] === c) {
                lastToken = c + c;
                i += 2;
                if (code[i] === '=') {
                    lastToken += '=';
                    i++;
                }
                continue;
            }
            if (c === '=' && code[i + 1] === '>') {
                lastToken = '=>';
                i += 2;
                continue;
            }
            lastToken = c;
        }
        i++;
    }
    return -1;
}

function canStartRegex(token) {
    if (!token) {
        return true;
    }
    if (/^(return|throw|case|typeof|void|delete|in|of|instanceof|else|do|await|yield|new)$/.test(token)) {
        return true;
    }
    return /^[\(\[{,;=:?!&|+\-*%~^<>]$/.test(token)
        || token === '=>'
        || token === '&&'
        || token === '||'
        || token === '=='
        || token === '==='
        || token === '!='
        || token === '!==';
}

function skipWs(code, i) {
    while (i < code.length && isWs(code[i])) {
        i++;
    }
    return i;
}

function skipWsAndComments(code, i) {
    while (i < code.length) {
        if (isWs(code[i])) {
            i++;
            continue;
        }
        if (code.startsWith('//', i)) {
            const end = code.indexOf('\n', i);
            i = end === -1 ? code.length : end + 1;
            continue;
        }
        if (code.startsWith('/*', i)) {
            const end = code.indexOf('*/', i + 2);
            i = end === -1 ? code.length : end + 2;
            continue;
        }
        break;
    }
    return i;
}

function matchWord(code, i, word) {
    if (!code.startsWith(word, i)) {
        return false;
    }
    const after = code[i + word.length];
    return after === undefined || !isIdentPart(after);
}

function isWs(c) {
    return c === ' ' || c === '\n' || c === '\r' || c === '\t';
}

function isIdentStart(c) {
    return c && /[A-Za-z_$]/.test(c);
}

function isIdentPart(c) {
    return c && /[A-Za-z0-9_$]/.test(c);
}
