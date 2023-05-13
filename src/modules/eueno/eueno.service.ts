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
    console.log(
      {
        projectKey: appConfig.eueno.EUENO_PRIVATE_KEY,
        key: {
          walletPublicKey: walletPublicKey,
          fileEncryptionKey: this.eueno,
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

    try {
      // const key = await CryptoJS..generateKey(
      //   "aes", {
      //     length: 256,
      //   }
      // );
      // const readKey = await Crypto.exportKey('jwk', key);

      // console.log(readKey);

      const data = await this.eueno.upload(
        file,
        {
          projectKey: appConfig.eueno.EUENO_PRIVATE_KEY,
          // key: {
          //   walletPublicKey: walletPublicKey,
          //   fileEncryptionKey: '012u5pp13aPxBqfBdUvpueu9d-7DrjQ_HkLh1fsluFs',
          // },
        },
        {
          projectId: 129,
          filename: 'a.jpg',
          contentLength: 12313,
          contentType: 'image/jpg',
          method: 'UNENCRYPTED',
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
