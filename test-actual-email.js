const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testActualEmail() {
  console.log('Testing with speakabout.ai domain...\n');
  
  // Test 1: Try the current from address
  try {
    console.log('Test 1: Trying noreply@speakabout.ai');
    const { data, error } = await resend.emails.send({
      from: 'Speak About AI <noreply@speakabout.ai>',
      to: ['test@example.com'], // This will be replaced with a real email
      subject: 'Test Email from MicDrop',
      html: '<p>Testing email delivery from speakabout.ai domain</p>',
      text: 'Testing email delivery from speakabout.ai domain',
    });

    if (error) {
      console.error('❌ Failed:', error.message);
      console.error('Full error:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Success! Email ID:', data?.id);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Test 2: Try with onboarding@resend.dev (known working)
  try {
    console.log('\nTest 2: Using onboarding@resend.dev (Resend default)');
    const { data, error } = await resend.emails.send({
      from: 'MicDrop <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'Your AI Implementation Tools',
      html: '<h1>Welcome!</h1><p>Your AI tools are ready.</p>',
      text: 'Welcome! Your AI tools are ready.',
    });

    if (error) {
      console.error('❌ Failed:', error.message);
    } else {
      console.log('✅ Success! Email ID:', data?.id);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Test 3: Check what happens with a real user email
  console.log('\nTest 3: Sending to a real email address');
  console.log('Enter an email address to test (or press Enter to skip):');
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Email: ', async (email) => {
    if (email && email.includes('@')) {
      try {
        const { data, error } = await resend.emails.send({
          from: 'MicDrop Platform <onboarding@resend.dev>',
          to: [email],
          subject: 'Your AI Implementation Tools from MicDrop',
          html: `
            <h2>Welcome to MicDrop!</h2>
            <p>Thank you for signing up. Your AI implementation tools are ready.</p>
            <p>This is a test email to verify email delivery is working.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Powered by MicDrop</p>
          `,
          text: 'Welcome to MicDrop! Thank you for signing up. Your AI implementation tools are ready.',
        });

        if (error) {
          console.error('❌ Failed to send to', email, ':', error.message);
        } else {
          console.log('✅ Email sent successfully to', email);
          console.log('Email ID:', data?.id);
        }
      } catch (error) {
        console.error('❌ Error:', error.message);
      }
    } else {
      console.log('Skipping real email test');
    }
    
    rl.close();
    process.exit(0);
  });
}

testActualEmail();