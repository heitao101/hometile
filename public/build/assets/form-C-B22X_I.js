import{r as h,j as e,H as N,L as j,a as I}from"./app-CguduGhf.js";import{A as R}from"./app-layout-DlUvrfaZ.js";import{H as T}from"./heading-Mp-_3qiK.js";import{B as m}from"./button-C6ZLhR4e.js";import{C as p,b as g,c as y,d as x,a as f}from"./card-DpiAjo8U.js";import{I as c}from"./input-BNqw_zUn.js";import{L as o}from"./label-DayF79-A.js";import{S as A}from"./switch-Dnols2J5.js";import{C as P}from"./checkbox-CtT0vTgz.js";import{d as E,S as M,a as U,c as H,b as u}from"./select-DTmYNRdr.js";import{d as F}from"./index-BSX0zAdf.js";import{P as L}from"./page-help-C-0sPqx3.js";import{A as O}from"./arrow-left-l5yc88gG.js";/* empty css            */import"./index-C4uecQ60.js";import"./createLucideIcon-CZnlVy6A.js";import"./language-selector-CHoOelK1.js";import"./minus-CdeAJ9bk.js";import"./app-logo-icon-ChMZmiXJ.js";import"./house-CnX1RXc9.js";import"./phone-C3nSXGIA.js";import"./user-cog-CC66MYgp.js";import"./alert-CBYppE2x.js";import"./circle-alert-CuXTVpY5.js";import"./circle-check-T0wPVHNE.js";import"./loader-circle-Bmn7RnTW.js";import"./chevron-up-COyAj2Kc.js";import"./circle-help-CNrd54pw.js";import"./external-link-Bk_2LdRd.js";try{(function(){var s=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},r=new s.Error().stack;r&&(s._sentryDebugIds=s._sentryDebugIds||{},s._sentryDebugIds[r]="289dd6d9-88ac-4a44-974f-e65f45dbd059",s._sentryDebugIdIdentifier="sentry-dbid-289dd6d9-88ac-4a44-974f-e65f45dbd059")})()}catch{}const D=[{value:"call_completed",label:"Call Completed",description:"Triggered when a call ends with transcript and sentiment data"},{value:"lead_qualified",label:"Lead Qualified",description:"Triggered when AI detects a hot lead (high sentiment/score)"},{value:"contact_added",label:"Contact Added",description:"Triggered when a new contact is created or imported"},{value:"contact_updated",label:"Contact Updated",description:"Triggered when contact information is modified"},{value:"campaign_started",label:"Campaign Started",description:"Triggered when a campaign is launched"},{value:"dtmf_response",label:"DTMF Response",description:"Triggered when a contact presses a phone key"}];function ye({integration:s}){const r=!!s,[a,n]=h.useState({name:s?.name||"",webhook_url:s?.webhook_url||"",events:s?.events||[],auth_type:s?.auth_type||"none",auth_credentials:s?.auth_credentials||{},is_active:s?.is_active!==void 0?s.is_active:!0}),[l,v]=h.useState({}),[b,C]=h.useState(!1),_=async t=>{t.preventDefault(),C(!0),v({});try{const d=await(await fetch(r?`/api/v1/crm-integrations/${s.id}`:"/api/v1/crm-integrations",{method:r?"PUT":"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")||""},body:JSON.stringify(a)})).json();d.success?I.visit("/integrations",{onSuccess:()=>{alert(`Integration ${r?"updated":"created"} successfully!`)}}):d.errors&&v(d.errors)}catch(i){alert("Failed to save integration: "+i.message)}finally{C(!1)}},k=t=>{n(i=>({...i,events:i.events.includes(t)?i.events.filter(d=>d!==t):[...i.events,t]}))},w=[{title:"Dashboard",href:F().url},{title:"CRM Integrations",href:"/integrations"},{title:r?"Edit Integration":"Create Integration",href:""}],S=[{title:"Creating an Integration",content:`1. Name: Give your integration a descriptive name (e.g., "ERPNext Production", "Salesforce CRM")
2. Webhook URL: Your CRM's endpoint that will receive data (must accept POST requests)
3. Events: Select which events should trigger webhooks to your CRM
4. Authentication: Choose the method your CRM requires
5. Test: Always test before activating to verify connectivity`},{title:"Webhook URL Setup",content:`Your CRM must have an endpoint that:
• Accepts HTTP POST requests
• Returns 200 OK status on success
• Processes JSON payload data
• Responds within 30 seconds

Example URLs:
• ERPNext: https://your-erpnext.com/api/method/your_app.api.teleman_webhook
• Salesforce: https://yourinstance.salesforce.com/services/apexrest/teleman
• Custom: https://your-system.com/webhooks/teleman`},{title:"Authentication Setup",content:`Bearer Token (Most Common):
• Used by: HubSpot, Salesforce, ERPNext, most OAuth 2.0 systems
• Format: Your access token or "token api_key:api_secret"
• Header sent: Authorization: Bearer YOUR_TOKEN

API Key:
• Used by: Custom systems, Pipedrive, some legacy APIs
• Header Name: Usually X-API-Key (or custom)
• Header Value: Your API key

HMAC Signature:
• Maximum security with cryptographic verification
• Secret: Shared secret key between systems
• Headers sent: X-Teleman-Signature, X-Teleman-Timestamp
• Your CRM must verify signature matches

None:
• For testing only - no authentication headers sent
• Never use in production environments`},{title:"Event Selection Guide",content:`Choose events based on your CRM needs:

Call Completed:
• Creates call logs in CRM
• Includes: transcript, duration, sentiment, recording URL
• Use for: Call history tracking, conversation analysis

Lead Qualified:
• Creates hot lead records automatically
• Includes: sentiment score (>0.8), qualification reason
• Use for: Sales alerts, opportunity creation

Contact Added/Updated:
• Syncs contacts in real-time
• Includes: name, phone, email, company
• Use for: CRM contact database sync

Campaign Started:
• Notifies when campaigns launch
• Includes: campaign details, target count
• Use for: CRM campaign tracking

DTMF Response:
• Tracks phone keypress responses
• Includes: key pressed, timestamp, call context
• Use for: IVR analytics, survey responses`},{title:"Testing Your Integration",content:`After creating:
1. Click "Test" button to send sample webhook
2. Check the response status and message
3. Verify data appears in your CRM
4. Review webhook logs for any errors
5. Retry failed webhooks if needed

Sample test payload sent:
{
  "event": "call_completed",
  "call_id": 999,
  "contact_name": "Test User",
  "phone_number": "+15551234567",
  "duration": 120,
  "status": "completed",
  "transcript": "This is a test webhook...",
  "sentiment": "positive"
}`},{title:"ERPNext Integration Example",content:`To integrate with ERPNext:

1. Create Python endpoint in ERPNext:
# frappe-bench/apps/your_app/api.py
@frappe.whitelist(allow_guest=False)
def teleman_webhook():
    data = frappe.request.get_json()
    if data.get('event') == 'call_completed':
        doc = frappe.get_doc({
            "doctype": "Call Log",
            "duration": data.get('duration'),
            "notes": data.get('transcript')
        })
        doc.insert()
    return {"status": "success"}

2. Get API credentials:
   User → API Access → Generate Keys

3. In Teleman form:
   • URL: https://your-erpnext.com/api/method/your_app.api.teleman_webhook
   • Auth: Bearer Token
   • Token: token YOUR_API_KEY:YOUR_API_SECRET`},{title:"Common Issues & Solutions",content:`Problem: "Connection Timeout"
Solution: Your CRM endpoint must respond within 30s. Use background jobs for long operations.

Problem: "401 Unauthorized"
Solution: Double-check API credentials. Test with curl manually first.

Problem: "Invalid SSL Certificate"
Solution: Ensure your CRM has valid HTTPS certificate. Use Let's Encrypt for free SSL.

Problem: "Webhooks not triggering"
Solution: Check integration is Active. Verify events are selected. Ensure Laravel queue is running.

Problem: "Wrong data format"
Solution: Check your CRM expects JSON payload. Review webhook logs for exact payload sent.`}];return e.jsxs(R,{breadcrumbs:w,children:[e.jsx(N,{title:r?"Edit Integration":"Create Integration"}),e.jsxs("div",{className:"mx-auto max-w-3xl space-y-6",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(j,{href:"/integrations",children:e.jsx(m,{variant:"ghost",size:"icon",children:e.jsx(O,{className:"h-5 w-5"})})}),e.jsx("div",{className:"flex-1",children:e.jsx(T,{title:r?"Edit Integration":"Create CRM Integration",description:"Connect Teleman to your CRM or marketing automation tool"})}),e.jsx(L,{title:"Integration Form Help",sections:S,documentationUrl:"/docs/documentation.html#crm-integrations"})]}),e.jsxs("form",{onSubmit:_,className:"space-y-6",children:[e.jsxs(p,{children:[e.jsxs(g,{children:[e.jsx(y,{children:"Basic Information"}),e.jsx(x,{children:"Configure the basic settings for your CRM integration"})]}),e.jsxs(f,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(o,{htmlFor:"name",children:"Integration Name"}),e.jsx(c,{id:"name",value:a.name,onChange:t=>n({...a,name:t.target.value}),placeholder:"e.g., HubSpot Production, Salesforce CRM",required:!0}),l.name&&e.jsx("p",{className:"text-sm text-red-600",children:l.name})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(o,{htmlFor:"webhook_url",children:"Webhook URL"}),e.jsx(c,{id:"webhook_url",type:"url",value:a.webhook_url,onChange:t=>n({...a,webhook_url:t.target.value}),placeholder:"https://your-crm.com/webhooks/teleman",required:!0}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"The endpoint URL where webhook data will be sent"}),l.webhook_url&&e.jsx("p",{className:"text-sm text-red-600",children:l.webhook_url})]}),e.jsxs("div",{className:"flex items-center justify-between rounded-lg border p-4",children:[e.jsxs("div",{className:"space-y-0.5",children:[e.jsx(o,{htmlFor:"is_active",children:"Active Status"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Enable or disable this integration"})]}),e.jsx(A,{id:"is_active",checked:a.is_active,onCheckedChange:t=>n({...a,is_active:t})})]})]})]}),e.jsxs(p,{children:[e.jsxs(g,{children:[e.jsx(y,{children:"Events to Forward"}),e.jsx(x,{children:"Select which events should trigger webhooks to your CRM"})]}),e.jsxs(f,{className:"space-y-3",children:[D.map(t=>e.jsxs("div",{className:"flex items-start space-x-3 rounded-lg border p-4",children:[e.jsx(P,{id:t.value,checked:a.events.includes(t.value),onCheckedChange:()=>k(t.value)}),e.jsxs("div",{className:"flex-1 space-y-1",children:[e.jsx("label",{htmlFor:t.value,className:"cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",children:t.label}),e.jsx("p",{className:"text-sm text-muted-foreground",children:t.description})]})]},t.value)),l.events&&e.jsx("p",{className:"text-sm text-red-600",children:l.events})]})]}),e.jsxs(p,{children:[e.jsxs(g,{children:[e.jsx(y,{children:"Authentication"}),e.jsx(x,{children:"Configure how Teleman authenticates with your webhook endpoint"})]}),e.jsxs(f,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(o,{htmlFor:"auth_type",children:"Authentication Type"}),e.jsxs(E,{value:a.auth_type,onValueChange:t=>n({...a,auth_type:t,auth_credentials:{}}),children:[e.jsx(M,{id:"auth_type",children:e.jsx(U,{})}),e.jsxs(H,{children:[e.jsx(u,{value:"none",children:"None (No Authentication)"}),e.jsx(u,{value:"bearer",children:"Bearer Token"}),e.jsx(u,{value:"api_key",children:"API Key (Custom Header)"}),e.jsx(u,{value:"hmac",children:"HMAC Signature"})]})]})]}),a.auth_type==="bearer"&&e.jsxs("div",{className:"space-y-2",children:[e.jsx(o,{htmlFor:"bearer_token",children:"Bearer Token"}),e.jsx(c,{id:"bearer_token",type:"password",value:a.auth_credentials?.token||"",onChange:t=>n({...a,auth_credentials:{token:t.target.value}}),placeholder:"your-bearer-token"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Sent as: Authorization: Bearer [token]"})]}),a.auth_type==="api_key"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(o,{htmlFor:"api_key_header",children:"Header Name"}),e.jsx(c,{id:"api_key_header",value:a.auth_credentials?.key||"",onChange:t=>n({...a,auth_credentials:{...a.auth_credentials,key:t.target.value}}),placeholder:"X-API-Key"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(o,{htmlFor:"api_key_value",children:"API Key Value"}),e.jsx(c,{id:"api_key_value",type:"password",value:a.auth_credentials?.value||"",onChange:t=>n({...a,auth_credentials:{...a.auth_credentials,value:t.target.value}}),placeholder:"your-api-key"})]})]}),a.auth_type==="hmac"&&e.jsxs("div",{className:"space-y-2",children:[e.jsx(o,{htmlFor:"hmac_secret",children:"HMAC Secret"}),e.jsx(c,{id:"hmac_secret",type:"password",value:a.auth_credentials?.secret||"",onChange:t=>n({...a,auth_credentials:{secret:t.target.value}}),placeholder:"your-hmac-secret"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Signature sent in X-Teleman-Signature header (HMAC-SHA256)"})]})]})]}),e.jsxs("div",{className:"flex justify-end gap-3",children:[e.jsx(j,{href:"/integrations",children:e.jsx(m,{type:"button",variant:"outline",children:"Cancel"})}),e.jsx(m,{type:"submit",disabled:b||a.events.length===0,children:b?"Saving...":r?"Update Integration":"Create Integration"})]})]})]})]})}export{ye as default};
//# sourceMappingURL=form-C-B22X_I.js.map
