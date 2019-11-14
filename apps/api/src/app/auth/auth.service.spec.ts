import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';

import * as moment from 'moment';

import * as uuidTime from 'uuid-time';
import * as uuid from 'uuid/v1';
import * as crypto from 'crypto';

import { environment } from '../../environments/environment';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

import { User } from '../entities/user.entity';

import * as mocks from '../users/__mocks__/users';

jest.mock('uuid/v1');
jest.mock('uuid-time');

const MockRepository = jest.fn().mockImplementation(() => {
  return {
    metadata: {
      columns: [],
      relations: []
    }
  };
});

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: environment.jwtSecret
        })
      ],
      providers: [
        AuthService,
        UsersService,
        { provide: getRepositoryToken(User), useValue: new MockRepository() }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user matching given credentials (success)', async () => {
      const { password, confirmationToken, recoverToken, ...user } = mocks.user;

      jest
        .spyOn(usersService, 'findOneByUsername')
        .mockImplementation(async () => ({
          ...mocks.user,
          password: crypto
            .createHash('md5')
            .update(password)
            .digest('hex')
        }));

      const result = await service.validateUser(user.username, password);

      expect(result).toMatchObject(user);
    });

    it('should return null (error)', async () => {
      const { password, confirmationToken, recoverToken, ...user } = mocks.user;

      jest
        .spyOn(usersService, 'findOneByUsername')
        .mockImplementation(async () => mocks.user);

      const result = await service.validateUser(user.username, 'wrongpassword');

      expect(result).toBe(null);
    });
  });

  describe('signin', () => {
    it('should return given user associated with a jwt', async () => {
      const { password, confirmationToken, recoverToken, ...user } = mocks.user;

      const result = await service.signin(user);

      expect(result.user).toBe(user);
      expect(result.jwt).toBeDefined();
    });
  });

  describe('register', () => {
    it('should create and return an non-confirmed administrator user and a confirmation token', async () => {
      const { password, confirmationToken, recoverToken, ...user } = mocks.user;
      user.username = user.email; // The frontend use user email as username

      const expected = {
        user: {
          id: 1,
          username: user.username,
          confirmed: false,
          role: 'administrator',
          firstname: user.firstname,
          lastname: user.lastname,
          phone: '',
          email: user.email,
          job: ''
        },
        token: '2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d'
      };

      jest.spyOn(usersService, 'register').mockImplementation(async () => ({
        ...expected.user,
        confirmationToken: expected.token
      }));

      uuid.mockReturnValue(expected.token);

      const result = await service.register(
        user.username,
        user.email,
        user.lastname,
        user.firstname
      );

      expect(result).toMatchObject(expected);
    });
  });

  describe('initiateConfirmation', () => {
    it("should return false if token expiration date isn't valid", async () => {
      uuidTime.v1.mockReturnValue(
        moment()
          .subtract(2, 'hours')
          .valueOf()
      );
      const token = uuid();

      const res = await service.initiateConfirmation(token);

      expect(res).toBe(false);
    });

    it('should return true (success)', async () => {
      const user = mocks.user;

      const token = uuid();

      uuidTime.v1.mockReturnValue(
        moment()
          .subtract(2, 'minutes')
          .valueOf()
      );
      jest
        .spyOn(usersService, 'findOneByConfirmationToken')
        .mockImplementation(async () => user);

      const res = await service.initiateConfirmation(token);

      expect(res).toBe(true);
    });

    it('should return false (error)', async () => {
      const token = uuid();

      uuidTime.v1.mockReturnValue(
        moment()
          .subtract(2, 'minutes')
          .valueOf()
      );
      jest
        .spyOn(usersService, 'findOneByConfirmationToken')
        .mockImplementation(async () => null);

      const res = await service.initiateConfirmation(token);

      expect(res).toBe(false);
    });
  });
});
