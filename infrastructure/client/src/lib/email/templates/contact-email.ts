import { ContactEmailData } from "@/types/email";

export function generateContactEmailHTML(data: ContactEmailData): string {
  const { name, email, subject, message } = data;
  const currentDate = new Date().toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
            color: white; 
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 { 
            font-size: 24px; 
            font-weight: 600;
            margin: 0;
          }
          .content { 
            padding: 30px;
          }
          .info-section {
            background: #f9fafb;
            border-left: 4px solid #2563eb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
          }
          .info-item {
            margin-bottom: 16px;
          }
          .info-item:last-child {
            margin-bottom: 0;
          }
          .label { 
            font-weight: 600; 
            color: #374151;
            font-size: 14px;
            margin-bottom: 6px;
            display: block;
          }
          .value { 
            color: #1f2937;
            font-size: 15px;
            line-height: 1.5;
          }
          .value a {
            color: #2563eb;
            text-decoration: none;
          }
          .value a:hover {
            text-decoration: underline;
          }
          .message-section {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
          }
          .message-text {
            white-space: pre-wrap;
            line-height: 1.6;
            color: #374151;
          }
          .footer { 
            text-align: center; 
            color: #6b7280;
            font-size: 13px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          }
          .icon {
            display: inline-block;
            margin-right: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 Nouveau message de contact</h1>
          </div>
          
          <div class="content">
            <div class="info-section">
              <div class="info-item">
                <span class="label"><span class="icon">👤</span>Nom</span>
                <div class="value">${escapeHtml(name)}</div>
              </div>
              
              <div class="info-item">
                <span class="label"><span class="icon">📧</span>Email</span>
                <div class="value">
                  <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
                </div>
              </div>
              
              <div class="info-item">
                <span class="label"><span class="icon">📋</span>Sujet</span>
                <div class="value">${escapeHtml(subject)}</div>
              </div>
            </div>
            
            <div class="message-section">
              <span class="label"><span class="icon">💬</span>Message</span>
              <div class="message-text">${escapeHtml(message)}</div>
            </div>
            
            <div class="footer">
              <p>Reçu le ${currentDate}</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}