import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateApplePurchaseDto } from './dto/create-apple-purchase.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApplePurchaseService {

  constructor(private readonly prisma:PrismaService){}

 async create(
  createApplePurchaseDto: CreateApplePurchaseDto,
  userId: string,
) {
  console.log(userId)
  const {
    productId,
    planId,
    transactionId,
    originalTransactionId,
    purchaseDate,
    expiresDate,
    revocationDate,
    signedTransactionInfo,
    signedRenewalInfo,
    recipt,
    status,
  } = createApplePurchaseDto;

  if (transactionId) {
    const existingPurchase = await this.prisma.applePurchase.findUnique({
      where: { transactionId },
    });

    if (existingPurchase) {
      throw new BadRequestException('Transaction ID already exists.Same transaction Not Allowed')
    }
  }

  // const resolvedStatus =
  //   status ??
  //   (revocationDate
  //     ? 'REVOKED'
  //     : expiresDate && new Date(expiresDate) < new Date()
  //     ? 'EXPIRED'
  //     : 'ACTIVE');

     const res = await this.prisma.$transaction(async (trx) => {
  const purchase = await trx.applePurchase.create({
    data: {
      userId,
      productId,
      planId,
      transactionId,
      originalTransactionId,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
      expiresDate: expiresDate ? new Date(expiresDate) : null,
      revocationDate: revocationDate ? new Date(revocationDate) : null,
      signedTransactionInfo,
      signedRenewalInfo,
      recipt,
      status
    },
  });

  await trx.credential.update({
    where: { id: userId },
    data: {
      isSubscribe: true,
      subscription: 'PREMIUM',
    },
  });

  return purchase;
});
  
}


  async findAll(userId:string) {
    const res=await this.prisma.applePurchase.findMany({
      where:{
        userId:userId
      }
    })
    return res
  }
}
