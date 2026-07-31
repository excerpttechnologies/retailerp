const mongoose = require('mongoose');
const ModuleConfig = require('./src/models/ModuleConfig');
const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/groo_erp';

(async () => {
  try {
    await mongoose.connect(uri);
    console.log('connected');
    const docs = await ModuleConfig.find({}).lean().limit(50);
    const bad = docs.filter(doc => doc.columns && doc.columns.length && typeof doc.columns[0] === 'string');
    console.log('badCount', bad.length);
    if (bad.length) {
      for (const doc of bad) {
        console.log('BAD:', doc.moduleKey, doc.columns[0]);
      }
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
