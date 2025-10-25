import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'src/utils/authorization/role.enum';



@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(SeederService.name);

  async onApplicationBootstrap() {
    await this.seedAdmin();
  }

 private async seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASS;
  const admin_phone = process.env.ADMIN_PHONE;
  const saltRounds = Number(process.env.SALT) || 10;

  if (!adminEmail || !adminPassword) {
    this.logger.error("Missing admin credentials in environment variables!");
    return;
  }

  const supperAdmin = await this.prisma.credential.findFirst({
    where: { role: Role.Admin },
  });

  if (supperAdmin) {
    this.logger.log('Admin already exists, skipping seeding...');
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

  await this.prisma.credential.create({
    data: {
      phone: admin_phone,
      email: adminEmail,
      password: hashedPassword,
      role: Role.Admin,
      name: "admin",
    },
  });

  this.logger.log(`✅ Default super admin created: ${adminEmail}`);
}

}