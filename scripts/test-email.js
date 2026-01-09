/**
 * Test email configuration
 * Run: node scripts/test-email.js
 */

require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const emailTo = process.env.EMAIL_TO;

console.log('\n📧 Testing Email Configuration...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('EMAIL_USER:', emailUser ? '✅ Set' : '❌ Missing');
console.log('EMAIL_PASSWORD:', emailPassword ? '✅ Set (' + emailPassword.length + ' chars)' : '❌ Missing');
console.log('EMAIL_TO:', emailTo ? '✅ Set' : '❌ Missing');
console.log('');

if (!emailUser || !emailPassword || !emailTo) {
  console.error('❌ Missing required environment variables!');
  console.error('\nPlease add to .env.local:');
  console.error('EMAIL_USER=jalnareporter21@gmail.com');
  console.error('EMAIL_PASSWORD=your-gmail-app-password');
  console.error('EMAIL_TO=jalnareporter21@gmail.com');
  process.exit(1);
}

// Test email connection
async function testEmail() {
  try {
    console.log('🔌 Connecting to Gmail SMTP...');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    // Verify connection
    console.log('✅ Verifying connection...');
    await transporter.verify();
    console.log('✅ Connection verified!\n');

    // Send test email
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail({
      from: emailUser,
      to: emailTo,
      subject: 'Test Email from Jalna Reporter News',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from Jalna Reporter News contact form.</p>
        <p>If you receive this, your email configuration is working correctly!</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('\n✅ Email configuration is working!');
    console.log('📬 Check your inbox:', emailTo);
    console.log('   (Also check spam folder if not found)\n');
    
  } catch (error) {
    console.error('\n❌ Email test failed!\n');
    console.error('Error:', error.message);
    
    if (error.message.includes('Invalid login') || error.message.includes('authentication')) {
      console.error('\n🔧 Fix:');
      console.error('1. Make sure you are using Gmail App Password, not regular password');
      console.error('2. Generate new app password: https://myaccount.google.com/apppasswords');
      console.error('3. Remove spaces from app password');
      console.error('4. Make sure 2-Factor Authentication is enabled on Gmail');
    } else if (error.message.includes('Connection')) {
      console.error('\n🔧 Fix:');
      console.error('1. Check your internet connection');
      console.error('2. Verify Gmail SMTP is accessible');
    } else {
      console.error('\n🔧 Troubleshooting:');
      console.error('1. Check EMAIL_USER and EMAIL_PASSWORD in .env.local');
      console.error('2. Restart server after changing .env.local');
      console.error('3. Verify Gmail account settings');
    }
    
    process.exit(1);
  }
}

testEmail();
