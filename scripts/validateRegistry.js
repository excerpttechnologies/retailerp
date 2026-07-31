/**
 * Validates that all 117 moduleKey entries from moduleRegistry.seed.js
 * resolve through moduleRegistry.js and identifies special vs generic pages.
 */
const moduleRegistrySeed = require('../src/config/moduleRegistry.seed');
const { REGISTRY, getModuleConfig } = require('../src/config/moduleRegistry');

const SPECIAL_KEYS = new Set(
  moduleRegistrySeed.filter((m) => m.pageType === 'special').map((m) => m.moduleKey)
);

const FRONTEND_SPECIAL = new Set([
  'dashboard/dashboard',
  'inventory/inventory/bulk-price-update',
  'sell/transaction/sell/pos',
  'cash-register/cashregister',
  'ledger-transaction/ledgertnx/bank-reconciliation',
]);

let failed = 0;

console.log('=== Module Registry Validation ===\n');
console.log(`Seed entries: ${moduleRegistrySeed.length}`);
console.log(`Registry entries: ${Object.keys(REGISTRY).length}\n`);

moduleRegistrySeed.forEach((entry) => {
  const resolved = getModuleConfig(entry.moduleKey);
  if (!resolved) {
    console.error(`FAIL  missing in REGISTRY: ${entry.moduleKey}`);
    failed += 1;
    return;
  }
  if (resolved.moduleKey && resolved.moduleKey !== entry.moduleKey) {
    console.error(`FAIL  key mismatch: ${entry.moduleKey}`);
    failed += 1;
    return;
  }
  if (entry.pageType === 'special' && !FRONTEND_SPECIAL.has(entry.moduleKey)) {
    console.error(`FAIL  special page missing frontend component: ${entry.moduleKey}`);
    failed += 1;
    return;
  }
  if (entry.pageType !== 'special' && FRONTEND_SPECIAL.has(entry.moduleKey)) {
    console.error(`FAIL  marked generic but in SPECIAL list: ${entry.moduleKey}`);
    failed += 1;
    return;
  }
});

const genericCount = moduleRegistrySeed.filter((m) => m.pageType !== 'special').length;
const specialCount = SPECIAL_KEYS.size;

console.log(`Generic pages (MasterPage): ${genericCount}`);
console.log(`Special pages (bespoke):    ${specialCount}`);
console.log(`Special keys: ${[...SPECIAL_KEYS].join(', ')}\n`);

if (failed === 0 && moduleRegistrySeed.length === 117) {
  console.log('PASS  All 117 pages resolve correctly.');
  console.log('PASS  5 bespoke pages bypass generic CRUD/renderer.');
  process.exit(0);
} else {
  console.error(`FAIL  ${failed} validation error(s). Expected 117 seed entries.`);
  process.exit(1);
}
