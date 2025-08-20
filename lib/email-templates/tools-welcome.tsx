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

export function generateHtmlEmail({
  recipientName,
  speakerName,
  talkTitle,
  tools,
  pageUrl
}: ToolsWelcomeEmailProps): string {
  const gpts = tools.filter(t => t.type === 'gpt');
  const downloads = tools.filter(t => t.type === 'download');
  const resources = tools.filter(t => t.type === 'resource');

  const renderTools = (toolList: Tool[], type: string) => {
    return toolList.map((tool) => {
      const icon = type === 'download' ? '📄 ' : '';
      return `
        <div style="background-color: #ffffff; border: 1px solid #e1e4e8; border-radius: 6px; padding: 15px; margin-bottom: 10px;">
          <h3 style="font-size: 16px; font-weight: 600; color: #0969da; margin: 0 0 5px 0;">
            <a href="${tool.url}" style="color: #0969da; text-decoration: none;">
              ${icon}${tool.name} →
            </a>
          </h3>
          ${tool.description ? `<p style="font-size: 14px; color: #666; margin: 0;">${tool.description}</p>` : ''}
        </div>
      `;
    }).join('');
  };

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a1a1a; font-size: 28px; font-weight: 700; margin: 0 0 10px 0;">
            🎉 Your AI Implementation Tools Are Ready!
          </h1>
          <p style="color: #666; font-size: 16px; margin: 0;">
            From ${speakerName}'s talk: "${talkTitle}"
          </p>
        </div>

        <!-- Welcome Message -->
        <div style="margin-bottom: 30px;">
          <p style="font-size: 16px; color: #333;">
            ${recipientName ? `Hi ${recipientName},` : 'Hello,'}
          </p>
          <p style="font-size: 16px; color: #333;">
            Thank you for your interest in the AI implementation tools and resources from my recent talk. 
            I'm excited to share these practical resources that will help you implement AI in your organization.
          </p>
        </div>

        <!-- AI Tools Section -->
        ${gpts.length > 0 ? `
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="font-size: 20px; font-weight: 600; color: #1a1a1a; margin-top: 0; margin-bottom: 15px;">
              🤖 Custom GPTs & AI Tools
            </h2>
            ${renderTools(gpts, 'gpt')}
          </div>
        ` : ''}

        <!-- Downloads Section -->
        ${downloads.length > 0 ? `
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="font-size: 20px; font-weight: 600; color: #1a1a1a; margin-top: 0; margin-bottom: 15px;">
              📚 Frameworks & Guides
            </h2>
            ${renderTools(downloads, 'download')}
          </div>
        ` : ''}

        <!-- Resources Section -->
        ${resources.length > 0 ? `
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="font-size: 20px; font-weight: 600; color: #1a1a1a; margin-top: 0; margin-bottom: 15px;">
              🔗 Additional Resources
            </h2>
            ${renderTools(resources, 'resource')}
          </div>
        ` : ''}

        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${pageUrl}" style="display: inline-block; background-color: #0969da; color: #ffffff; font-size: 16px; font-weight: 600; padding: 12px 30px; border-radius: 6px; text-decoration: none;">
            View All Resources on Landing Page
          </a>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #e1e4e8; padding-top: 20px; margin-top: 30px; text-align: center;">
          <p style="font-size: 14px; color: #666; margin: 0 0 10px 0;">
            Questions or need help implementing these tools?
          </p>
          <p style="font-size: 14px; color: #666; margin: 0;">
            Feel free to reach out - I'm here to help you succeed with AI!
          </p>
          <p style="font-size: 16px; font-weight: 600; color: #333; margin-top: 15px;">
            Best regards,<br />
            ${speakerName}
          </p>
        </div>

        <!-- Powered by -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e4e8;">
          <p style="font-size: 12px; color: #999;">
            Powered by <a href="https://speakabout.ai" style="color: #0969da; text-decoration: none;">Speak About AI</a>
          </p>
        </div>
      </div>
    </div>
  `;
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
  text += `---\nPowered by Speak About AI\nhttps://speakabout.ai`;

  return text;
}