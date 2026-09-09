const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const User = require('./src/models/User');

const seedAdminUser = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('[Error] MONGODB_URI not found in .env');
      process.exit(1);
    }

    console.log('[Connecting] Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('[MongoDB] Connected successfully');

    const adminEmail = 'admin@thayhotb.vn';
    const adminPassword = 'Admin@123456';

    let user = await User.findOne({ email: adminEmail });

    if (user) {
      console.log(`[Admin] User ${adminEmail} already exists. Updating password...`);
      user.password = adminPassword;
      user.role = 'admin';
      user.name = 'Thầy HOTB (Admin)';
      await user.save();
      console.log(`[Admin] ✅ Updated admin account: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log(`[Admin] Creating default admin account: ${adminEmail}...`);
      user = await User.create({
        name: 'Thầy HOTB (Admin)',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        avatar: '/images/instructor-avatar.jpg',
      });
      console.log(`[Admin] ✅ Created default admin account: ${adminEmail} / ${adminPassword}`);
    }

    await mongoose.disconnect();
    console.log('[Done] MongoDB disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('[Error] Failed to seed admin user:', error);
    process.exit(1);
  }
};

seedAdminUser();
