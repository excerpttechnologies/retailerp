require('dotenv').config();
const mongoose = require('mongoose');
const ModuleConfig = require('./src/models/ModuleConfig');
const seed = require('./src/config/moduleRegistry.seed');
console.log('model names', mongoose.modelNames());
const columnsPath = ModuleConfig.schema.path('columns');
console.log('ModuleConfig schema columns path', columnsPath?.instance);
console.log('ModuleConfig schema columns options type', typeof columnsPath?.options);
console.log('ModuleConfig schema columns caster', columnsPath?.caster?.instance);
console.log('ModuleConfig schema columns caster options type', typeof columnsPath?.caster?.options);
console.log('ModuleConfig schema columns tree type', typeof ModuleConfig.schema.tree.columns);
const entry = seed.find(e => e.moduleKey === 'settings/setting/business');
console.log('entry-found', !!entry);
console.log('entry columns isArray', Array.isArray(entry?.columns));
console.log('entry columns item type', entry?.columns?.length ? typeof entry.columns[0] : 'empty');
console.log('entry columns item', entry?.columns?.[0]);
try {
  const doc = new ModuleConfig(entry);
  console.log('new doc columns', doc.columns);
  console.log('new doc columns item type', typeof doc.columns[0], doc.columns[0]);
  doc.validateSync();
  console.log('validateSync ok');
} catch (err) {
  console.error('construct error', err);
}
