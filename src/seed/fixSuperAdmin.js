/**
 * Fix Super Admin - Ensure isSuperAdmin flag is set
 */

const connectDB = require('../config/db');
const User = require('../models/User');

async function fixSuperAdmin() {
  try {
    await connectDB();
    console.log('✓ Connected to MongoDB');

    const email = (process.env.ADMIN_EMAIL || 'adminonly@gmail.com').toLowerCase();
    
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`✗ User not found: ${email}`);
      process.exit(1);
    }

    console.log(`✓ Found user: ${user.name} (${user.email})`);
    console.log(`  Current isSuperAdmin: ${user.isSuperAdmin}`);
    console.log(`  Current status: ${user.status}`);
    console.log(`  Current role: ${user.role}`);
    console.log(`  Current company: ${user.company}`);

    if (user.isSuperAdmin) {
      console.log('✓ User is already a super admin');
    } else {
      await User.updateOne(
        { _id: user._id },
        { $set: { isSuperAdmin: true, status: 'active' } }
      );
      console.log('✓ Updated user to super admin');
    }

    // Verify
    const updated = await User.findOne({ email });
    console.log('\n✓ Verification:');
    console.log(`  isSuperAdmin: ${updated.isSuperAdmin}`);
    console.log(`  status: ${updated.status}`);

    console.log('\n✓ Fix complete! Please restart the backend server.');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error fixing super admin:', error);
    process.exit(1);
  }
}

fixSuperAdmin();
