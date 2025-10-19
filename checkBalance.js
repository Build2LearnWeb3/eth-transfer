require('dotenv').config();
const { Web3 } = require('web3');

const checkBalance = async () => {
  try {
    const web3 = new Web3(process.env.RPC_URL);
    
    let privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('请在 .env 文件中设置您的 PRIVATE_KEY。');
    }
    privateKey = privateKey.trim().startsWith('0x') ? privateKey.slice(2) : privateKey;
    
    const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
    const address = account.address;
    
    console.log(`正在查询地址: ${address} 的余额...`);

    const balanceWei = await web3.eth.getBalance(address);
    const balanceEth = web3.utils.fromWei(balanceWei, 'ether');

    console.log(`余额: ${balanceEth} Sepolia ETH`);

    if (parseFloat(balanceEth) < 0.01) {
        console.log('\n余额不足！请从水龙头获取一些免费的 Sepolia ETH。');
    } else {
        console.log('\n余额充足，可以进行部署。');
    }

  } catch (error) {
    console.error('查询余额时出错:', error.message);
  }
};

checkBalance();
