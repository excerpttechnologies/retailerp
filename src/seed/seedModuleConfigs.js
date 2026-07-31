const ModuleConfig = require('../models/ModuleConfig');
const moduleRegistrySeed = require('../config/moduleRegistry.seed');

const isCollectionLimitError = (err) =>
  err?.code === 8000
  || err?.codeName === 'AtlasError'
  || /500 collections/i.test(err?.message || '');

/**
 * Idempotently upsert every module from moduleRegistry.seed.js into ModuleConfig.
 * Safe to run on every server boot — existing records are updated from seed.
 * Does not block startup if the DB cannot create new collections (Atlas free-tier limit).
 */
const seedModuleConfigs = async () => {
  let created = 0;
  let updated = 0;

  try {
    for (const entry of moduleRegistrySeed) {
      const existing = await ModuleConfig.findOne({ moduleKey: entry.moduleKey });
      if (existing) {
        await ModuleConfig.updateOne({ moduleKey: entry.moduleKey }, { $set: entry });
        updated += 1;
      } else {
        await ModuleConfig.create(entry);
        created += 1;
      }
    }

    console.log(`[Seed] ModuleConfig sync complete — ${created} created, ${updated} updated (${moduleRegistrySeed.length} total)`);
    return { created, updated, total: moduleRegistrySeed.length, skipped: false };
  } catch (err) {
    if (isCollectionLimitError(err)) {
      console.warn('[Seed] ModuleConfig sync skipped — MongoDB Atlas collection limit (500) reached.');
      console.warn('[Seed] Runtime will use moduleRegistry.seed.js directly. Drop unused collections or upgrade Atlas to persist ModuleConfig.');
      return { created: 0, updated: 0, total: moduleRegistrySeed.length, skipped: true };
    }
    throw err;
  }
};

module.exports = seedModuleConfigs;
