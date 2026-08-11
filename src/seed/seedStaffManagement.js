/**
 * Seed Staff Management Data
 * Creates initial roles: Admin, Manager, Staff, Sales
 */

const mongoose = require('mongoose');
const Role = require('../models/Role');
const Company = require('../models/Company');
const connectDB = require('../config/db');

const defaultRoles = [
  {
    roleName: 'Admin',
    description: 'Full system access with all permissions',
    isSystemRole: true,
    isActive: true,
    permissions: [
      { module: 'inventory', actions: ['view', 'create', 'edit', 'delete'] },
      { module: 'contacts', actions: ['view', 'create', 'edit', 'delete'] },
      { module: 'purchase', actions: ['view', 'create', 'edit', 'delete'] },
      { module: 'sell', actions: ['view', 'create', 'edit', 'delete'] },
      { module: 'staff', actions: ['view', 'create', 'edit', 'delete'] },
      { module: 'settings', actions: ['view', 'create', 'edit', 'delete'] },
      { module: 'reports', actions: ['view', 'create', 'edit', 'delete'] }
    ]
  },
  {
    roleName: 'Manager',
    description: 'Management level access with most permissions',
    isSystemRole: true,
    isActive: true,
    permissions: [
      { module: 'inventory', actions: ['view', 'create', 'edit'] },
      { module: 'contacts', actions: ['view', 'create', 'edit'] },
      { module: 'purchase', actions: ['view', 'create', 'edit'] },
      { module: 'sell', actions: ['view', 'create', 'edit'] },
      { module: 'staff', actions: ['view'] },
      { module: 'reports', actions: ['view'] }
    ]
  },
  {
    roleName: 'Staff',
    description: 'Basic staff access with limited permissions',
    isSystemRole: true,
    isActive: true,
    permissions: [
      { module: 'inventory', actions: ['view'] },
      { module: 'contacts', actions: ['view'] },
      { module: 'purchase', actions: ['view', 'create'] },
      { module: 'sell', actions: ['view', 'create'] }
    ]
  },
  {
    roleName: 'Sales',
    description: 'Sales team access focused on sales and customers',
    isSystemRole: true,
    isActive: true,
    permissions: [
      { module: 'inventory', actions: ['view'] },
      { module: 'contacts', actions: ['view', 'create', 'edit'] },
      { module: 'sell', actions: ['view', 'create', 'edit'] },
      { module: 'reports', actions: ['view'] }
    ]
  }
];

async function seedStaffManagement() {
  try {
    await connectDB();
    console.log('✓ Connected to MongoDB');

    // Find Temple Fabrics company (TEMPFAB)
    const company = await Company.findOne({ code: 'TEMPFAB' });
    if (!company) {
      console.error('✗ Company TEMPFAB not found. Please run company seed first.');
      process.exit(1);
    }
    console.log(`✓ Found company: ${company.name} (${company.code})`);

    // Check existing roles
    const existingRoles = await Role.find({ company: company._id });
    if (existingRoles.length > 0) {
      console.log(`⚠ ${existingRoles.length} roles already exist for ${company.name}`);
      console.log('  Skipping seed to avoid duplicates');
      console.log('  To force re-seed, delete existing roles first');
      process.exit(0);
    }

    // Create roles
    const rolesToCreate = defaultRoles.map(role => ({
      ...role,
      company: company._id
    }));

    const createdRoles = await Role.insertMany(rolesToCreate);
    console.log(`✓ Created ${createdRoles.length} default roles:`);
    createdRoles.forEach(role => {
      console.log(`  - ${role.roleName} (${role.permissions.length} permission sets)`);
    });

    console.log('\n✓ Staff Management seed completed successfully!');
    console.log('\nNext steps:');
    console.log('  1. Restart backend server to load new routes');
    console.log('  2. Run: npm run seed to update module registry');
    console.log('  3. Navigate to /staff/roles to view roles');
    console.log('  4. Navigate to /staff/staff to add staff members');
    console.log('  5. Navigate to /staff/salesperson to add sales persons');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding staff management:', error);
    process.exit(1);
  }
}

seedStaffManagement();
