// Nest common provides route decorators, guards, interceptors, and HTTP helpers.
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
// Nest pipes validate request bodies and convert route params.
import { ParseIntPipe, ValidationPipe } from '@nestjs/common/pipes';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dt';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser as CurrentUserDecorator } from '../common/decorators/current-user.decorator';
import type { CurrentUserInfo } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import type { UserRole } from './user-role.type';

@Controller('users')
// Apply the response wrapper to all routes in this controller.
@UseInterceptors(ResponseInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query('role') role?: UserRole) {
    return this.usersService.findAll(role);
  }

  @Get('me')
  // Demonstrates a custom decorator that pulls user data from request headers.
  getProfile(@CurrentUserDecorator() currentUser: CurrentUserInfo) {
    return currentUser;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  // Only admins can create users in this guard example.
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  create(
    @Body(ValidationPipe)
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  // Admins and engineers can update users in this guard example.
  @Roles('ADMIN', 'ENGINEER')
  @UseGuards(RolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe)
    updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  // Only admins can delete users in this guard example.
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
