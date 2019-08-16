import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';

import * as sgMail from '@sendgrid/mail';

import { environment } from '../../environments/environment';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

import { User } from '../entities/user.entity';

import * as mocks from '../users/__mocks__/users';

jest.mock('@sendgrid/mail', () => ({
  send: jest
    .fn()
    .mockImplementation(() => [{ statusCode: 202, message: 'Accepted' }])
}));

const MockRepository = jest.fn().mockImplementation(() => {
  return {
    metadata: {
      columns: [],
      relations: []
    }
  };
});

describe('Auth Controller', () => {
  let controller: AuthController;
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: environment.jwtSecret
        })
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        { provide: getRepositoryToken(User), useValue: new MockRepository() }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signin', () => {
    it('should return a user matching given credentials, associated with a JWT (success)', async () => {
      const { password, confirmationToken, recoverToken, ...user } = mocks.user;

      const expected = {
        jwt: 'supersecretjwt',
        user: user
      };

      jest.spyOn(service, 'signin').mockImplementation(async () => expected);

      const result = await controller.signin({ user: user });

      expect(result).toMatchObject(expected);
    });
  });

  describe('register', () => {
    it("should throw an exception if user's email address isn't available", async () => {
      const { password, confirmationToken, recoverToken, ...user } = mocks.user;
      user.email = user.email.split('@')[0] + '@fakedomain.com'; // Ensure to don't throw 'banned-email-domain' exception
      user.username = user.email; // The frontend use user email as username

      expect(
        controller.register({
          username: 'john.doe@gmail.com',
          email: 'john.doe@gmail.com',
          firstname: 'john',
          lastname: 'doe',
          confirmationUrl: 'http://localhost:4200/#/auth/confirm'
        })
      ).rejects.toThrow('banned-email-domain');

      jest
        .spyOn(usersService, 'isEmailAvailable')
        .mockImplementation(async () => false);

      expect(
        controller.register({
          username: user.username,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          confirmationUrl: 'http://localhost:4200/#/auth/confirm'
        })
      ).rejects.toThrow('email-not-available');
    });

    // it('should send an email to new user with a link for user confirmation, based on given confirmationUrl and containing confirmation token', () => {});

    it('should return true (success)', async () => {
      const { password, confirmationToken, recoverToken, ...user } = mocks.user;
      user.email = user.email.split('@')[0] + '@fakedomain.com'; // Ensure to don't throw 'banned-email-domain' exception
      user.username = user.email; // The frontend use user email as username

      const expected = {
        user: user,
        token: 'super-secret-uuid-token'
      };

      jest
        .spyOn(usersService, 'isEmailAvailable')
        .mockImplementation(async () => true);

      jest.spyOn(service, 'register').mockImplementation(async () => expected);

      const result = await controller.register({
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        confirmationUrl: 'http://localhost:4200/#/auth/confirm'
      });

      expect(result).toBe(true);
    });

    it('should throw an exception (error)', () => {
      const { password, confirmationToken, recoverToken, ...user } = mocks.user;
      user.email = user.email.split('@')[0] + '@fakedomain.com'; // Ensure to don't throw 'banned-email-domain' exception
      user.username = user.email; // The frontend use user email as username

      const expected = {
        user: null,
        token: ''
      };

      jest
        .spyOn(usersService, 'isEmailAvailable')
        .mockImplementation(async () => true);

      jest.spyOn(service, 'register').mockImplementation(async () => expected);

      expect(
        controller.register({
          username: user.username,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          confirmationUrl: 'http://localhost:4200/#/auth/confirm'
        })
      ).rejects.toThrow('user-creation-error');
    });

    it('should send a confirmation email to user', async () => {
      const { password, confirmationToken, recoverToken, ...user } = mocks.user;
      user.email = user.email.split('@')[0] + '@fakedomain.com'; // Ensure to don't throw 'banned-email-domain' exception
      user.username = user.email; // The frontend use user email as username

      const expected = {
        user: user,
        token: 'super-secret-uuid-token'
      };

      jest
        .spyOn(usersService, 'isEmailAvailable')
        .mockImplementation(async () => true);

      jest.spyOn(service, 'register').mockImplementation(async () => expected);

      await controller.register({
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        confirmationUrl: 'http://localhost:4200/#/auth/confirm'
      });

      expect(sgMail.send).toHaveBeenCalled();
    });
  });
});
