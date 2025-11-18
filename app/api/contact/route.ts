import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Функция для очистки HTML/JS из текста
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Валидация
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Очистка от HTML/JS
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = phone ? sanitizeInput(phone) : 'Not provided';
    const sanitizedMessage = sanitizeInput(message);

    // Проверяем наличие SMTP пароля
    const smtpPassword = process.env.SMTP_PASSWORD;
    if (!smtpPassword) {
      console.error('SMTP_PASSWORD is not configured');
      return NextResponse.json(
        { 
          error: 'Email service is not configured. Please set SMTP_PASSWORD in environment variables.',
          details: 'SMTP configuration missing'
        },
        { status: 500 }
      );
    }

    // Создаем transporter для отправки email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'nuviaPrint@gmail.com',
        pass: smtpPassword,
      },
      tls: {
        rejectUnauthorized: false, // Для разработки, в продакшене лучше true
      },
    });

    // Проверяем соединение
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error('SMTP connection verification failed:', verifyError);
      return NextResponse.json(
        { 
          error: 'Failed to connect to email server. Please check SMTP settings.',
          details: verifyError instanceof Error ? verifyError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    // Отправляем email
    const mailOptions = {
      from: `"NUVIA Contact Form" <${process.env.SMTP_USER || 'nuviaPrint@gmail.com'}>`,
      to: 'nuviaPrint@gmail.com',
      replyTo: sanitizedEmail,
      subject: `New Contact Form Submission from ${sanitizedName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong style="color: #000;">Name:</strong> ${sanitizedName}</p>
            <p style="margin: 10px 0;"><strong style="color: #000;">Email:</strong> <a href="mailto:${sanitizedEmail}" style="color: #0066cc;">${sanitizedEmail}</a></p>
            <p style="margin: 10px 0;"><strong style="color: #000;">Phone:</strong> ${sanitizedPhone}</p>
          </div>
          <div style="margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
            <p style="background-color: #fff; padding: 15px; border-left: 4px solid #000; white-space: pre-wrap;">${sanitizedMessage.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${sanitizedName}
Email: ${sanitizedEmail}
Phone: ${sanitizedPhone}

Message:
${sanitizedMessage}
      `.trim(),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Более детальная обработка ошибок
    let errorMessage = 'Failed to send email';
    let errorDetails = 'Unknown error';

    if (error instanceof Error) {
      errorDetails = error.message;
      
      // Специфичные ошибки nodemailer
      if (error.message.includes('Invalid login')) {
        errorMessage = 'Invalid email credentials. Please check SMTP_USER and SMTP_PASSWORD.';
      } else if (error.message.includes('Connection timeout')) {
        errorMessage = 'Connection to email server timed out. Please check SMTP_HOST and SMTP_PORT.';
      } else if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Could not connect to email server. Please check SMTP settings.';
      } else if (error.message.includes('authentication failed')) {
        errorMessage = 'Email authentication failed. Please check your SMTP credentials.';
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    );
  }
}

