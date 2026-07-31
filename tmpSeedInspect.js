const seed = require('./src/config/moduleRegistry.seed');
const entry = seed.find(e => e.moduleKey === 'settings/setting/business');
console.log('entry type', typeof seed, Array.isArray(seed));
console.log('entry found', !!entry);
console.log('columns type', Array.isArray(entry.columns));
console.log('columns first type', entry.columns.length ? typeof entry.columns[0] : 'empty');
console.log('columns first', entry.columns[0]);
console.log('stringify', JSON.stringify(entry.columns, null, 2));
