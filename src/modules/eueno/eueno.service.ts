import { appConfig } from '@app/core';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import * as Eueno from '@eueno/lib-node';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class EuenoService {
  private eueno: Eueno;
  constructor() {
    this.eueno = new Eueno({
      endpoint: 'https://v2-developers.eueno.io/',
    });
  }

  async uploadFile() {
    const file = fs.readFileSync('public/a.jpg');

    const walletPublicKey = await this.getWalletPublicKey();

    try {
      const data = await this.eueno.upload(
        file,
        {
          projectKey: appConfig.eueno.EUENO_PRIVATE_KEY,
          key: {
            walletPublicKey: walletPublicKey,
          },
        },
        {
          projectId: 129,
          filename: 'a.jpg',
          contentLength: 12313,
          contentType: 'image/jpg',
          method: 'ENCRYPT',
          keepPath: false,
        },
      );

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async getWalletPublicKey() {
    const mnemonic =
      'involve problem use squirrel hidden circle fatigue finish forum scorpion fork galaxy differ long sail have tongue world staff omit false bird plunge unlock';
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);

    const [firstAccount] = await wallet.getAccounts();

    return firstAccount.pubkey;
  }
}
