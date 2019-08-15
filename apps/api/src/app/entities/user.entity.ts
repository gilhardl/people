import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

import { UsersEntity } from '@people/users';

@Entity()
export class User implements UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  username: string;

  @Column({
    default: ''
  })
  password?: string;

  @Column({
    default: false
  })
  confirmed: boolean;

  @Column({
    default: ''
  })
  confirmationToken?: string;

  @Column({
    default: ''
  })
  recoverToken?: string;

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
