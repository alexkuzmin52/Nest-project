import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { IUser } from '../src/user/dto/user.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendUserConfirm(user: IUser, token: string) {
    const url = `http://localhost:3000/auth/confirm/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Nice App! Confirm your Email',
      template: 'confirmation',
      context: {
        name: user.name,
        url,
      },
    });
  }

  async sendUserForgot(user: IUser, token: string) {
    const url = `http://localhost:3000/auth/reset/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'change Password',
      template: 'forgot',
      context: {
        name: user.name,
        url,
      },
    });
  }

  async sendTemporaryPassword(user: IUser, data: string): Promise<any> {
    const url = `http://localhost:3000/auth/pass`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Temporary data',
      template: 'reset',
      context: {
        name: user.name,
        url,
        pass: data,
      },
    });
  }
}
