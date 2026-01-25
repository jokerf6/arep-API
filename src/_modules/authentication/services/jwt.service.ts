import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SessionType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { jwtConfig } from 'src/configs/jwt.config';
import { PrismaService } from 'src/globals/services/prisma.service';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private getTokenSecret(type: SessionType): string {
    const tokenSecrets = {
      [SessionType.ACCESS]: this.configService.get<string>(
        'ACCESS_TOKEN_SECRET',
      ),
      [SessionType.REFRESH]: this.configService.get<string>(
        'REFRESH_TOKEN_SECRET',
      ),
      [SessionType.VERIFY]: this.configService.get<string>(
        'VERIFY_TOKEN_SECRET',
      ),
      [SessionType.PASSWORD_RESET]: this.configService.get<string>(
        'RESET_PASSWORD_TOKEN_SECRET',
      ),
    };
    return tokenSecrets[type];
  }

  async generateToken(
    userId: Id,
    ipAddress?: string,
    fcmToken?: string,
    type: SessionType = SessionType.ACCESS,
    locale: string = 'en',
  ): Promise<string> {
    if (
      !([SessionType.ACCESS, SessionType.REFRESH] as SessionType[]).includes(
        type,
      )
    ) {
      await this.prisma.session.deleteMany({
        where: {
          userId,
          type,
        },
      });
    }

    const session = await this.prisma.session.create({
      data: {
        ipAddress,
        userId,
        fcmToken,
        type,
        languageId: locale,
      },
    });

    const secret = this.getTokenSecret(type);
    const config = this.getTokenConfig(type);

    const token = jwt.sign({ jti: session.jti, id: userId }, secret, config);

    return token;
  }

  private getTokenConfig(type: SessionType): jwt.SignOptions {
    const tokenSecrets = {
      [SessionType.ACCESS]: +this.configService.get<string>(
        'ACCESS_TOKEN_EXPIRE_TIME',
      ),
      [SessionType.REFRESH]: +this.configService.get<string>(
        'REFRESH_TOKEN_EXPIRE_TIME',
      ),
      [SessionType.VERIFY]: +this.configService.get<string>(
        'VERIFY_TOKEN_EXPIRE_TIME',
      ),
      [SessionType.PASSWORD_RESET]: +this.configService.get<string>(
        'VERIFY_TOKEN_EXPIRE_TIME',
      ),
    };
    return tokenSecrets[type];
  }

  async GenerateLessonToken(userId: Id, lessonId: Id, endDate: Date) {
    const payload = { userId, lessonId, endDate };
    const secret = process.env.LESSON_SECRET;

    const token = jwt.sign(payload, secret, {
      expiresIn: Math.floor((endDate.getTime() - Date.now()) / 1000),
    });

    return token;
  }
  async ValidateLessonToken(token: string) {
    const secret = process.env.LESSON_SECRET;
    const decoded = jwt.verify(token, secret);
    return decoded;
  }

  // Cron Cleanup Jobs

  @Cron(CronExpression.EVERY_10_HOURS)
  async cleanExpiredAccessTokens() {
    await this.deleteExpiredSessions(
      SessionType.ACCESS,
      'ACCESS_TOKEN_EXPIRE_TIME',
    );
  }

  @Cron(CronExpression.EVERY_10_HOURS)
  async cleanExpiredRefreshTokens() {
    await this.deleteExpiredSessions(
      SessionType.REFRESH,
      'REFRESH_TOKEN_EXPIRE_TIME',
    );
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async cleanExpiredTemporaryTokens() {
    await this.deleteExpiredSessions(
      [SessionType.PASSWORD_RESET, SessionType.VERIFY],
      'FORGET_PASSWORD_TOKEN_EXPIRE_TIME',
    );
  }

  // Reusable session cleaner
  private async deleteExpiredSessions(
    types: SessionType | SessionType[],
    expiryEnvKey: string,
  ) {
    const expirationMs = +this.configService.get<string>(expiryEnvKey);
    const expirationDate = new Date(Date.now() - expirationMs);

    const deleted = await this.prisma.session.deleteMany({
      where: {
        type: Array.isArray(types) ? { in: types } : types,
        createdAt: { lte: expirationDate },
      },
    });

    this.logger.log(
      `Deleted ${deleted.count} expired session(s) for type(s): ${Array.isArray(types) ? types.join(', ') : types}`,
    );
  }
}
