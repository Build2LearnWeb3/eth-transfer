
require('dotenv').config();
const { Web3 } = require('web3');

const web3 = new Web3(process.env.RPC_URL);

const getContractAddress = async () => {
  const txHash = '0xfa3910c85f1b62372d810a4a837bee92a2a4de4f2c58a105c31215b2cf03f56b';
  try {
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    if (receipt && receipt.contractAddress) {
      console.log('Contract Address:', receipt.contractAddress);
    } else {
      console.log('Contract address not found. The transaction may not have been a contract creation or it is still pending.');
    }
  } catch (error) {
    console.error('Error fetching transaction receipt:', error);
  }
};

getContractAddress();
