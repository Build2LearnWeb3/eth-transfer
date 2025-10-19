require('dotenv').config();
const { Web3 } = require('web3');
const { abi, bytecode } = require('./Transfer.json');

const web3 = new Web3(process.env.RPC_URL);

const deploy = async () => {
  let privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('请在 .env 文件中设置您的 PRIVATE_KEY。');
  }
  // 自动处理 '0x' 前缀和多余的空格
  privateKey = privateKey.trim().startsWith('0x') ? privateKey.slice(2) : privateKey;
  
  const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;

  console.log('Attempting to deploy from account:', account.address);

  const contract = new web3.eth.Contract(abi);

  const deployment = contract.deploy({
    data: bytecode,
  });

  const estimatedGas = await deployment.estimateGas({ from: account.address });
  // Add a 20% buffer to the estimated gas
  const gas = Math.ceil(Number(estimatedGas) * 1.2);

  console.log(`Gas estimation: ${estimatedGas}, using: ${gas}`);

  const deployedContract = await deployment.send({
    from: account.address,
    gas: gas,
  });

  console.log('Transaction Hash:', deployedContract.transactionHash);
  console.log('Contract deployed to:', deployedContract.options.address);
};

deploy();
