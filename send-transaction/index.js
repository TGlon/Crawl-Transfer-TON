import { TonClient, WalletContractV4, internal, WalletContractV3R2, toNano, SendMode, Address, JettonWallet, Cell, beginCell, storeMessage } from "@ton/ton";
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";
export const getTonSendMode = (max) => {
  return max === "1"
    ? SendMode.CARRY_ALL_REMAINING_BALANCE
    : SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS;
};
const client = new TonClient({
  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC?api_key=12ef1fc91b0d4ee237475fed09efc66af909d83f72376c7c3c42bc9170847ecb',
});
const seeIfBounceable = (address) => {
  return Address.isFriendly(address)
    ? Address.parseFriendly(address).isBounceable
    : false;
};

let mnemonics =
  "birth gather mechanic crouch female cake warrior year satisfy midnight foam chef ahead bus wasp where valve fly artist heavy smart pause brave mail".split(" ");
let keyPair = await mnemonicToPrivateKey(mnemonics);
let workchain = 0; // Usually you need a workchain 0
let wallet = WalletContractV4.create({
  workchain,
  publicKey: keyPair.publicKey,
});
let contract = client.open(wallet);
const data_wallet = await client.getContractState(wallet.address);
let seqno = await contract.getSeqno();
console.log("🚀 ~ seqno:", seqno);
const internal_msg = internal({
  to: "0QDbZGC8mtKpwnhQhUYdxLsGPU7eMntFNArvc4Ndq-E4PiuK",
  bounce: seeIfBounceable("0QDbZGC8mtKpwnhQhUYdxLsGPU7eMntFNArvc4Ndq-E4PiuK"),
  value: toNano(0.22),
  init: undefined,
  // body: "hello",
});
console.log("internal_msg", internal_msg.body.hash().toString("hex"));
console.log(internal_msg.info.value);
const transfer = contract.createTransfer({
  seqno,
  secretKey: keyPair.secretKey,
  sendMode: getTonSendMode("0"),
  messages: [internal_msg],
});
contract.send(transfer);
import pkg from 'pg';
const { Client } = pkg;

// Kết nối đến cơ sở dữ liệu PostgreSQL
const clientPG = new Client({
  user: "postgres",
  password: "KvdLgdtVL8",
  host: "localhost",
  port: 5432,
  database: "Directus_CAT",
});
await clientPG.connect();

// Sau khi gửi giao dịch thành công và có thông tin cần lưu
const transactionInfo = {
  value: internal_msg.info.value.toString(), // Chuyển đổi giá trị thành chuỗi
  // toAddress: internal_msg.info.to // Địa chỉ đích của giao dịch
};
console.log(internal_msg.info);
const query = 'INSERT INTO transfer (value) VALUES ($1)';
const values = [transactionInfo.value];

try {
  const res = await clientPG.query(query, values);
  console.log('Transaction information added successfully:');
} catch (err) {
  console.error('Error adding transaction information:', err);
} finally {
  await clientPG.end();
}