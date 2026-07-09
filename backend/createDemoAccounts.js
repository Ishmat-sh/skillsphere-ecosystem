const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createDemoAccounts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skillsphere');
    
    const User = require('./models/User');
    const Client = require('./models/Client');
    const Freelancer = require('./models/Freelancer');
    
    // Check if demo accounts already exist
    const existingClient = await User.findOne({ email: 'client@demo.com' });
    const existingFreelancer = await User.findOne({ email: 'freelancer@demo.com' });
    
    if (existingClient || existingFreelancer) {
      console.log('Demo accounts already exist. Updating passwords...');
      
      if (existingClient) {
        const clientPassword = await bcrypt.hash('Client@123', await bcrypt.genSalt(10));
        existingClient.password = clientPassword;
        await existingClient.save();
        console.log('Client password updated');
      }
      
      if (existingFreelancer) {
        const freelancerPassword = await bcrypt.hash('Freelancer@123', await bcrypt.genSalt(10));
        existingFreelancer.password = freelancerPassword;
        await existingFreelancer.save();
        console.log('Freelancer password updated');
      }
    } else {
      // Create demo client
      const clientPassword = await bcrypt.hash('Client@123', await bcrypt.genSalt(10));
      const client = await User.create({
        name: 'Demo Client',
        email: 'client@demo.com',
        password: clientPassword,
        role: 'Client',
        isVerified: true
      });
      await Client.findOneAndUpdate({ user: client._id }, { user: client._id }, { upsert: true });
      console.log('Client account created');
      
      // Create demo freelancer
      const freelancerPassword = await bcrypt.hash('Freelancer@123', await bcrypt.genSalt(10));
      const freelancer = await User.create({
        name: 'Demo Freelancer',
        email: 'freelancer@demo.com',
        password: freelancerPassword,
        role: 'Freelancer',
        isVerified: true
      });
      await Freelancer.findOneAndUpdate({ user: freelancer._id }, { user: freelancer._id }, { upsert: true });
      console.log('Freelancer account created');
    }
    
    console.log('\n=== DEMO ACCOUNTS ===');
    console.log('\n👤 CLIENT');
    console.log('Email: client@demo.com');
    console.log('Password: Client@123');
    
    console.log('\n👨‍💻 FREELANCER');
    console.log('Email: freelancer@demo.com');
    console.log('Password: Freelancer@123');
    
    console.log('\n🔐 ADMIN');
    console.log('Email: admin@skillsphere.com');
    console.log('Password: Admin@123');
    
    await mongoose.connection.close();
    console.log('\n✅ Demo accounts setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createDemoAccounts();
