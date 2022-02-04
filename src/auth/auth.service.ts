import * as bcrypt from 'bcrypt';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { IUser } from '../user/dto/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import { ActionEnum } from '../log/constants/action-enum';
import { AuthType } from './schemas/auth-schema';
import { IAuth } from './dto/auth.interface';
import { LogService } from '../log/log.service';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../../mail/mail.service';
import { UserService } from '../user/user.service';
import { UserStatusEnum } from '../user/constants/user-status-enum';
import { generateRandomPassword } from './helpers/generate-random-password';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private logService: LogService,
    private mailService: MailService,
    private userService: UserService,
    @InjectModel('auth') private authModel: Model<AuthType>,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<object> {
    await this.userService.findUserByEmail({
      email: createUserDto.email,
    });

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });

    const confirmToken = await this.createConfirmToken(newUser);

    await this.userService.updateUserByParam(newUser._id, {
      token: confirmToken,
    });

    await this.mailService.sendUserConfirm(newUser, confirmToken);

    await this.logService.createLog({
      event: ActionEnum.USER_REGISTER,
      userId: newUser._id,
    });

    return {
      message:
        'To confirm registration information has been sent to your e-mail',
    };
  }

  async createConfirmToken(user: IUser): Promise<string> {
    return this.jwtService.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      {
        secret: this.configService.get('JWT_CONFIRM_EMAIL_SECRET'),
        expiresIn: this.configService.get('JWT_CONFIRM_EMAIL_LIFETIME'),
      },
    );
  }

  async confirmUser(confirmToken: string): Promise<object> {
    try {
      const payload = await this.jwtService.verify(confirmToken, {
        secret: this.configService.get('JWT_CONFIRM_EMAIL_SECRET'),
      });

      await this.userService.findUserByParam({
        token: confirmToken,
      });

      const confirmedUser = await this.userService.updateUserByParam(
        payload['id'],
        {
          status: UserStatusEnum.CONFIRMED,
          token: null,
        },
      );

      await this.logService.createLog({
        event: ActionEnum.USER_CONFIRMED,
        userId: confirmedUser._id,
      });

      return { message: 'Registration successfully confirmed. Please login' };
    } catch (e) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async loginUser(loginDto: LoginDto): Promise<Partial<IAuth>> {
    const userLogin = await this.userService.findUserLoginByEmail({
      email: loginDto.email,
    });

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      userLogin.password,
    );

    if (userLogin.status !== UserStatusEnum.CONFIRMED || !isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokensPair = await this.createTokensPair(userLogin);

    const newAuthModel = await new this.authModel({
      access_token: tokensPair.access_token,
      refresh_token: tokensPair.refresh_token,
      userID: userLogin._id,
    });

    await newAuthModel.save();

    await this.logService.createLog({
      event: ActionEnum.USER_LOGIN,
      userId: userLogin._id,
    });

    return tokensPair;
  }

  async checkIsValidAuth(userID: string, token: string): Promise<IAuth> {
    const authByUserId = await this.authModel
      .findOne({ userID: userID })
      .exec();
    if (!authByUserId) {
      throw new ForbiddenException('missing valid token');
    }

    const isExistValidToken =
      authByUserId.access_token === token ||
      authByUserId.refresh_token === token;

    if (!isExistValidToken) {
      throw new ForbiddenException('missing valid token');
    }

    return authByUserId;
  }

  async logoutUser(authId: string): Promise<any> {
    const deletedAuth = this.authModel.deleteOne({ userID: authId });
    if (!deletedAuth) {
      throw new NotFoundException('user for delete not found');
    }

    await this.logService.createLog({
      event: ActionEnum.USER_LOGOUT,
      userId: authId,
    });

    return deletedAuth;
  }

  async forgotPassword(token: string): Promise<object> {
    const payload = await this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });

    const userForgot = await this.userService.getUserById(payload.id);

    const forgotToken = this.jwtService.sign(
      {
        email: userForgot.email,
        id: userForgot._id,
        role: userForgot.role,
      },
      {
        secret: this.configService.get('JWT_FORGOT_PASSWORD_EMAIL_SECRET'),
        expiresIn: this.configService.get('JWT_FORGOT_PASSWORD_EMAIL_LIFETIME'),
      },
    );

    await this.logService.createLog({
      event: ActionEnum.USER_FORGOT_PASSWORD,
      userId: userForgot._id,
    });

    return {
      link: `http://localhost:3000/auth/reset/${forgotToken}`,
    };
  }

  async resetPassword(token: string): Promise<object> {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_FORGOT_PASSWORD_EMAIL_SECRET'),
    });

    const changingPasswordUser = await this.userService.getUserById(payload.id);

    const newPassword = generateRandomPassword(6);
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await this.userService.updateUserByParam(
      changingPasswordUser._id,
      { token: null, password: newHashedPassword },
    );

    await this.authModel.deleteOne({ userID: updatedUser._id });

    await this.mailService.sendTemporaryPassword(updatedUser, newPassword);

    await this.logService.createLog({
      event: ActionEnum.USER_RESET_PASSWORD,
      userId: updatedUser._id,
    });

    return {
      message: 'Information with a new passport has been sent to your mail',
    };
  }

  async checkIsValidUser(id: string): Promise<IUser> {
    const validUser = await this.userService.getUserById(id);

    if (!validUser) {
      throw new ForbiddenException('User not found');
    }

    if (validUser && validUser.status === 'blocked') {
      throw new ForbiddenException(
        'Your account is blocked. Information by phone +380661111111',
      );
    }
    return validUser;
  }

  async refreshUserTokens(authId: string): Promise<any> {
    const refreshUser = await this.userService.getUserById(authId);

    const tokensPair = (await this.createTokensPair(
      refreshUser,
    )) as Partial<IAuth>;

    await this.authModel.deleteOne({ userID: refreshUser });

    const newAuthModel = await new this.authModel({
      access_token: tokensPair.access_token,
      refresh_token: tokensPair.refresh_token,
      userID: refreshUser._id,
    });

    await newAuthModel.save();

    await this.logService.createLog({
      event: ActionEnum.USER_REFRESH_TOKEN,
      userId: authId,
    });

    return tokensPair;
  }

  async createTokensPair(user: IUser): Promise<Partial<IAuth>> {
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_SECRET_LIFETIME'),
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_SECRET_LIFETIME'),
    });
    return { access_token, refresh_token };
  }
}
