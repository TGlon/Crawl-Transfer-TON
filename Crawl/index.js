const express = require("express");
const axios = require("axios");
const axiosRateLimit = require("axios-rate-limit");
const app = express();
const mongoose = require("mongoose");
const PORT = 3000;
const { Client } = require("pg");
const pgp = require("pg-promise")();
// // Kết nối với cơ sở dữ liệu MongoDB
// mongoose.connect("mongodb://127.0.0.1/crawl_transaction", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.once("open", function () {
//   console.log("Connected to MongoDB");
// });
const client = new Client({
  user: "postgres",
  password: "KvdLgdtVL8",
  host: "localhost",
  port: 5432,
  database: "Directus_CAT",
});
client.connect();
// const transactionSchema = new mongoose.Schema({
//   hash: {
//     type: String,
//   },
//   lt: {
//     type: Number,
//   },
//   account: {
//     address: {
//       type: String,
//     },
//     name: {
//       type: String,
//     },
//     is_scam: {
//       type: Boolean,
//     },
//     is_wallet: {
//       type: Boolean,
//     },
//   },
//   out_msgs: {
//     type: Array,
//     default: [],
//   },
//   in_msg: {
//     msg_type: {
//       type: String,
//     },
//     created_lt: {
//       type: Number,
//     },
//     ihr_disabled: {
//       type: Boolean,
//     },
//     bounce: {
//       type: Boolean,
//     },
//     bounced: {
//       type: Boolean,
//     },
//     value: {
//       type: Number,
//     },
//     fwd_fee: {
//       type: Number,
//     },
//     ihr_fee: {
//       type: Number,
//     },
//     import_fee: {
//       type: Number,
//     },
//     created_at: {
//       type: Number,
//     },
//   },
// });

// const Transaction = mongoose.model("Transaction", transactionSchema);
//get từ knative
// app.get("/", async (req, res) => {
//   try {
//     const dockerApiEndpoint = "http://127.0.0.1:8080";
//     const response = await axios.get(`${dockerApiEndpoint}`);

//     // Lấy dữ liệu từ phản hồi
//     const data = response.data;

//     // Trả về dữ liệu dưới dạng JSON
//     res.json(data);
//   } catch (error) {
//     // Bắt lỗi nếu có lỗi xảy ra khi gửi yêu cầu
//     console.error("Error fetching data:", error);
//     res.status(500).json({ error: "Error fetching data" });
//   }
// });
const http = axiosRateLimit(axios.create(), {
  maxRequests: 1,
  perMilliseconds: 3000,
});
// app.get("/", async (req, res) => {
//   let a = [];
//   const last_block = await axios.get(
//     "https://testnet.tonapi.io/v2/blockchain/masterchain-head"
//   );
//   const number = last_block.data.seqno;
//   console.log("Block Current", number);
//   let i = number;
//   for (i; i <= number + 10; i++) {
//     console.log("i nè", i);
//     const blockID = `(${last_block.data.workchain_id},${last_block.data.shard},${i})`;
//     const apiUrl = `https://testnet.tonapi.io/v2/blockchain/blocks/${blockID}/transactions`;
//     const response = await http.get(apiUrl);
//     const transactionData = response.data;
//     if (transactionData.transactions.length > 0) {
//       console.log(transactionData.transactions);
//       a.push(transactionData);
//     } else {
//       console.log("chưa có");
//       await new Promise((resolve) => setTimeout(resolve, 3000));
//       continue;
//     }
//   }
// async function saveTransactionsToDatabase(data) {
//   try {
//     // Duyệt qua mỗi phần tử của mảng a
//     for (const item of data) {
//       // Truy cập vào mảng transactions trong mỗi phần tử
//       for (const transaction of item.transactions) {
//         // Tạo một đối tượng transaction mới từ các thuộc tính của mỗi phần tử trong mảng transactions
//         const newTransaction = new Transaction({
//           hash: transaction.hash,
//           lt: transaction.lt,
//           account: transaction.account
//         });

//         // Lưu đối tượng transaction vào cơ sở dữ liệu MongoDB
//         await newTransaction.save();
//       }
//     }
//     console.log("Dữ liệu đã được lưu vào cơ sở dữ liệu thành công!");
//   } catch (error) {
//     console.error("Lỗi khi lưu dữ liệu vào cơ sở dữ liệu:", error);
//   }
// }


// async function saveTransactionsToDatabase(data) {
//   try {
//     // Duyệt qua mỗi phần tử của mảng a
//     for (const item of data) {
//       // Truy cập vào mảng transactions trong mỗi phần tử
//       for (const transaction of item.transactions) {
//         // Kiểm tra xem giao dịch đã tồn tại trong cơ sở dữ liệu chưa
//         const existingTransaction = await Transaction.findOne({
//           hash: transaction.hash,
//         });

//         // Nếu giao dịch không tồn tại trong cơ sở dữ liệu, thì mới lưu nó vào
//         if (!existingTransaction) {
//           // Tạo một đối tượng transaction mới từ các thuộc tính của mỗi phần tử trong mảng transactions
//           const newTransaction = new Transaction({
//             hash: transaction.hash,
//             lt: transaction.lt,
//             account: transaction.account,
//             in_msg: transaction.in_msg,
//             out_msgs: transaction.out_msgs,
//           });

