require('dotenv').config();
const { Web3 } = require('web3');
const { abi } = require('./Transfer.json');

const web3 = new Web3(process.env.RPC_URL);

const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address
const toAddress = 'RECIPIENT_ADDRESS'; // Replace with the recipient's address

const transfer = async () => {
  let privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey === 'YOUR_PRIVATE_KEY') {
    throw new Error('请在 .env 文件中设置您的 PRIVATE_KEY。');
  }
  // 自动处理 '0x' 前缀和多余的空格
  privateKey = privateKey.trim().startsWith('0x') ? privateKey.slice(2) : privateKey;
  
  const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;

  const contract = new web3.eth.Contract(abi, contractAddress);
  const amount = web3.utils.toWei('0.1', 'ether'); // Amount to send

  console.log(`Sending ${web3.utils.fromWei(amount, 'ether')} ETH from ${account.address} to ${toAddress}...`);

  await contract.methods.send(toAddress).send({
    from: account.address,
    value: amount,
  });

  console.log('Transfer successful!');
};

transfer();
