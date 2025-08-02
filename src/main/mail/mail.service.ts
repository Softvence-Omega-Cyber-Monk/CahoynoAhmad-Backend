import { Injectable } from '@nestjs/common';

import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MailService {
  constructor(private configService: ConfigService) {}
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendMail(options: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }) {
    const { to, subject, html, from } = options;

    return await this.transporter.sendMail({
      from: from || `"No Reply" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  }
}
