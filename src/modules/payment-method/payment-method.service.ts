import { Injectable } from '@nestjs/common';
import { PaymentMethodDto } from './dto/payment-method.dto';
import { StripeService } from '@app/payment';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethodEntity } from './entities/payment-method.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { RedisService } from '@app/core';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethodEntity)
    private readonly paymentMethodRepository: Repository<PaymentMethodEntity>,
    private readonly stripeService: StripeService,
    private readonly userService: UserService,
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
      }
    }

    const stripePaymentMethod = await this.stripeService.createPaymentMethod({
      customerId: stripeCustomerId,
      token: input.token,
    });

    const paymentMethod = new PaymentMethodEntity();
    paymentMethod.paymentMethodId = stripePaymentMethod.id;
    paymentMethod.user.id = user.id;
    paymentMethod.brand = stripePaymentMethod.card.brand;
    paymentMethod.last4 = stripePaymentMethod.card.last4;
    paymentMethod.isDefault = input.isDefault;

    return this.paymentMethodRepository.save(paymentMethod);
  }

  findAll() {
    return `This action returns all paymentMethod`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentMethod`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentMethod`;
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

    await this.userService.update(user.id, {
      stripeCustomerId: stripeCustomer.id,
    });

    await this.redisService.del(user.cacheId);

    return stripeCustomer.id;
  }
}
