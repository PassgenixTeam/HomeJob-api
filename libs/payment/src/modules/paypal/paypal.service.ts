import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as querystring from 'querystring';
import { appConfig } from '@app/core';
import { CreatePayoutDto } from './dto/create-payout.dto';
import { v4 as uuidV4 } from 'uuid';
import { randomNumber } from '@app/common';

@Injectable()
export class PaypalService {
  private baseURL = appConfig.payment.paypal.PAYPAL_URL;
  private clientId = appConfig.payment.paypal.PAYPAL_CLIENT_ID;
  private clientSecret = appConfig.payment.paypal.PAYPAL_CLIENT_SECRET;

  constructor(private readonly httpService: HttpService) {}

  async getClientId() {
    return {
      clientId: this.clientId,
    };
  }

  private async getAccessToken() {
    const { data } = await this.httpService.axiosRef({
      method: 'post',
      url: `${this.baseURL}/v1/oauth2/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: this.clientId,
        password: this.clientSecret,
      },
      data: querystring.stringify({ grant_type: 'client_credentials' }),
    });

    return data.access_token;
  }

  async createOrder(amount: number) {
    const accessToken = await this.getAccessToken();
    console.log(accessToken);

    const { data } = await this.httpService.axiosRef({
      method: 'post',
      url: `${this.baseURL}/v2/checkout/orders`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: amount,
            },
          },
        ],
      },
    });
    return {
      id: data.id,
    };
  }

  async captureOrder(orderId: string) {
    const accessToken = await this.getAccessToken();
    const { data } = await this.httpService.axiosRef({
      method: 'post',
      url: `${this.baseURL}/v2/checkout/orders/${orderId}/capture`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(data);

    return data;
  }

  async getOrder(orderId: string) {
    const accessToken = await this.getAccessToken();
    const { data } = await this.httpService.axiosRef({
      method: 'get',
      url: `${this.baseURL}/v2/checkout/orders/${orderId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return data;
  }

  async createPayout(input: CreatePayoutDto) {
    const accessToken = await this.getAccessToken();
    const requestBody = {
      sender_batch_header: {
        sender_batch_id: uuidV4(),
        email_subject: 'You have a Payout!',
      },
      items: [
        {
          recipient_type: 'EMAIL',
          amount: {
            value: 100,
            currency: 'usd',
          },
          note: 'Thanks for your patronage!',
          sender_item_id: randomNumber(),
          receiver: 'sb-pwsmu25355343@personal.example.com',
        },
      ],
    };

    const { data } = await this.httpService.axiosRef({
      method: 'post',
      url: `${this.baseURL}/v1/payments/payouts`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: requestBody,
    });

    return data;
  }

  async getPayout(payoutId: string) {
    const accessToken = await this.getAccessToken();
    const { data } = await this.httpService.axiosRef({
      method: 'get',
      url: `${this.baseURL}/v1/payments/payouts/${payoutId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return data;
  }
}
