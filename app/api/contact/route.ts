import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { contactSchema, sanitizeInput } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';
import { env } from '@/lib/env-validation';
import { logger } from '@/lib/logger';
import { requireCSRF } from '@/lib/csrf';

export async function POST(request: NextRequest) {
  try {
    // CSRF protection
    if (!requireCSRF(request)) {
      return NextResponse.json(
        { error: 'Invalid request origin' },
        { status: 403 }
      );
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = await checkRateLimit(`contact:${ip}`);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
          },
        }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = contactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validationResult.data;

    // Get email configuration from environment variables
    const emailUser = env.EMAIL_USER;
    const emailPassword = env.EMAIL_PASSWORD;
    const emailTo = env.EMAIL_TO;
    
    if (!emailUser || !emailPassword || !emailTo) {
      logger.error('Email service not configured', undefined, { endpoint: '/api/contact' });
      return NextResponse.json(
        { 
          error: 'Email service is not configured. Please add EMAIL_USER, EMAIL_PASSWORD, and EMAIL_TO to your .env.local file. For now, your message has been logged.',
          message: 'Your contact form submission has been received but email is not configured.'
        },
        { status: 200 } // Return 200 so form doesn't show error to user
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    // Sanitize user inputs to prevent XSS
    const sanitizeHtml = (str: string) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    };

    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedSubject = sanitizeInput(subject);
    const sanitizedMessage = sanitizeInput(message);

    // Email content
    const mailOptions = {
      from: emailUser,
      to: emailTo,
      subject: `Contact Form: ${sanitizeHtml(sanitizedSubject)}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${sanitizeHtml(sanitizedName)}</p>
        <p><strong>Email:</strong> ${sanitizeHtml(sanitizedEmail)}</p>
        <p><strong>Subject:</strong> ${sanitizeHtml(sanitizedSubject)}</p>
        <p><strong>Message:</strong></p>
        <p>${sanitizeHtml(sanitizedMessage).replace(/\n/g, '<br>')}</p>
      `,
      replyTo: sanitizedEmail,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    logger.info('Contact form email sent successfully', { email: sanitizedEmail });

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    logger.error('Error sending contact form email', error instanceof Error ? error : undefined, {
      endpoint: '/api/contact',
    });
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}

