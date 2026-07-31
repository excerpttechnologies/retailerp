require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const seedModuleConfigs = require('./seedModuleConfigs');

const run = async () => {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || 'adminonly@gmail.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '123456';

  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({
      name: 'Super Admin',
      email,
      password,
      isSuperAdmin: true,
      status: 'active',
    });
    console.log(`[Seed] Super admin created -> email: ${email} | password: ${password}`);
    console.log('[Seed] IMPORTANT: change this password after first login.');
  } else {
    console.log(`[Seed] Super admin already exists: ${email}`);
  }

  await seedModuleConfigs();

  process.exit(0);
};

run().catch((err) => {
  console.error('[Seed] Error:', err.message);
  process.exit(1);
});
