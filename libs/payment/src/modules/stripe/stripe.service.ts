import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { appConfig } from '@app/core';
import {
  AddPaymentMethodDto,
  CreatePaymentIntentDto,
  CreatePaymentMethodsDto,
} from './dto';
import { CreateCustomerPaymentDto } from './dto/create-customer-payment.dto';
import { CapturePaymentIntentDto } from './dto/capture-payment-intent.dto';
import { ConfirmPaymentIntentDto } from './dto/confirm-payment-intent.dto';
import { CreateAccountBankDto } from './dto/create-account-bank.dto';
import { TransferMoneyDto } from './dto/transfer-money.dto';
@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(appConfig.payment.stripe.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  // async createCheckoutSession(id: string) {
  //   const session = await this.stripe.checkout.sessions.create({
  //     payment_method_types: ['card'],
  //     line_items: [
  //       {
  //         price_data: {
  //           currency: 'usd',
  //           product_data: {
  //             name: '30 days package',
  //             images: ['https://i.imgur.com/EHyR2nP.png'],
  //             description: '30 days package',
  //           },
  //           unit_amount: 2000,
  //         },
  //         quantity: 1,
  //       },
  //     ],
  //     mode: 'payment',
  //     success_url:
  //       'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
  //     cancel_url: 'https://example.com/cancel',
  //   });

  //   return session.url;
  // }

  async getPublishableKey() {
    return {
      publishableKey: appConfig.payment.stripe.STRIPE_PUBLISHABLE_KEY,
    };
  }

  async createAccountBank(input: CreateAccountBankDto) {
    const {
      country,
      currency,
      object,
      accountHolderName,
      accountHolderType,
      routingNumber,
      accountNumber,
      type,
      email,
    } = input;
    const account = await this.stripe.accounts.create({
      type: type as any,
      country: country,
      email: email,
      business_type: 'individual',
      business_profile: {
        mcc: '5734',
        product_description: 'test',
      },
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: '13.112.224.240',
      },
      external_account: {
        object: object,
        country: country,
        currency: currency,
        account_holder_name: accountHolderName,
        account_holder_type: accountHolderType,
        routing_number: routingNumber,
        account_number: accountNumber,
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      individual: {
        dob: {
          day: 3,
          month: 11,
          year: 2000,
        },
        email: email,
        address: {
          country: 'US',
          city: 'New York',
          line1: '128 Frontage Rd, Newark, NJ 07114, Hoa Kỳ',
          postal_code: '10001',
          state: 'NY',
        },
        first_name: 'Uptimum',
        last_name: 'win',
        phone: '2028610737',
        ssn_last_4: '0000',
      },
    });

    return account;
  }

  async transferMoney(input: TransferMoneyDto) {
    const { accountId, amount, currency } = input;
    const transfer = await this.stripe.transfers.create({
      amount: amount,
      currency: currency,
      destination: accountId,
    });

    console.log(transfer);

    return transfer;
  }

  async getCustomerPaymentMethods(customerId: string) {
    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return paymentMethods.data;
  }

  async createPaymentIntent(input: CreatePaymentIntentDto) {
    try {
      const {
        amount,
        currency,
        customerId,
        paymentMethodId,
        description,
        metadata,
      } = input;

      const paymentIntent = await this.stripe.paymentIntents.create({
        receipt_email: 'uptimumdn2000@gmail.com',
        customer: customerId,
        payment_method: paymentMethodId,
        amount: amount,
        currency: currency,
        capture_method: 'manual',
        metadata,
        description: description,
      });

      return {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      throw error;
    }
  }

  async createCustomer(input: CreateCustomerPaymentDto) {
    try {
      const { email, name, city, country, state, line1, line2, phone } = input;
      const customer = await this.stripe.customers.create({
        email,
        name,
        address: {
          city,
          country,
          line1,
          line2,
          state,
        },
        phone,
      });

      return customer;
    } catch (error) {
      throw error;
    }
  }

  async createPaymentMethod(
    input: CreatePaymentMethodsDto,
  ): Promise<Stripe.PaymentMethod> {
    const { token, customerId } = input;
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        token,
      },
    });

    if (customerId) {
      await this.stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customerId,
      });
    }

    return paymentMethod;
  }

  async defaultPaymentMethodToCustomer(
    input: AddPaymentMethodDto,
  ): Promise<Stripe.Customer> {
    const { customerId, paymentMethodId } = input;
    const customer = await this.stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return customer;
  }

  async getCustomer(customerId: string) {
    const customer = await this.stripe.customers.retrieve(customerId);
    return customer;
  }

  async getPaymentMethods(paymentMethodId: string) {
    const paymentMethod = await this.stripe.paymentMethods.retrieve(
      paymentMethodId,
    );

    return paymentMethod;
  }

  async capturePaymentIntent(input: CapturePaymentIntentDto) {
    const { paymentIntentId, amount } = input;
    const paymentIntent = await this.stripe.paymentIntents.capture(
      paymentIntentId,
      {
        amount_to_capture: amount,
      },
    );

    return paymentIntent;
  }

  async getPaymentIntent(paymentIntentId: string) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      paymentIntentId,
    );

    return paymentIntent;
  }

  async confirmPaymentIntent(input: ConfirmPaymentIntentDto) {
    const { paymentIntentId } = input;
    const paymentIntent = await this.stripe.paymentIntents.confirm(
      paymentIntentId,
      // {
      //   payment_method_data: {
      // more data
      //   }
      // }
    );

    if (paymentIntent.status === 'requires_capture') {
      const capture = await this.stripe.paymentIntents.capture(
        paymentIntent.id,
      );

      return capture;
    }

    return paymentIntent;
  }

  async refundPaymentIntent(paymentIntentId: string, amount: number) {
    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount,
    });

    return refund;
  }

  async webhook(payload: any, sig: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        sig,
        appConfig.payment.stripe.STRIPE_WEBHOOK_SECRET,
      );

      // Handle the event
      switch (event.type) {
        case 'payment_intent.amount_capturable_updated':
          const paymentIntentAmountCapturableUpdated = event.data.object;
          console.log(
            'paymentIntentAmountCapturableUpdated',
            paymentIntentAmountCapturableUpdated,
          );

          // Then define and call a function to handle the event payment_intent.amount_capturable_updated
          break;
        case 'payment_intent.canceled':
          const paymentIntentCanceled = event.data.object;
          console.log('paymentIntentCanceled', paymentIntentCanceled);
          // Then define and call a function to handle the event payment_intent.canceled
          break;
        case 'payment_intent.created':
          const paymentIntentCreated = event.data.object;
          console.log('paymentIntentCreated', paymentIntentCreated);
          // Then define and call a function to handle the event payment_intent.created
          break;
        case 'payment_intent.partially_funded':
          const paymentIntentPartiallyFunded = event.data.object;
          console.log(
            'paymentIntentPartiallyFunded',
            paymentIntentPartiallyFunded,
          );
          // Then define and call a function to handle the event payment_intent.partially_funded
          break;
        case 'payment_intent.payment_failed':
          const paymentIntentPaymentFailed = event.data.object;
          console.log('paymentIntentPaymentFailed', paymentIntentPaymentFailed);
          // Then define and call a function to handle the event payment_intent.payment_failed
          break;
        case 'payment_intent.processing':
          const paymentIntentProcessing = event.data.object;
          console.log('paymentIntentProcessing', paymentIntentProcessing);
          // Then define and call a function to handle the event payment_intent.processing
          break;
        case 'payment_intent.requires_action':
          const paymentIntentRequiresAction = event.data.object;
          console.log(
            'paymentIntentRequiresAction',
            paymentIntentRequiresAction,
          );
          // Then define and call a function to handle the event payment_intent.requires_action
          break;
        case 'payment_intent.succeeded':
          const paymentIntentSucceeded = event.data.object;
          console.log('paymentIntentSucceeded', paymentIntentSucceeded);
          // Then define and call a function to handle the event payment_intent.succeeded
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (err) {
      throw err;
    }
  }

  async removePaymentMethod(paymentMethodId: string) {
    const paymentMethod = await this.stripe.paymentMethods.detach(
      paymentMethodId,
    );

    return paymentMethod;
  }
}
