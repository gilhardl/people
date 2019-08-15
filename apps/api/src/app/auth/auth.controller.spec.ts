import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';

import { environment } from '../../environments/environment';

import { AuthController } from './auth.controller';
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

describe('Auth Controller', () => {
  let controller: AuthController;
  let service: AuthService;

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
});
