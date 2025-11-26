import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as admin from 'firebase-admin';
import { FirebaseAdmin } from './firebase/admin.provider';



interface BroadcastPayload {
  title: string;
  body: string;

}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(FirebaseAdmin) private readonly firebaseApp: admin.app.App,
  ) {}

  async broadcastToAll(payload: BroadcastPayload) {
    const credentials = await this.prisma.credential.findMany({
      select: { fcmToken: true },
      where: { fcmToken: { not: null }}
    });

    if (!credentials.length) {
      this.logger.warn('No device tokens found in DB');
      return { message: 'No tokens available' };
    }

    const tokenList = credentials.map((c) => c.fcmToken!);

    const resp = await this.firebaseApp.messaging().sendEachForMulticast({
      tokens: tokenList,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: {
        // deepLink: payload.deepLink ?? '',
        // contentType: payload.contentType,
        // contentId: payload.contentId ?? '',
      },
      android: { priority: 'high' },
      apns: { payload: { aps: { sound: 'default', contentAvailable: true } } },
    });

    this.logger.log(
      `Broadcast complete: success=${resp.successCount}, fail=${resp.failureCount}`,
    );

    const invalidTokens = resp.responses
      .map((r, i) =>
        !r.success &&
        ['messaging/invalid-argument', 'messaging/registration-token-not-registered'].includes(
          (r.error as any)?.errorInfo?.code,
        )
          ? tokenList[i]
          : null,
      )
      .filter((t): t is string => !!t);

    if (invalidTokens.length) {
      await this.prisma.credential.updateMany({
        where: { fcmToken: { in: invalidTokens } },
        data: { fcmToken: null },
      });
      this.logger.warn(`Removed ${invalidTokens.length} invalid tokens`);
    }

    return { message: 'Broadcast sent' };
  }

async sendToUser(payload: BroadcastPayload, userId: string) {
  const credentials = await this.prisma.credential.findUnique({
    where: { id: userId },
    select: { fcmToken: true },
  });

  if (!credentials?.fcmToken) return;

  await this.firebaseApp.messaging().sendEachForMulticast({
    tokens: [credentials.fcmToken],
    notification: {
      title: payload.title,
      body: payload.body,
    },
  });
}


}