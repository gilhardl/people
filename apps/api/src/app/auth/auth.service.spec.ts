import { Test, TestingModule } from '@nestjs/testing';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';

import { environment } from '../../environments/environment';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

import { User } from '../entities/user.entity';

import * as mocks from '../users/__mocks__/users';

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
    test('should return user matching given credentials (success)', async () => {
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

  describe.only('signin', () => {
    it.only('should return given user associated with a jwt', async () => {
      const { password, confirmationToken, recoverToken, ...user } = mocks.user;

      const result = await service.signin(user);

      expect(result.user).toBe(user);
      expect(result.jwt).toBeDefined();
    });
  });
});
