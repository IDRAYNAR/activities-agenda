import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email est requis' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: 'Aucun utilisateur trouvé avec cet email' },
        { status: 404 }
      );
    }

    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f3f4f6; padding: 40px; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #7c3aed; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
                Réinitialisation de votre mot de passe
              </h1>
              <p style="color: #4b5563; font-size: 16px; margin-bottom: 30px;">
                Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour procéder :
              </p>
              <a href="${resetUrl}" 
                 style="background-color: #7c3aed; color: white; padding: 12px 24px; 
                        border-radius: 6px; text-decoration: none; font-size: 16px; 
                        display: inline-block; transition: background-color 0.3s;">
                Réinitialiser mon mot de passe
              </a>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 14px;">
                Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
              </p>
              <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
                Ce lien expirera dans 1 heure.
              </p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #9ca3af; font-size: 12px;">
              Vous recevez cet email car une demande de réinitialisation de mot de passe a été effectuée pour votre compte.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Email de réinitialisation envoyé' });
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 