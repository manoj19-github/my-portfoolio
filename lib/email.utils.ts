// lib/email.util.ts

import nodemailer from 'nodemailer';

/* ─── Types ───────────────────────────────────────────────────────────────── */
export interface SendContactEmailOptions {
  senderName:  string;
  senderEmail: string;
  message:     string;
  submittedAt: string;
  ipAddress?:  string;
}

/* ─── Transporter (singleton-ish, reused across calls in the same process) ── */
const transporter = nodemailer.createTransport({
  service: 'gmail',

  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,   // App Password (spaces are fine, nodemailer strips them)
  },
});

/* ─── HTML helpers ────────────────────────────────────────────────────────── */
function notificationHtml(opts: SendContactEmailOptions): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

            <!-- Header -->
            <tr>
              <td style="background:#1d4ed8;padding:24px 32px;">
                <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">📬 New Contact Form Submission</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:16px;">
                      <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">From</p>
                      <p style="margin:0;font-size:16px;color:#111827;font-weight:600;">${opts.senderName}</p>
                      <p style="margin:0;font-size:14px;color:#1d4ed8;">${opts.senderEmail}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:16px;">
                      <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Submitted at</p>
                      <p style="margin:0;font-size:14px;color:#374151;">${opts.submittedAt}</p>
                    </td>
                  </tr>
                  ${opts.ipAddress ? `
                  <tr>
                    <td style="padding-bottom:16px;">
                      <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">IP Address</p>
                      <p style="margin:0;font-size:14px;color:#374151;">${opts.ipAddress}</p>
                    </td>
                  </tr>` : ''}
                  <tr>
                    <td style="padding-top:8px;border-top:1px solid #e5e7eb;">
                      <p style="margin:0 0 8px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Message</p>
                      <p style="margin:0;font-size:15px;color:#111827;line-height:1.7;white-space:pre-wrap;">${opts.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
                <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">This email was generated automatically by your portfolio contact form.</p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
}

function confirmationHtml(opts: SendContactEmailOptions): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

            <!-- Header -->
            <tr>
              <td style="background:#1d4ed8;padding:24px 32px;text-align:center;">
                <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">✅ Message Received!</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 16px;font-size:16px;color:#111827;">Hi <strong>${opts.senderName}</strong>,</p>
                <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
                  Thanks for getting in touch! I've received your message and will get back to you within <strong>24–48 hours</strong>.
                </p>

                <!-- Message recap -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-left:4px solid #1d4ed8;border-radius:4px;margin:24px 0;">
                  <tr>
                    <td style="padding:16px;">
                      <p style="margin:0 0 6px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Your message</p>
                      <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap;">${opts.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                    </td>
                  </tr>
                </table>

                <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">
                  If you have anything to add, just reply to this email. Talk soon!
                </p>
                <p style="margin:24px 0 0;font-size:15px;color:#111827;">— Manoj Santra</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
                <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">You're receiving this because you submitted a contact form at Manoj's portfolio.</p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
}

/* ─── Main exported function ──────────────────────────────────────────────── */
export async function sendContactEmail(opts: SendContactEmailOptions): Promise<void> {
  const ownerEmail = process.env.EMAIL_USERNAME!;

  await Promise.all([
    // 1️⃣  Notify you of the new submission
    transporter.sendMail({
      from:    `"Portfolio Contact" <${ownerEmail}>`,
      to:      ownerEmail,
      replyTo: opts.senderEmail,
      subject: `New message from ${opts.senderName}`,
      html:    notificationHtml(opts),
    }),

    // 2️⃣  Send confirmation to the person who submitted
    transporter.sendMail({
      from:    `"Manoj Santra" <${ownerEmail}>`,
      to:      opts.senderEmail,
      subject: `Got your message, ${opts.senderName}! ✅`,
      html:    confirmationHtml(opts),
    }),
  ]);
}