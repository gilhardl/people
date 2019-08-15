import {
  Controller,
  Post,
  Request,
  UseGuards,
  Body,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import * as sgMail from '@sendgrid/mail';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

import { BANNED_EMAIL_DOMAINS } from './banned-email-domains';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  async signin(@Request() req) {
    return this.authService.signin(req.user);
  }

  @Post('register')
  async register(@Body() body: any) {
    // Todo : check body validation

    if (BANNED_EMAIL_DOMAINS.includes(body.email.split('@')[1])) {
      throw new HttpException('banned-email-domain', HttpStatus.BAD_REQUEST);
    }

    const emailAvailable = await this.usersService.isEmailAvailable(body.email);
    if (!emailAvailable) {
      throw new HttpException('email-not-available', HttpStatus.BAD_REQUEST);
    }

    const { user, token } = await this.authService.register(
      body.username,
      body.email,
      body.firstname,
      body.lastname
    );

    if (user === null) {
      throw new HttpException(
        'user-creation-error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    if (token === null) {
      throw new HttpException(
        'token-creation-error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const confirmationUrl = body.confirmationUrl + '/' + token;

    sgMail.send({
      to: 'l.gilhard@gmail.com',
      from: 'People<people@flud.fr>',
      subject: 'Activate your account',
      text: `
        ${user.firstname} ${user.lastname},\n
        To activate your People account, please verify your email address.\n
        Your account will not be created until your email address is confirmed.\n\n
        To verify your email, copy and paste the following URL into your browser:\n
        ${confirmationUrl}
      `,
      html: `
        <p>${user.firstname} ${user.lastname},</p>
        <p>To activate your People account, please verify your email address.<br />
        Your account will not be created until your email address is confirmed.</p>
        <a href="${confirmationUrl}">Verify my email address</a>
        <br />
        <p>Or, copy and paste the following URL into your browser:</p>
        <a href="${confirmationUrl}">${confirmationUrl}</a>
      `
    });

    return true;
  }
}
