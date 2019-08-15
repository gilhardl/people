import * as faker from 'faker';

import { User } from '../../entities/user.entity';

export const users: User[] = [
  {
    id: 1,
    username: faker.internet.userName(),
    role: 'administrator',
    confirmed: true,
    password: faker.internet.password(),
    confirmationToken: faker.random.uuid(),
    recoverToken: faker.random.uuid(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    job: faker.name.jobTitle()
  },
  {
    id: 2,
    username: faker.internet.userName(),
    role: 'authenticated',
    confirmed: true,
    password: faker.internet.password(),
    confirmationToken: faker.random.uuid(),
    recoverToken: faker.random.uuid(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    job: faker.name.jobTitle()
  },
  {
    id: 3,
    username: faker.internet.userName(),
    role: 'authenticated',
    confirmed: true,
    password: faker.internet.password(),
    confirmationToken: faker.random.uuid(),
    recoverToken: faker.random.uuid(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    job: faker.name.jobTitle()
  },
  {
    id: 4,
    username: faker.internet.userName(),
    role: 'authenticated',
    confirmed: true,
    password: faker.internet.password(),
    confirmationToken: faker.random.uuid(),
    recoverToken: faker.random.uuid(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    job: faker.name.jobTitle()
  },
  {
    id: 5,
    username: faker.internet.userName(),
    role: 'authenticated',
    confirmed: true,
    password: faker.internet.password(),
    confirmationToken: faker.random.uuid(),
    recoverToken: faker.random.uuid(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    job: faker.name.jobTitle()
  }
];

export const user: User = users[2];
