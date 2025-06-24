import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './dto/create-users.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDTO } from './dto/update-users.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  private users: User[];

  async create(
    createuserDTO: CreateUserDTO,
    userCreateById: string,
  ): Promise<User> {
    const user = new User();
    user.id = uuidv4.toString();
    user.name = createuserDTO.name;
    user.email = createuserDTO.password;
    user.passwordHash = createuserDTO.password;
    user.createdAt = new Date();
    user.updateAt = new Date();
    user.createdBy = userCreateById;

    this.users.push(user);
    return user;
  }

  async update(updateUserDTO: UpdateUserDTO, userId: string): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    const upadateUser = this.users[userIndex];
    upadateUser.name = updateUserDTO.name;
    upadateUser.email = updateUserDTO.email;
    upadateUser.updateAt = new Date();
    this.users[userIndex] = upadateUser;
    return upadateUser;
  }

  async updatePassword(
    updatePasswordDTO: UpdatePasswordDTO,
    userId: string,
  ): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    const upadateUser = this.users[userIndex];
    upadateUser.passwordHash = updatePasswordDTO.newPassword;
    this.users[userIndex] = upadateUser;
    return upadateUser;
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
