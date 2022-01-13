import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserType } from './schemas/user-schema';
import { Model } from 'mongoose';
import { IUser } from './dto/user.inetrface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeUserRoleDto } from './dto/change-user-role.dto';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserType>) {}

  async getUsers(): Promise<IUser[]> {
    return await this.userModel.find({}, { password: 0 }).exec();
  }

  async getUserById(userID: string): Promise<IUser> {
    const userById = await this.userModel
      .findById(userID, { password: 0 })
      .exec();
    if (!userById) {
      throw new NotFoundException('user not found');
    }
    return userById;
  }

  async createUser(userDto: CreateUserDto): Promise<IUser> {
    const newUser = new this.userModel(userDto);
    return await newUser.save();
  }

  async updateUserByProperty(
    userID: string,
    property: UpdateUserDto,
  ): Promise<IUser> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userID, property, { new: true })
      .select(['-password'])
      .exec();
    if (!updatedUser) {
      throw new NotFoundException('user not found');
    }
    return updatedUser;
  }
  async updateRoleByUserId(
    userID: string,
    property: ChangeUserRoleDto,
  ): Promise<IUser> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userID, property, { new: true })
      .select(['-password'])
      .exec();
    if (!updatedUser) {
      throw new NotFoundException('user not found');
    }
    return updatedUser;
  }

  async updateStatusByUserId(
    userID: string,
    property: ChangeUserStatusDto,
  ): Promise<IUser> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userID, property, { new: true })
      .select(['-password'])
      .exec();
    if (!updatedUser) {
      throw new NotFoundException('user not found');
    }
    return updatedUser;
  }

  async removeUserById(id: string): Promise<IUser> {
    const deletedUser = await this.userModel
      .findByIdAndDelete(id)
      .select(['-password'])
      .exec();
    if (!deletedUser) {
      throw new NotFoundException('user not found');
    }
    return deletedUser;
  }
}
