import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  createdAt: Date;

  @Column()
  updateAt: Date;

  @Column()
  createdBy?: string;

  @Column()
  lastUpdateBy?: string;
}
