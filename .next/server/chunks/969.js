"use strict";exports.id=969,exports.ids=[969],exports.modules={4068:(e,t,r)=>{r.d(t,{W:()=>i});let n={url:process.env.NEXT_PUBLIC_SITE_URL||"https://speakaboutai.us",name:"MicDrop",description:"Speaker Landing Pages by Speak About AI"};function i(e=""){let t=e.startsWith("/")?e:`/${e}`;return`${n.url}${t}`}},2872:(e,t,r)=>{r.d(t,{j:()=>I,P:()=>k});var n=Object.defineProperty,i=Object.defineProperties,s=Object.getOwnPropertyDescriptors,o=Object.getOwnPropertySymbols,a=Object.prototype.hasOwnProperty,l=Object.prototype.propertyIsEnumerable,d=(e,t,r)=>t in e?n(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,c=(e,t)=>{for(var r in t||(t={}))a.call(t,r)&&d(e,r,t[r]);if(o)for(var r of o(t))l.call(t,r)&&d(e,r,t[r]);return e},u=(e,t)=>i(e,s(t)),h=(e,t,r)=>new Promise((n,i)=>{var s=e=>{try{a(r.next(e))}catch(e){i(e)}},o=e=>{try{a(r.throw(e))}catch(e){i(e)}},a=e=>e.done?n(e.value):Promise.resolve(e.value).then(s,o);a((r=r.apply(e,t)).next())}),p=class{constructor(e){this.resend=e}create(e){return h(this,arguments,function*(e,t={}){return yield this.resend.post("/api-keys",e,t)})}list(){return h(this,null,function*(){return yield this.resend.get("/api-keys")})}remove(e){return h(this,null,function*(){return yield this.resend.delete(`/api-keys/${e}`)})}},m=class{constructor(e){this.resend=e}create(e){return h(this,arguments,function*(e,t={}){return yield this.resend.post("/audiences",e,t)})}list(){return h(this,null,function*(){return yield this.resend.get("/audiences")})}get(e){return h(this,null,function*(){return yield this.resend.get(`/audiences/${e}`)})}remove(e){return h(this,null,function*(){return yield this.resend.delete(`/audiences/${e}`)})}};function f(e){var t;return{attachments:null==(t=e.attachments)?void 0:t.map(e=>({content:e.content,filename:e.filename,path:e.path,content_type:e.contentType,content_id:e.contentId})),bcc:e.bcc,cc:e.cc,from:e.from,headers:e.headers,html:e.html,reply_to:e.replyTo,scheduled_at:e.scheduledAt,subject:e.subject,tags:e.tags,text:e.text,to:e.to}}var y=class{constructor(e){this.resend=e}send(e){return h(this,arguments,function*(e,t={}){return this.create(e,t)})}create(e){return h(this,arguments,function*(e,t={}){let n=[];for(let t of e){if(t.react){if(!this.renderAsync)try{let{renderAsync:e}=yield r.e(486).then(r.t.bind(r,5486,19));this.renderAsync=e}catch(e){throw Error("Failed to render React component. Make sure to install `@react-email/render`")}t.html=yield this.renderAsync(t.react),t.react=void 0}n.push(f(t))}return yield this.resend.post("/emails/batch",n,t)})}},g=class{constructor(e){this.resend=e}create(e){return h(this,arguments,function*(e,t={}){if(e.react){if(!this.renderAsync)try{let{renderAsync:e}=yield r.e(486).then(r.t.bind(r,5486,19));this.renderAsync=e}catch(e){throw Error("Failed to render React component. Make sure to install `@react-email/render`")}e.html=yield this.renderAsync(e.react)}return yield this.resend.post("/broadcasts",{name:e.name,audience_id:e.audienceId,preview_text:e.previewText,from:e.from,html:e.html,reply_to:e.replyTo,subject:e.subject,text:e.text},t)})}send(e,t){return h(this,null,function*(){return yield this.resend.post(`/broadcasts/${e}/send`,{scheduled_at:null==t?void 0:t.scheduledAt})})}list(){return h(this,null,function*(){return yield this.resend.get("/broadcasts")})}get(e){return h(this,null,function*(){return yield this.resend.get(`/broadcasts/${e}`)})}remove(e){return h(this,null,function*(){return yield this.resend.delete(`/broadcasts/${e}`)})}update(e,t){return h(this,null,function*(){return yield this.resend.patch(`/broadcasts/${e}`,{name:t.name,audience_id:t.audienceId,from:t.from,html:t.html,text:t.text,subject:t.subject,reply_to:t.replyTo,preview_text:t.previewText})})}},b=class{constructor(e){this.resend=e}create(e){return h(this,arguments,function*(e,t={}){return yield this.resend.post(`/audiences/${e.audienceId}/contacts`,{unsubscribed:e.unsubscribed,email:e.email,first_name:e.firstName,last_name:e.lastName},t)})}list(e){return h(this,null,function*(){return yield this.resend.get(`/audiences/${e.audienceId}/contacts`)})}get(e){return h(this,null,function*(){return e.id||e.email?yield this.resend.get(`/audiences/${e.audienceId}/contacts/${(null==e?void 0:e.email)?null==e?void 0:e.email:null==e?void 0:e.id}`):{data:null,error:{message:"Missing `id` or `email` field.",name:"missing_required_field"}}})}update(e){return h(this,null,function*(){return e.id||e.email?yield this.resend.patch(`/audiences/${e.audienceId}/contacts/${(null==e?void 0:e.email)?null==e?void 0:e.email:null==e?void 0:e.id}`,{unsubscribed:e.unsubscribed,first_name:e.firstName,last_name:e.lastName}):{data:null,error:{message:"Missing `id` or `email` field.",name:"missing_required_field"}}})}remove(e){return h(this,null,function*(){return e.id||e.email?yield this.resend.delete(`/audiences/${e.audienceId}/contacts/${(null==e?void 0:e.email)?null==e?void 0:e.email:null==e?void 0:e.id}`):{data:null,error:{message:"Missing `id` or `email` field.",name:"missing_required_field"}}})}},x=class{constructor(e){this.resend=e}create(e){return h(this,arguments,function*(e,t={}){return yield this.resend.post("/domains",{name:e.name,region:e.region,custom_return_path:e.customReturnPath},t)})}list(){return h(this,null,function*(){return yield this.resend.get("/domains")})}get(e){return h(this,null,function*(){return yield this.resend.get(`/domains/${e}`)})}update(e){return h(this,null,function*(){return yield this.resend.patch(`/domains/${e.id}`,{click_tracking:e.clickTracking,open_tracking:e.openTracking,tls:e.tls})})}remove(e){return h(this,null,function*(){return yield this.resend.delete(`/domains/${e}`)})}verify(e){return h(this,null,function*(){return yield this.resend.post(`/domains/${e}/verify`)})}},$=class{constructor(e){this.resend=e}send(e){return h(this,arguments,function*(e,t={}){return this.create(e,t)})}create(e){return h(this,arguments,function*(e,t={}){if(e.react){if(!this.renderAsync)try{let{renderAsync:e}=yield r.e(486).then(r.t.bind(r,5486,19));this.renderAsync=e}catch(e){throw Error("Failed to render React component. Make sure to install `@react-email/render`")}e.html=yield this.renderAsync(e.react)}return yield this.resend.post("/emails",f(e),t)})}get(e){return h(this,null,function*(){return yield this.resend.get(`/emails/${e}`)})}update(e){return h(this,null,function*(){return yield this.resend.patch(`/emails/${e.id}`,{scheduled_at:e.scheduledAt})})}cancel(e){return h(this,null,function*(){return yield this.resend.post(`/emails/${e}/cancel`)})}},v="undefined"!=typeof process&&process.env&&process.env.RESEND_BASE_URL||"https://api.resend.com",w="undefined"!=typeof process&&process.env&&process.env.RESEND_USER_AGENT||"resend-node:6.0.1";let A=new class{constructor(e){if(this.key=e,this.apiKeys=new p(this),this.audiences=new m(this),this.batch=new y(this),this.broadcasts=new g(this),this.contacts=new b(this),this.domains=new x(this),this.emails=new $(this),!e&&("undefined"!=typeof process&&process.env&&(this.key=process.env.RESEND_API_KEY),!this.key))throw Error('Missing API key. Pass it to the constructor `new Resend("re_123")`');this.headers=new Headers({Authorization:`Bearer ${this.key}`,"User-Agent":w,"Content-Type":"application/json"})}fetchRequest(e){return h(this,arguments,function*(e,t={}){try{let r=yield fetch(`${v}${e}`,t);if(!r.ok)try{let e=yield r.text();return{data:null,error:JSON.parse(e)}}catch(t){if(t instanceof SyntaxError)return{data:null,error:{name:"application_error",message:"Internal server error. We are unable to process your request right now, please try again later."}};let e={message:r.statusText,name:"application_error"};if(t instanceof Error)return{data:null,error:u(c({},e),{message:t.message})};return{data:null,error:e}}return{data:yield r.json(),error:null}}catch(e){return{data:null,error:{name:"application_error",message:"Unable to fetch data. The request could not be resolved."}}}})}post(e,t){return h(this,arguments,function*(e,t,r={}){let n=new Headers(this.headers);r.idempotencyKey&&n.set("Idempotency-Key",r.idempotencyKey);let i=c({method:"POST",headers:n,body:JSON.stringify(t)},r);return this.fetchRequest(e,i)})}get(e){return h(this,arguments,function*(e,t={}){let r=c({method:"GET",headers:this.headers},t);return this.fetchRequest(e,r)})}put(e,t){return h(this,arguments,function*(e,t,r={}){let n=c({method:"PUT",headers:this.headers,body:JSON.stringify(t)},r);return this.fetchRequest(e,n)})}patch(e,t){return h(this,arguments,function*(e,t,r={}){let n=c({method:"PATCH",headers:this.headers,body:JSON.stringify(t)},r);return this.fetchRequest(e,n)})}delete(e,t){return h(this,null,function*(){let r={method:"DELETE",headers:this.headers,body:JSON.stringify(t)};return this.fetchRequest(e,r)})}}(process.env.RESEND_API_KEY);async function k({to:e,recipientName:t,speakerName:r,speakerEmail:n,talkTitle:i,tools:s,pageUrl:o}){try{let a=function({recipientName:e,speakerName:t,talkTitle:r,tools:n,pageUrl:i}){let s=n.filter(e=>"gpt"===e.type),o=n.filter(e=>"download"===e.type),a=n.filter(e=>"resource"===e.type),l=(e,t)=>e.map(e=>`
        <div style="background-color: #ffffff; border: 1px solid #e1e4e8; border-radius: 6px; padding: 15px; margin-bottom: 10px;">
          <h3 style="font-size: 16px; font-weight: 600; color: #0969da; margin: 0 0 5px 0;">
            <a href="${e.url}" style="color: #0969da; text-decoration: none;">
              ${"download"===t?"\uD83D\uDCC4 ":""}${e.name} →
            </a>
          </h3>
          ${e.description?`<p style="font-size: 14px; color: #666; margin: 0;">${e.description}</p>`:""}
        </div>
      `).join("");return`
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a1a1a; font-size: 28px; font-weight: 700; margin: 0 0 10px 0;">
            🎉 Your AI Implementation Tools Are Ready!
          </h1>
          <p style="color: #666; font-size: 16px; margin: 0;">
            From ${t}'s talk: "${r}"
          </p>
        </div>

        <!-- Welcome Message -->
        <div style="margin-bottom: 30px;">
          <p style="font-size: 16px; color: #333;">
            ${e?`Hi ${e},`:"Hello,"}
          </p>
          <p style="font-size: 16px; color: #333;">
            Thank you for your interest in the AI implementation tools and resources from my recent talk. 
            I'm excited to share these practical resources that will help you implement AI in your organization.
          </p>
        </div>

        <!-- AI Tools Section -->
        ${s.length>0?`
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="font-size: 20px; font-weight: 600; color: #1a1a1a; margin-top: 0; margin-bottom: 15px;">
              🤖 Custom GPTs & AI Tools
            </h2>
            ${l(s,"gpt")}
          </div>
        `:""}

        <!-- Downloads Section -->
        ${o.length>0?`
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="font-size: 20px; font-weight: 600; color: #1a1a1a; margin-top: 0; margin-bottom: 15px;">
              📚 Frameworks & Guides
            </h2>
            ${l(o,"download")}
          </div>
        `:""}

        <!-- Resources Section -->
        ${a.length>0?`
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="font-size: 20px; font-weight: 600; color: #1a1a1a; margin-top: 0; margin-bottom: 15px;">
              🔗 Additional Resources
            </h2>
            ${l(a,"resource")}
          </div>
        `:""}

        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${i}" style="display: inline-block; background-color: #0969da; color: #ffffff; font-size: 16px; font-weight: 600; padding: 12px 30px; border-radius: 6px; text-decoration: none;">
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
            ${t}
          </p>
        </div>

        <!-- Powered by -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e4e8;">
          <p style="font-size: 12px; color: #999;">
            Powered by <a href="https://speakaboutai.us" style="color: #0969da; text-decoration: none;">Speak About AI</a>
          </p>
        </div>
      </div>
    </div>
  `}({recipientName:t,speakerName:r,talkTitle:i,tools:s,pageUrl:o}),l=function({recipientName:e,speakerName:t,talkTitle:r,tools:n,pageUrl:i}){let s=n.filter(e=>"gpt"===e.type),o=n.filter(e=>"download"===e.type),a=n.filter(e=>"resource"===e.type),l=`Your AI Implementation Tools Are Ready!

`;return l+=`From ${t}'s talk: "${r}"

`,e?l+=`Hi ${e},

`:l+=`Hello,

`,l+=`Thank you for your interest in the AI implementation tools and resources from my recent talk. I'm excited to share these practical resources that will help you implement AI in your organization.

`,s.length>0&&(l+=`CUSTOM GPTS & AI TOOLS
${"=".repeat(30)}

`,s.forEach(e=>{l+=`${e.name}
${e.description}
Link: ${e.url}

`})),o.length>0&&(l+=`FRAMEWORKS & GUIDES
${"=".repeat(30)}

`,o.forEach(e=>{l+=`${e.name}
`,e.description&&(l+=`${e.description}
`),l+=`Download: ${e.url}

`})),a.length>0&&(l+=`ADDITIONAL RESOURCES
${"=".repeat(30)}

`,a.forEach(e=>{l+=`${e.name}
`,e.description&&(l+=`${e.description}
`),l+=`Link: ${e.url}

`})),l+=`
View all resources on the landing page:
${i}

Questions or need help implementing these tools?
Feel free to reach out - I'm here to help you succeed with AI!

Best regards,
${t}

---
Powered by Speak About AI
https://speakaboutai.us`}({recipientName:t,speakerName:r,talkTitle:i,tools:s,pageUrl:o}),{data:d,error:c}=await A.emails.send({from:n&&n.includes("@")?`${r} <${n}>`:"Speak About AI <noreply@speakaboutai.us>",to:[e],subject:`Your AI Implementation Tools from "${i}"`,html:a,text:l,replyTo:n||void 0});if(c)throw console.error("Resend error:",c),Error(`Failed to send email: ${c.message}`);return{success:!0,emailId:d?.id}}catch(e){throw console.error("Error sending welcome email:",e),e}}async function I(e){try{let{data:t,error:r}=await A.emails.send({from:"Speak About AI <noreply@speakaboutai.us>",to:[e],subject:"Test Email from MicDrop",html:"<p>This is a test email from your MicDrop platform.</p>",text:"This is a test email from your MicDrop platform."});if(r)throw console.error("Resend error:",r),Error(`Failed to send test email: ${r.message}`);return{success:!0,emailId:t?.id}}catch(e){throw console.error("Error sending test email:",e),e}}}};