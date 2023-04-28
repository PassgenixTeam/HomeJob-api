import { Injectable } from '@nestjs/common';
import { PaymentMethodDto } from './dto/payment-method.dto';
import { StripeService } from '@app/payment';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethodEntity } from './entities/payment-method.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { RedisService } from '@app/core';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethodEntity)
    private readonly paymentMethodRepository: Repository<PaymentMethodEntity>,
    private readonly stripeService: StripeService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private redisService: RedisService,
  ) {}

  // token tok_1Mu9yUIyhrdGYDsW2m1fm77X
  async create(input: PaymentMethodDto, user: UserEntity) {
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      stripeCustomerId = await this.createCustomer(user);
    } else {
      const stripeCustomer = await this.stripeService.getCustomer(
        stripeCustomerId,
      );
      if (!stripeCustomer) {
        stripeCustomerId = await this.createCustomer(user);
      } else {
        stripeCustomerId = stripeCustomer.id;
      }
    }

    const stripePaymentMethod = await this.stripeService.createPaymentMethod({
      customerId: stripeCustomerId,
      token: input.token,
    });

    if (input.isDefault) {
      await Promise.all([
        this.stripeService.defaultPaymentMethodToCustomer({
          customerId: stripeCustomerId,
          paymentMethodId: stripePaymentMethod.id,
        }),
        this.paymentMethodRepository.update(
          {
            user: {
              id: user.id,
            },
          },
          {
            isDefault: false,
          },
        ),
      ]);
    }

    return this.paymentMethodRepository.save({
      last4: stripePaymentMethod.card.last4,
      paymentMethodId: stripePaymentMethod.id,
      brand: stripePaymentMethod.card.brand,
      isDefault: input.isDefault,
      user: {
        id: user.id,
      },
    });
  }

  findAll(userId: string) {
    return this.paymentMethodRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentMethod`;
  }

  async setDefault(id: string, userId: string) {
    await this.paymentMethodRepository.update(
      {
        user: {
          id: userId,
        },
      },
      {
        isDefault: false,
      },
    );

    await this.paymentMethodRepository.update(
      {
        id,
        user: {
          id: userId,
        },
      },
      {
        isDefault: true,
      },
    );

    return 'Payment method set as default.';
  }

  async remove(id: string, userId: string) {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });

    if (!paymentMethod) {
      throw new Error('Payment method not found.');
    }

    await Promise.all([
      this.paymentMethodRepository.delete({
        id,
        user: {
          id: userId,
        },
      }),
      this.stripeService.removePaymentMethod(paymentMethod.paymentMethodId),
    ]);

    return 'Payment method removed.';
  }

  private async createCustomer(user: UserEntity) {
    const stripeCustomer = await this.stripeService.createCustomer({
      email: user.email,
      address: user.address,
      city: user.city,
      country: user.country,
      line1: user.line1,
      line2: user.line2,
      name: `${user.firstName} ${user.lastName}`,
      phone: user.phone,
      state: user.state,
    });

    await this.userRepository.update(user.id, {
      stripeCustomerId: stripeCustomer.id,
    });

    await this.redisService.del(user.cacheId);

    return stripeCustomer.id;
  }
}
