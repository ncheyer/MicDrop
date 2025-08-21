const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
  console.log('Testing Resend API...');
  console.log('API Key:', process.env.RESEND_API_KEY ? 'Found' : 'Missing');
  
  try {
    // Try to send with the default Resend domain
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Using Resend's default test domain
      to: ['delivered@resend.dev'], // Resend's test email
      subject: 'Test Email from MicDrop',
      html: '<p>This is a test email to verify Resend is working.</p>',
      text: 'This is a test email to verify Resend is working.',
    });

    if (error) {
      console.error('Resend error:', error);
      
      // Try to get more details about the error
      if (error.name === 'validation_error') {
        console.error('Validation error details:', error.message);
      }
      
      // Now let's try with different from addresses to find what works
      console.log('\nTrying alternative from addresses...');
      
      const testAddresses = [
        'test@resend.dev',
        'hello@resend.dev',
        'noreply@speakaboutai.us',
        'noreply@speakabout.ai'
      ];
      
      for (const fromAddress of testAddresses) {
        try {
          console.log(`\nTrying: ${fromAddress}`);
          const result = await resend.emails.send({
            from: fromAddress,
            to: ['delivered@resend.dev'],
            subject: 'Test',
            html: '<p>Test</p>',
            text: 'Test',
          });
          
          if (result.data) {
            console.log(`✅ Success with ${fromAddress}! Email ID: ${result.data.id}`);
          }
        } catch (err) {
          console.log(`❌ Failed with ${fromAddress}: ${err.message}`);
        }
      }
    } else {
      console.log('✅ Email sent successfully!');
      console.log('Email ID:', data?.id);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testResend();