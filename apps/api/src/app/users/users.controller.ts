import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Crud, CrudController } from '@nestjsx/crud';

import { User } from '../entities/user.entity';
import { UsersService } from './users.service';

@Crud({
  model: {
    type: User
  }
})
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {}
}
