/**
 * Generate Dummy Staff Management Data
 * Creates realistic Indian textile business staff records
 */

const connectDB = require('../config/db');
const Role = require('../models/Role');
const Staff = require('../models/Staff');
const SalesPerson = require('../models/SalesPerson');
const Company = require('../models/Company');

// Indian names
const firstNames = [
  'Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anita', 'Rahul', 'Kavita',
  'Suresh', 'Meera', 'Anil', 'Deepa', 'Manoj', 'Pooja', 'Ravi', 'Sunita',
  'Kiran', 'Lakshmi', 'Ashok', 'Nisha', 'Vijay', 'Rani', 'Prakash', 'Sita'
];

const lastNames = [
  'Kumar', 'Singh', 'Sharma', 'Patel', 'Reddy', 'Rao', 'Nair', 'Iyer',
  'Gupta', 'Joshi', 'Mehta', 'Shah', 'Desai', 'Kulkarni', 'Verma', 'Pillai'
];

const departments = [
  'Sales', 'Operations', 'Accounts', 'Purchase', 'Warehouse', 'Quality Control',
  'Administration', 'IT', 'HR', 'Marketing'
];

const designations = [
  'Executive', 'Senior Executive', 'Manager', 'Assistant Manager', 'Team Leader',
  'Supervisor', 'Associate', 'Officer', 'Head', 'Coordinator'
];

const cities = [
  'Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Chennai', 'Kolkata',
  'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Coimbatore', 'Indore'
];

const states = [
  'Maharashtra', 'Karnataka', 'Delhi', 'Telangana', 'Tamil Nadu', 'West Bengal',
  'Rajasthan', 'Gujarat', 'Madhya Pradesh'
];

const territories = [
  'North India', 'South India', 'East India', 'West India',
  'Mumbai Region', 'Bangalore Region', 'Delhi NCR', 'Chennai Region',
  'Pune Region', 'Ahmedabad Region', 'Hyderabad Region', 'Kolkata Region'
];

// Helper functions
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const generatePhone = () => `${randomNumber(7, 9)}${randomNumber(100000000, 999999999)}`;
const generateEmail = (name) => `${name.toLowerCase().replace(' ', '.')}@templefabrics.com`;
const generateSalary = (role) => {
  const baseSalaries = {
    'Admin': [80000, 150000],
    'Manager': [50000, 90000],
    'Staff': [20000, 40000],
    'Sales': [25000, 50000]
  };
  const [min, max] = baseSalaries[role] || [20000, 40000];
  return randomNumber(min, max);
};

