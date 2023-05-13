import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { SigningStargateClient, StargateClient } from '@cosmjs/stargate';
(async () => {
  const mnemonic =
    'involve problem use squirrel hidden circle fatigue finish forum scorpion fork galaxy differ long sail have tongue world staff omit false bird plunge unlock';
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);

  const [firstAccount] = await wallet.getAccounts();

  console.log(firstAccount.pubkey);

  // const rpcEndpoint = 'https://rpc.my_tendermint_rpc_node';
  // const client = await SigningStargateClient.connectWithSigner(
  //   rpcEndpoint,
  //   wallet,
  // );

  // console.log(client);

  // const recipient = 'cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5';
  // const amount = {
  //   denom: 'ucosm',
  //   amount: '1234567',
  // };
  // const result = await client.sendTokens(
  //   firstAccount.address,
  //   recipient,
  //   [amount],
  //   'Have fun with your star coins',
  // );
  // assertIsBroadcastTxSuccess(result);
})();
