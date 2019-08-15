import * as faker from 'faker';

import { UsersEntity } from '@people/users';

export const users: UsersEntity[] = [
  {
    id: 1,
    username: faker.internet.userName(),
    role: 'administrator',
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

export const user: UsersEntity = users[2];