async function generateDummyStaff() {
  try {
    await connectDB();
    console.log('✓ Connected to MongoDB');

    // Find Temple Fabrics company
    const company = await Company.findOne({ code: 'TEMPFAB' });
    if (!company) {
      console.error('✗ Company TEMPFAB not found. Please run seed first.');
      process.exit(1);
    }
    console.log(`✓ Found company: ${company.name}`);

    // Find roles
    const roles = await Role.find({ company: company._id });
    if (roles.length === 0) {
      console.error('✗ No roles found. Please run: npm run seed:staff');
      process.exit(1);
    }
    console.log(`✓ Found ${roles.length} roles`);

    const roleMap = {};
    roles.forEach(role => {
      roleMap[role.roleName] = role;
    });

    // Check existing staff
    const existingCount = await Staff.countDocuments({ company: company._id });
    if (existingCount > 0) {
      console.log(`⚠ ${existingCount} staff members already exist`);
      console.log('  Skipping to avoid duplicates');
      process.exit(0);
    }

    // Generate staff members
    const staffMembers = [];
    const staffCount = randomNumber(15, 20);

    console.log(`\n📝 Generating ${staffCount} staff members...`);

    for (let i = 0; i < staffCount; i++) {
      const firstName = randomItem(firstNames);
      const lastName = randomItem(lastNames);
      const fullName = `${firstName} ${lastName}`;
      
      // Assign roles with realistic distribution
      let roleName;
      if (i < 2) roleName = 'Admin';
      else if (i < 5) roleName = 'Manager';
      else if (i < 10) roleName = 'Sales';
      else roleName = 'Staff';

      const role = roleMap[roleName];
      if (!role) continue;

      const department = randomItem(departments);
      const designation = randomItem(designations);
      const joiningDate = randomDate(new Date(2020, 0, 1), new Date(2024, 11, 31));
      const city = randomItem(cities);
      const state = randomItem(states);

      const staff = {
        company: company._id,
        name: fullName,
        email: generateEmail(fullName),
        mobile: generatePhone(),
        role: role._id,
        department,
        designation,
        joiningDate,
        allowLogin: i < 10, // First 10 staff can login
        address: {
          street: `${randomNumber(1, 999)}, ${randomItem(['MG Road', 'Main Street', 'Park Avenue', 'Ring Road'])}`,
          city,
          state,
          zipCode: `${randomNumber(400000, 600000)}`,
          country: 'India'
        },
        salary: generateSalary(roleName),
        isActive: true,
        emergencyContact: {
          name: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
          relationship: randomItem(['Spouse', 'Parent', 'Sibling']),
          phone: generatePhone()
        }
      };

      staffMembers.push(staff);
    }

    // Insert staff
    const createdStaff = await Staff.insertMany(staffMembers);
    console.log(`✓ Created ${createdStaff.length} staff members`);

    // Generate sales persons from sales staff
    const salesStaff = createdStaff.filter(s => {
      const role = roles.find(r => r._id.equals(s.role));
      return role && role.roleName === 'Sales';
    });

    console.log(`\n📝 Generating ${salesStaff.length} sales persons...`);

    const salesPersons = [];
    for (let i = 0; i < salesStaff.length; i++) {
      const staff = salesStaff[i];
      
      const salesPerson = {
        company: company._id,
        staff: staff._id,
        spName: staff.name,
        email: staff.email,
        mobile: staff.mobile,
        territory: randomItem(territories),
        targetType: randomItem(['monthly', 'quarterly', 'yearly']),
        salesTarget: randomNumber(500000, 2000000),
        commissionRate: randomNumber(1, 5),
        isDefault: i === 0, // First one is default
        isActive: true,
        performance: {
          totalSales: randomNumber(100000, 1000000),
          totalOrders: randomNumber(10, 100),
          totalCommission: randomNumber(5000, 50000),
          lastUpdated: new Date()
        }
      };

      salesPersons.push(salesPerson);
    }

    const createdSalesPersons = await SalesPerson.insertMany(salesPersons);
    console.log(`✓ Created ${createdSalesPersons.length} sales persons`);

    // Summary
    console.log('\n✅ Dummy Staff Management Data Generated Successfully!');
    console.log('\n📊 Summary:');
    console.log(`  • Staff Members: ${createdStaff.length}`);
    console.log(`  • Sales Persons: ${createdSalesPersons.length}`);
    console.log(`  • Roles: ${roles.length}`);
    
    console.log('\n📋 Role Distribution:');
    const roleCounts = {};
    for (const staff of createdStaff) {
      const role = roles.find(r => r._id.equals(staff.role));
      if (role) {
        roleCounts[role.roleName] = (roleCounts[role.roleName] || 0) + 1;
      }
    }
    Object.entries(roleCounts).forEach(([role, count]) => {
      console.log(`  • ${role}: ${count}`);
    });

    console.log('\n✅ Next steps:');
    console.log('  1. Restart backend server (if running)');
    console.log('  2. Navigate to /staff/staff to view staff');
    console.log('  3. Navigate to /staff/salesperson to view sales persons');
    console.log('  4. Test Add/Edit/Delete operations');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error generating dummy staff:', error);
    process.exit(1);
  }
}

generateDummyStaff();