//           // Lưu đối tượng transaction vào cơ sở dữ liệu MongoDB
//           await newTransaction.save();
//           // console.log(`Giao dịch mới đã được lưu: ${transaction.hash}`);
//         } else {
//           // console.log(`Giao dịch đã tồn tại trong cơ sở dữ liệu: ${transaction.hash}`);
//         }
//       }
//     }
//     console.log("Dữ liệu đã được lưu vào cơ sở dữ liệu thành công!");
//   } catch (error) {
//     console.error("Lỗi khi lưu dữ liệu vào cơ sở dữ liệu:", error);
//   }
// }
async function saveTransactionsToDatabase(data) {
  try {
    for (const item of data) {
      for (const transaction of item.transactions) {
        const existingTransaction = await client.query('SELECT * FROM transactions WHERE hash = $1', [transaction.hash]);
        if (existingTransaction.rows.length === 0) {
          await client.query('INSERT INTO transactions (hash, lt) VALUES ($1, $2)', [transaction.hash, transaction.lt]);
          console.log(`Giao dịch mới đã được lưu: ${transaction.hash}`);
        } else {
          // console.log(`Giao dịch đã tồn tại trong cơ sở dữ liệu: ${transaction.hash}`);
        }
      }
    }
    // console.log("Dữ liệu đã được lưu vào cơ sở dữ liệu thành công!");
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu vào cơ sở dữ liệu:", error);
  }
}

// app.get("/", async (req, res) => {
//   let a = [];
//   const last_block = await axios.get(
//     "https://testnet.tonapi.io/v2/blockchain/masterchain-head"
//   );
//   const number = last_block.data.seqno;
//   console.log("Block Current", number);
//   let i = number; // Đặt i = số seqno hiện tại của block
//   while (true) {
//     console.log("i:", i);
//     const blockID = `(${last_block.data.workchain_id},${last_block.data.shard},${i})`;
//     console.log("BlockId:", blockID);
//     // const apiUrl = `https://testnet.tonapi.io/v2/blockchain/blocks/${blockID}/transactions`;
//     const apiToncenter = `https://testnet.toncenter.com/api/v3/transactionsByMasterchainBlock?seqno=${i}&limit=15&offset=0&sort=desc`;
//     // const response = await http.get(apiUrl);
//     const response = await http.get(apiToncenter);
//     const transactionData = response.data;
//     if (transactionData.transactions.length > 0) {
//       // console.log(transactionData.transactions);
//       a.push(transactionData);
//       console.log(a);
//       await saveTransactionsToDatabase(a);
//       // const transaction = new Transaction( a.transaction );
//       // await transaction.save();
//       await new Promise((resolve) => setTimeout(resolve, 3000));
//       i++; // Tăng giá trị của i khi có transaction
//     } else {
//       console.log("Chưa Có Transaction....");
//       await new Promise((resolve) => setTimeout(resolve, 5000));
//       // Tiếp tục vòng lặp với cùng một giá trị của i
//       continue;
//     }
//     // // Kiểm tra số lượng transaction đã được lấy và thoát khỏi vòng lặp nếu cần thiết
//     // if (a.length >= 10) {
//     //   break;
//     // }
//     // console.log(a);
//   }
//   res.send("Crawl_Transaction....");
// });
app.get("/", async (req, res) => {
  let a = [];
  const last_block = await axios.get(
    "https://testnet.tonapi.io/v2/blockchain/masterchain-head"
  );
  const number = last_block.data.seqno;
  console.log("Block Current", number);
  let i = number; // Đặt i = số seqno hiện tại của block
  let counter = 0; // Đếm số lần đã gửi yêu cầu
  while (true) {
    console.log("i:", i);
    const blockID = `(${last_block.data.workchain_id},${last_block.data.shard},${i})`;
    console.log("BlockId:", blockID);
    
    let apiUrl, response;
    // Thay phiên sử dụng API mỗi lần get transaction.
    if (counter % 2 === 0) {
      // get theo BlockId
      apiUrl = `https://testnet.tonapi.io/v2/blockchain/blocks/${blockID}/transactions`;
    } else {
      // get theo seqno của block mới nhất
      apiUrl = `https://testnet.toncenter.com/api/v3/transactionsByMasterchainBlock?seqno=${i}&limit=15&offset=0&sort=desc`;
    }

    try {
      response = await http.get(apiUrl);
    } catch (error) {
      console.error("Error:", error);
      // Xử lý lỗi ở đây nếu cần thiết
      await new Promise((resolve) => setTimeout(resolve, 2000)); 
      continue;
    }

    const transactionData = response.data;
    if (transactionData.transactions.length > 0) {
      a.push(transactionData);
      console.log(a);
      await saveTransactionsToDatabase(a);
      await new Promise((resolve) => setTimeout(resolve, 2000)); 
      i++; // Tăng giá trị của i khi có transaction
    } else {
      console.log("Chưa Có Transaction....");
      await new Promise((resolve) => setTimeout(resolve, 2000)); 
    }
    
    counter++; // Tăng biến đếm để đổi API
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
