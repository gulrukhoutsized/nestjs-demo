import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dt';
import { NotFoundException } from '@nestjs/common/exceptions';
import { UserRole } from './user-role.type';

@Injectable()
export class UsersService {
  private users = [
    { id: 1, name: 'Gulrukh', email: 'gulrukh@example.com', role: 'INTERN' },
    { id: 2, name: 'Areeba', email: 'areeba@example.com', role: 'ENGINEER' },
    { id: 3, name: 'Sana', email: 'sana@example.com', role: 'ADMIN' },
  ];

  findAll(role?: UserRole) {
    if (role) {
      const rolesArray = this.users.filter((user) => user.role === role);
      if (rolesArray.length === 0) {
        throw new NotFoundException(`No users found with role ${role}`);
      }
      return rolesArray;
    }

    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  create(createUserDto: CreateUserDto) {
    const usersByHighestId = [...this.users].sort((a, b) => b.id - a.id);
    const newUser = { id: usersByHighestId[0].id + 1, ...createUserDto };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    this.users = this.users.map((user) => {
      if (user.id === id) {
        return { ...user, ...updateUserDto };
      }
      return user;
    });
    return this.findOne(id);
  }
  delete(id: number) {
    const removedUser = this.findOne(id);
    this.users = this.users.filter((user) => user.id !== id);
    return removedUser;
  }
}
