const mongoose = require('mongoose');
const ModuleConfig = require('./src/models/ModuleConfig');
const seed = require('./src/config/moduleRegistry.seed');
const path = ModuleConfig.schema.path('columns');
console.log('columns path', path.instance);
console.log('columns caster', path?.caster?.instance);
console.log('columns schema', !!path?.schema);
if(path?.schema) console.log('columns schema paths', Object.keys(path.schema.paths));
const entry = seed.find((e) => e.moduleKey === 'settings/setting/business');
console.log('entry columns type', Array.isArray(entry.columns), entry.columns.length, entry.columns[0]);
const doc = new ModuleConfig(entry);
console.log('doc columns', doc.columns);
console.log('doc columns type', Array.isArray(doc.columns), doc.columns.length);
console.log('doc columns first instance', doc.columns[0], typeof doc.columns[0]);
try { doc.validateSync(); console.log('validateSync ok') } catch (err) { console.error('validateSync err', err.message); console.error(err.errors); }
