import React from 'react';

interface Tool {
  name: string;
  description: string;
  url: string;
  type: 'gpt' | 'download' | 'resource';
}

interface ToolsWelcomeEmailProps {
  recipientName?: string;
  speakerName: string;
  talkTitle: string;
  tools: Tool[];
  pageUrl: string;
}

export function ToolsWelcomeEmail({
  recipientName,
  speakerName,
  talkTitle,
  tools,
  pageUrl
}: ToolsWelcomeEmailProps) {
  const gpts = tools.filter(t => t.type === 'gpt');
  const downloads = tools.filter(t => t.type === 'download');
  const resources = tools.filter(t => t.type === 'resource');

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      lineHeight: '1.6',
      color: '#333',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            color: '#1a1a1a',
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 10px 0'
          }}>
            🎉 Your AI Implementation Tools Are Ready!
          </h1>
          <p style={{
            color: '#666',
            fontSize: '16px',
            margin: '0'
          }}>
            From {speakerName}'s talk: "{talkTitle}"
          </p>
        </div>

        {/* Welcome Message */}
        <div style={{ marginBottom: '30px' }}>
          <p style={{ fontSize: '16px', color: '#333' }}>
            {recipientName ? `Hi ${recipientName},` : 'Hello,'}
          </p>
          <p style={{ fontSize: '16px', color: '#333' }}>
            Thank you for your interest in the AI implementation tools and resources from my recent talk. 
            I'm excited to share these practical resources that will help you implement AI in your organization.
          </p>
        </div>

        {/* AI Tools Section */}
        {gpts.length > 0 && (
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginTop: '0',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center'
            }}>
              🤖 Custom GPTs & AI Tools
            </h2>
            {gpts.map((tool, index) => (
              <div key={index} style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e1e4e8',
                borderRadius: '6px',
                padding: '15px',
                marginBottom: '10px'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#0969da',
                  margin: '0 0 5px 0'
                }}>
                  <a href={tool.url} style={{
                    color: '#0969da',
                    textDecoration: 'none'
                  }}>
                    {tool.name} →
                  </a>
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  margin: '0'
                }}>
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Downloads Section */}
        {downloads.length > 0 && (
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginTop: '0',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center'
            }}>
              📚 Frameworks & Guides
            </h2>
            {downloads.map((tool, index) => (
              <div key={index} style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e1e4e8',
                borderRadius: '6px',
                padding: '15px',
                marginBottom: '10px'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#0969da',
                  margin: '0 0 5px 0'
                }}>
                  <a href={tool.url} style={{
                    color: '#0969da',
                    textDecoration: 'none'
                  }}>
                    📄 {tool.name}
                  </a>
                </h3>
                {tool.description && (
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    margin: '0'
                  }}>
                    {tool.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Resources Section */}
        {resources.length > 0 && (
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginTop: '0',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center'
            }}>
              🔗 Additional Resources
            </h2>
            {resources.map((tool, index) => (
              <div key={index} style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e1e4e8',
                borderRadius: '6px',
                padding: '15px',
                marginBottom: '10px'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#0969da',
                  margin: '0 0 5px 0'
                }}>
                  <a href={tool.url} style={{
                    color: '#0969da',
                    textDecoration: 'none'
                  }}>
                    {tool.name} →
                  </a>
                </h3>
                {tool.description && (
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    margin: '0'
                  }}>
                    {tool.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a
            href={pageUrl}
            style={{
              display: 'inline-block',
              backgroundColor: '#0969da',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              padding: '12px 30px',
              borderRadius: '6px',
              textDecoration: 'none'
            }}
          >
            View All Resources on Landing Page
          </a>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #e1e4e8',
          paddingTop: '20px',
          marginTop: '30px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#666',
            margin: '0 0 10px 0'
          }}>
            Questions or need help implementing these tools?
          </p>
          <p style={{
            fontSize: '14px',
            color: '#666',
            margin: '0'
          }}>
            Feel free to reach out - I'm here to help you succeed with AI!
          </p>
          <p style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#333',
            marginTop: '15px'
          }}>
            Best regards,<br />
            {speakerName}
          </p>
        </div>

        {/* Powered by */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #e1e4e8'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#999'
          }}>
            Powered by <a href="https://speakaboutai.us" style={{ color: '#0969da', textDecoration: 'none' }}>Speak About AI</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Plain text version for email clients that don't support HTML
export function generatePlainTextEmail({
  recipientName,
  speakerName,
  talkTitle,
  tools,
  pageUrl
}: ToolsWelcomeEmailProps): string {
  const gpts = tools.filter(t => t.type === 'gpt');
  const downloads = tools.filter(t => t.type === 'download');
  const resources = tools.filter(t => t.type === 'resource');

  let text = `Your AI Implementation Tools Are Ready!\n\n`;
  text += `From ${speakerName}'s talk: "${talkTitle}"\n\n`;
  
  if (recipientName) {
    text += `Hi ${recipientName},\n\n`;
  } else {
    text += `Hello,\n\n`;
  }
  
  text += `Thank you for your interest in the AI implementation tools and resources from my recent talk. `;
  text += `I'm excited to share these practical resources that will help you implement AI in your organization.\n\n`;

  if (gpts.length > 0) {
    text += `CUSTOM GPTS & AI TOOLS\n`;
    text += `${'='.repeat(30)}\n\n`;
    gpts.forEach(tool => {
      text += `${tool.name}\n`;
      text += `${tool.description}\n`;
      text += `Link: ${tool.url}\n\n`;
    });
  }

  if (downloads.length > 0) {
    text += `FRAMEWORKS & GUIDES\n`;
    text += `${'='.repeat(30)}\n\n`;
    downloads.forEach(tool => {
      text += `${tool.name}\n`;
      if (tool.description) {
        text += `${tool.description}\n`;
      }
      text += `Download: ${tool.url}\n\n`;
    });
  }

  if (resources.length > 0) {
    text += `ADDITIONAL RESOURCES\n`;
    text += `${'='.repeat(30)}\n\n`;
    resources.forEach(tool => {
      text += `${tool.name}\n`;
      if (tool.description) {
        text += `${tool.description}\n`;
      }
      text += `Link: ${tool.url}\n\n`;
    });
  }

  text += `\nView all resources on the landing page:\n${pageUrl}\n\n`;
  text += `Questions or need help implementing these tools?\n`;
  text += `Feel free to reach out - I'm here to help you succeed with AI!\n\n`;
  text += `Best regards,\n${speakerName}\n\n`;
  text += `---\nPowered by Speak About AI\nhttps://speakaboutai.us`;

  return text;
}