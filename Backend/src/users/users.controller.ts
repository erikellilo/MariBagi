import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  ParseUUIDPipe,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserRequestDTO,
  CreateUserResponseDTO,
} from './dto/create-users.dto';
import { UpdateUserDTO } from './dto/update-users.dto-request';
import { UpdatePasswordDTO } from './dto/update-password-request.dto';
import { ZodValidationPipe } from 'src/shared/pipes/zod-validation.pipe';
import {
  createUserSchema,
  updateUserSchema,
  updatePasswordSchema,
} from './schema/user.schema';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async FindSingleUser(@Param('id', new ParseUUIDPipe()) id: string) {
    //* Nanti dirubah merefer ke Service untuk get User Info
  }

  @Post(':userId')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(createUserSchema))
    createUserDTO: CreateUserRequestDTO,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<CreateUserResponseDTO> {
    return this.usersService.create(createUserDTO, userId);
  }

  @Post(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    //* Nanti akan merefer ke delete user service
    this.usersService.delete(id);
  }

  @Patch(':id')
  async update(
    @Body(new ZodValidationPipe(updateUserSchema)) updateUserDTO: UpdateUserDTO,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    this.usersService.update(updateUserDTO, id);
  }

  @Patch(':id/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePassword(
    @Body(new ZodValidationPipe(updatePasswordSchema))
    updatePassword: UpdatePasswordDTO,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    this.usersService.updatePassword(updatePassword, id);
  }
}
