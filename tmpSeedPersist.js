require('dotenv').config();
const mongoose = require('mongoose');
const ModuleConfig = require('./src/models/ModuleConfig');
const seed = require('./src/config/moduleRegistry.seed');
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('NO_MONGO_URI');
  process.exit(1);
}

mongoose.connect(uri).then(async () => {
  console.log('connected');
  for (const entry of seed) {
    try {
      const existing = await ModuleConfig.findOne({ moduleKey: entry.moduleKey });
      if (existing) {
        await ModuleConfig.updateOne({ moduleKey: entry.moduleKey }, { $set: entry });
        console.log('updated', entry.moduleKey);
      } else {
        await ModuleConfig.create(entry);
        console.log('created', entry.moduleKey);
      }
    } catch (e) {
      console.error('ERROR', entry.moduleKey, e.message);
      if (e.errors) {
        console.error(JSON.stringify(Object.fromEntries(Object.entries(e.errors).map(([k, v]) => [k, v.message])), null, 2));
      }
      break;
    }
  }
  await mongoose.disconnect();
  process.exit(0);
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
