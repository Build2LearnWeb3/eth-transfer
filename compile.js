const solc = require('solc');
const fs = require('fs');

const fileName = 'Transfer.sol';
const contractName = 'Transfer';

const content = fs.readFileSync(fileName, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    [fileName]: {
      content,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

const contract = output.contracts[fileName][contractName];

fs.writeFileSync(
  `${contractName}.json`,
  JSON.stringify(
    {
      abi: contract.abi,
      bytecode: contract.evm.bytecode.object,
    },
    null,
    2
  )
);

console.log('Contract compiled successfully!');
