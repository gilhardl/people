import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';

import { environment } from '../../environments/environment';

import * as uuid from 'uuid/v4';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

import { User } from '../entities/user.entity';

import * as mocks from '../users/__mocks__/users';

jest.mock('uuid/v4');

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
        .mockImplementation(async () => mocks.user);

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
        token: '10ba038e-48da-487b-96e8-8d3b99b6d18a'
      };

      jest
        .spyOn(usersService, 'register')
        .mockImplementation(async () => expected.user);

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
});
