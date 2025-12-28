import { Injectable, NotFoundException } from '@nestjs/common';
import { OTPType, SessionType, User } from '@prisma/client';
import { RolesKeys } from 'src/_modules/authorization/providers/roles';
import { HelperService } from 'src/_modules/user/services/helper.service';
import { UserService } from 'src/_modules/user/services/user.service';
import { hashPassword } from 'src/globals/helpers/password.helpers';
import { PrismaService } from 'src/globals/services/prisma.service';
import { ForgetPasswordDTO } from '../dto/forgot-password.dto';
import { BioLoginDTO, EmailPasswordLoginDTO } from '../dto/login.dto';
import { ResetPasswordDTO } from '../dto/reset-password.dto';
import { VerifyOtpDTO } from '../dto/verify-otp.dto';
import { TokenService } from './jwt.service';
import { OTPService } from './otp.service';

@Injectable()
export class BaseAuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly userHelper: HelperService,
    private readonly userService: UserService,
    private readonly otpService: OTPService,
  ) {}

  async login(
    ip: string,
    dto: EmailPasswordLoginDTO,
  ): Promise<{
    user: User;
    AccessToken: string;
    RefreshToken: string;
    unReadNotifications: number;
  }> {
    const isLocaleFound = await this.prisma.language.findUnique({
      where: {
        key: dto.locale,
      },
    });
    if (!isLocaleFound) {
      throw new NotFoundException('Locale not found');
    }
    const user = await this.userHelper.userExist({
      message: 'invalid credentials',
      ...dto,
    });
    await this.userHelper.userCanLogin(user, true, ip);
    const data = await this.userService.getProfile(user.id);
    const AccessToken = await this.tokenService.generateToken(
      user.id,
      ip,
      undefined,
      SessionType.ACCESS,
    );
    const RefreshToken = await this.tokenService.generateToken(
      user.id,
      ip,
      undefined,
      SessionType.REFRESH,
    );
    return {
      user: data.user,
      unReadNotifications: data.unReadNotifications,
      AccessToken,
      RefreshToken,
    };
  }

  async getBioInfo(dto: BioLoginDTO) {
    const { deviceId } = dto;
    const user = await this.prisma.user.findUnique({
      where: {
        deviceId,
      },
      select: {
        roleKey: true,
        email: true,
      },
    });
    return user;
  }

  async validateDto(dto: EmailPasswordLoginDTO) {
    const { phone, email } = dto;
    if (!phone && !email) {
      throw new NotFoundException('Phone or Email is required');
    }
    if (!phone) {
      throw new NotFoundException('Phone is required for customer login');
    }
  }

  async forgetPassword(ip: string, forgotPasswordDTO: ForgetPasswordDTO) {
    const { phone } = forgotPasswordDTO;
    const user = await this.userHelper.userExist({ phone });

    await this.userHelper.userCanLogin(user);
    await this.otpService.generateOTP(user.id, OTPType.PASSWORD_RESET);

    const token = await this.tokenService.generateToken(
      user.id,
      ip,
      undefined,
      SessionType.VERIFY,
    );

    return { user, token };
  }

  async resetPassword(userId: Id, dto: ResetPasswordDTO) {
    const hashedPassword = await hashPassword(dto.password);
    await this.prisma.user.update({
      data: { password: hashedPassword },
      where: { id: userId },
    });
  }

  async resendOtp(ip: string, userId: Id) {
    await this.otpService.generateOTP(userId, OTPType.EMAIL_VERIFICATION);
    const token = await this.tokenService.generateToken(
      userId,
      ip,
      undefined,
      SessionType.VERIFY,
    );
    return token;
  }

  async verify(ip: string, userId: Id, dto: VerifyOtpDTO) {
    const user = await this.userHelper.userExist({
      id: userId,
      checkVerified: false,
    });
    await this.otpService.verifyOTP(
      userId,
      dto.otp,
      OTPType.EMAIL_VERIFICATION,
    );
    await this.prisma.user.update({
      where: { id: userId },
      data: { verified: true },
    });
    const data = await this.userService.getProfile(userId);
    const AccessToken = await this.tokenService.generateToken(
      user.id,
      ip,
      undefined,
      SessionType.ACCESS,
    );
    const RefreshToken = await this.tokenService.generateToken(
      user.id,
      ip,
      undefined,
      SessionType.REFRESH,
    );
    return {
      user: data.user,
      unReadNotifications: data.unReadNotifications,
      AccessToken,
      RefreshToken,
    };
  }

  async verifyReset(userId: Id, dto: VerifyOtpDTO,ip: string) { 
    const user = await this.userHelper.userExist({ id: userId });
    await this.otpService.verifyOTP(userId, dto.otp, OTPType.PASSWORD_RESET);
    const token = await this.tokenService.generateToken(
      userId,
      ip,
      undefined,
      SessionType.PASSWORD_RESET,
    );
    return { user, token };
  }

  async logout(jti: string) {
    await this.prisma.session.delete({ where: { jti } });
  }

  async refreshToken(ip: string, userId: Id) {
    const data = await this.userService.getProfile(userId);
    const AccessToken = await this.tokenService.generateToken(
      userId,
      ip,
      undefined,
    );
    return { user: data, AccessToken };
  }
 
}
