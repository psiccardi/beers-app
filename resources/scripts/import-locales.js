import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import i18nText from './templates/i18nText.js';
import localeText from './templates/components.Locale.vue.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const locales = fs.readdirSync(__dirname + '/../locales')

let IMPORT_SECTION = '';
let LOCALES_SECTION = '';
let LANGS_OBJECT = "";

for (let i=0; i<locales.length; i++) {
    console.log('locales[i]', locales[i]);
    const locale = locales[i].split('.')[0];
    IMPORT_SECTION += `
import ${locale} from './../../locales/${locales[i]}'`;
LOCALES_SECTION += locale + ', ';
    const localeObj = JSON.parse(fs.readFileSync(__dirname + '/../locales/' + locales[i]));
    LANGS_OBJECT += `       {code: '${locale}', text: '${localeObj.language}'},\n`
}

LANGS_OBJECT = LANGS_OBJECT.trimEnd()

/**
 * Edit ./../js/i18n/index.js
 */
let _i18nText = i18nText;
_i18nText = _i18nText.replace('{{ LOCALES_SECTION }}', LOCALES_SECTION);
_i18nText = _i18nText.replace('{{ IMPORT_SECTION }}', IMPORT_SECTION);
fs.writeFileSync(__dirname + '/../js/i18n/index.js', _i18nText, { flag: 'w'})

/**
 * Edit ./../src/components/Locale.vue
 */
let _localeText = localeText;
_localeText = _localeText.replace('{{ LANGS_OBJECT }}', LANGS_OBJECT);
fs.writeFileSync(__dirname + '/../src/components/Locale.vue', _localeText, {flag: 'w'});
/*
{ code: "en", text: "English" },
{ code: "it", text: "Italiano" },
*/
