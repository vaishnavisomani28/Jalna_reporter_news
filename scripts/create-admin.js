const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Try to load .env.local, fallback to .env
try {
  require('dotenv').config({ path: '.env.local' });
} catch {
  require('dotenv').config();
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  try {
    console.log('Connecting to Supabase...');

    const username = process.argv[2] || 'admin';
    const password = process.argv[3] || 'admin123';

    // Validate password strength
    const passwordErrors = [];
    if (password.length < 8) {
      passwordErrors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      passwordErrors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      passwordErrors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      passwordErrors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      passwordErrors.push('Password must contain at least one special character');
    }

    if (passwordErrors.length > 0) {
      console.error('❌ Password does not meet strength requirements:');
      passwordErrors.forEach(err => console.error(`   - ${err}`));
      console.error('\nPlease use a stronger password.');
      process.exit(1);
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (existingUser) {
      console.log(`User "${username}" already exists.`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { data: user, error } = await supabase
      .from('users')
      .insert([{ username, password: hashedPassword }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log(`\n✅ Admin user "${username}" created successfully!`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log('\n⚠️  Please change the password after first login!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    if (error.code === '42P01') {
      console.error('\n💡 Make sure you have created the "users" table in Supabase!');
      console.error('   See SUPABASE_SETUP.md for instructions.');
    }
    process.exit(1);
  }
}

createAdmin();

