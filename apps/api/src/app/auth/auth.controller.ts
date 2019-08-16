import {
  Controller,
  Post,
  Request,
  UseGuards,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Param
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import * as sgMail from '@sendgrid/mail';

import { environment } from '../../environments/environment';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

import { BANNED_EMAIL_DOMAINS } from './banned-email-domains';

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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

    const confirmationUrl = body.confirmationUrl + '/' + token;

    try {
      const res = await sgMail.send({
        to: environment.production ? user.email : 'l.gilhard@gmail.com',
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

      if (res[0].statusCode !== 202) {
        throw new HttpException(
          'error-sending-confirmation-email',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return true;
    } catch (err) {
      throw new HttpException(
        'error-sending-confirmation-email',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('email-availability/:email')
  async emailAvailability(@Param() params) {
    if (!params.email.match(emailRegex)) {
      throw new HttpException('invalid-email', HttpStatus.BAD_REQUEST);
    }

    if (BANNED_EMAIL_DOMAINS.includes(params.email.split('@')[1])) {
      return false;
    }

    return this.usersService.isEmailAvailable(params.email);
  }

  @Get('initiate-confirmation/:token')
  async initiateConfirmation(@Param() params) {
    const tokenOk = await this.authService.initiateConfirmation(params.token);
    if (!tokenOk) {
      throw new HttpException('not-found-or-expirated', HttpStatus.NOT_FOUND);
    }
    return true;
  }

  @Post('confirm/:token')
  async confirm(@Body() body: any, @Param() params) {
    if (body.password.length < 6) {
      throw new HttpException('password-too-weak', HttpStatus.BAD_REQUEST);
    }
    const tokenOk = await this.authService.initiateConfirmation(params.token);
    if (!tokenOk) {
      throw new HttpException('not-found-or-expirated', HttpStatus.NOT_FOUND);
    }

    const result = await this.authService.confirm(params.token, body.password);

    if (result.user === null) {
      throw new HttpException(
        'user-creation-error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    try {
      const res = await sgMail.send({
        to: environment.production ? result.user.email : 'l.gilhard@gmail.com',
        from: 'People<people@flud.fr>',
        subject: 'Welcome',
        text: `
          Hi ${result.user.firstname},\n
          Congratulations, your People account is now activated !\n\n
          People is still in development, so you have chances to find bugs or undesired behaviour. But don't be affraid, we are working hard to make People stable and fully featured.\n\n
          If you have any problems or additionnal questions, feel free to contact ou Support team (@: l.gilhard@gmail.com).\n\n
          See you soon on People,\n
          The People team.
        `,
        html: `
          <p>Hi ${result.user.firstname},</p>
          <p>Congratulations, your People account is now activated !</p>
          <p>People is still in development, so you have chances to find bugs or undesired behaviour. But don't be affraid, we are working hard to make People stable and fully featured.<br />
          If you have any problems or additionnal questions, feel free to contact our <a href="mail:l.gilhard@gmail.com">Support team</a></p>
          <p>See you soon on People,<br />
          The People team.</p>
        `
      });

      if (res[0].statusCode !== 202) {
        throw new HttpException(
          'error-sending-registration-email',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return true;
    } catch (err) {
      throw new HttpException(
        'error-sending-registration-email',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
