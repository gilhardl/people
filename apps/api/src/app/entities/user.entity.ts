import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { UsersEntity } from '@people/users';

@Entity()
export class User implements UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  confirmationToken: string;

  @Column()
  recoverToken: string;

  @Column()
  role: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  job: string;
}
