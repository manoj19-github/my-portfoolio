'use server';

import { sendContactEmail } from '@/lib/email.utils';
import { connectDB } from '@/lib/mongoclient';
import { headers } from 'next/headers';


/* ─── Zod-lite manual validation (no extra dep needed) ───────────────────── */
function validatePayload(data: unknown): {
    name: string; email: string; message: string;
} {
    if (typeof data !== 'object' || data === null)
        throw new Error('Invalid payload');

    const { name, email, message } = data as Record<string, unknown>;

    if (typeof name !== 'string' || name.trim().length < 2) throw new Error('Name must be at least 2 characters.');
    if (typeof name !== 'string' || name.trim().length > 120) throw new Error('Name is too long.');
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
        throw new Error('Please enter a valid email address.');
    if (typeof message !== 'string' || message.trim().length < 10) throw new Error('Message must be at least 10 characters.');
    if (typeof message !== 'string' || message.trim().length > 5000) throw new Error('Message is too long (max 5000 chars).');

    return {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
    };
}

/* ─── Return type ─────────────────────────────────────────────────────────── */
export interface ContactActionResult {
    success: boolean;
    message: string;
    /* returned only on success for optimistic UI */
    insertedId?: string;
}

/* ─── Server Action ───────────────────────────────────────────────────────── */
export async function submitContactForm(
    formData: FormData | { name: string; email: string; message: string }
): Promise<ContactActionResult> {

    /* ── 1. Parse raw data ── */
    let raw: { name: string; email: string; message: string };

    if (formData instanceof FormData) {
        raw = {
            name: formData.get('name') as string ?? '',
            email: formData.get('email') as string ?? '',
            message: formData.get('message') as string ?? '',
        };
    } else {
        raw = formData;
    }

    /* ── 2. Validate ── */
    let validated: { name: string; email: string; message: string };
    try {
        validated = validatePayload(raw);
    } catch (err: any) {
        return { success: false, message: err.message ?? 'Validation failed.' };
    }

    /* ── 3. Get request metadata ── */
    let ipAddress: string | undefined;
    let userAgent: string | undefined;
    try {
        const hdrs = await headers();
        ipAddress = (
            hdrs.get('x-forwarded-for')?.split(',')[0] ??
            hdrs.get('x-real-ip') ??
            undefined
        );
        userAgent = hdrs.get('user-agent') ?? undefined;
    } catch {
        /* headers() unavailable outside request context — safe to ignore */
    }

    /* ── 4. Save to MongoDB ── */
    
    try {
        const db = await connectDB();
        // const doc = await ContactMessage.create({
        //   name:      validated.name,
        //   email:     validated.email,
        //   message:   validated.message,
        //   ipAddress: ipAddress ?? null,
        //   userAgent: userAgent ?? null,
        //   isRead:    false,
        // });
        let insertedId: string;
        const result = await db.collection('contact_messages').insertOne({
            name: validated.name,
            email: validated.email,
            message: validated.message,
            ipAddress: ipAddress ?? null,
            userAgent: userAgent ?? null,
            isRead: false,
            createdAt: new Date(),
        });
        insertedId = result.insertedId.toString();
    } catch (err: any) {
        console.error('[ContactForm] MongoDB error:', err);
        /* Don't expose DB errors to the client */
        return {
            success: false,
            message: 'Could not save your message. Please try again later.',
        };
    }

    /* ── 5. Send emails ── */
    try {
        await sendContactEmail({
            senderName: validated.name,
            senderEmail: validated.email,
            message: validated.message,
            submittedAt: new Date().toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'medium',
                timeStyle: 'short',
            }),
            ipAddress,
        });
    } catch (err: any) {
        console.error('[ContactForm] Email error:', err);
        /*
         * Message is already saved — email failure is non-fatal.
         * Return success so the user isn't confused, but log it.
         */
    }

    return {
        success: true,
        message: "Thanks for reaching out! I'll get back to you within 24–48 hours. Check your inbox for a confirmation.",
    };
}