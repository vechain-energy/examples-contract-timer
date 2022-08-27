# Setup

Install dependencies:

```shell
yarn init -y
yarn add --dev hardhat @nomiclabs/hardhat-waffle @nomiclabs/hardhat-ethers @vechain.energy/hardhat-thor @openzeppelin/contracts hardhat-jest-plugin nodemon
```

manually add `hardhat.config.js`:
```js
require("@nomiclabs/hardhat-waffle");
require('@vechain.energy/hardhat-thor')
require("hardhat-jest-plugin")

module.exports = {
  solidity: "0.8.4",
  networks: {
    vechain: {
      url: 'https://testnet.veblocks.net',
      privateKey: "0x80b97e2ecfab8b1c78100c418328e8a88624e3d19928ec791a8a51cdcf01f16f",
      delegateUrl: 'https://sponsor-testnet.vechain.energy/by/90'
    }
  }
};
```

init jest tests:
```shell
$ npx jest --init

The following questions will help Jest to create a suitable configuration for your project

✔ Would you like to use Jest when running "test" script in "package.json"? … no
✔ Would you like to use Typescript for the configuration file? … no
✔ Choose the test environment that will be used for testing › node
✔ Do you want Jest to add coverage reports? … no
✔ Which provider should be used to instrument code for coverage? › v8
✔ Automatically clear mock calls, instances and results before every test? … yes

📝  Configuration file created at /jest.config.js
```

add deploy helper script to `scripts/deploy-contract.js`:
```js
const hre = require('hardhat')

async function main () {
  // get contract names to deploy
  const contractNames = process.argv.slice(2)

  if (!contractNames.length) {
    throw new Error('No contract names for deployment given')
  }

  for (const contractName of contractNames) {
    console.log(`[${contractName}] Deploying Contract `)

    // get contract to deploy
    const Contract = await hre.thor.getContractFactory(contractName)

    // deploy and wait for result
    const deployedContract = await Contract.deploy()
    await deployedContract.deployed()

    console.log(`[${contractName}] Transaction Id: ${deployedContract.deployTransaction.hash}`)
    console.log(`[${contractName}] Contract is now available at ${deployedContract.address}\n`)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

```

add helper commands to `package.json`:
```json
  "scripts": { 
    "build": "hardhat compile",
    "test": "hardhat test:jest",
    "test:watch": "nodemon -e sol --exec 'hardhat test:jest --watch'",
    "deploy": "node scripts/deploy-contract.js"
  }
```

# Content

```shell
contracts
├── Timer.sol
├── Timer.test.js
```

# Commands

* `yarn build` to compile contract
* `yarn test` to run tests
* `yarn test:watch` to run tests again when something changes
* `yarn deploy Factory` to deploy Factory contract


# Example

## Deploy

```shell
$ yarn deploy Timer
yarn run v1.22.17
$ node scripts/deploy-contract.js Timer
[Timer] Deploying Contract 
[Timer] Transaction Id: 0x2c481e9607ba460db952e54f3b5f6ef697567c4322622bf2689ba7caab9417a1
[Timer] Contract is now available at 0x23272358E253cE0EbBEBA4eAe3e8591A8E6194ce

✨  Done in 19.19s.
```

## Test

Test `setCountdownTo(2051218800)` via vechain.energy API:

```shell
$ curl -X POST https://sponsor-testnet.vechain.energy/by/115/transaction \
  -H "X-API-Key: gqxao258sg.65fdb6ea8d8f634080fb65322f3170fed920b7dc4adc3f805ec023de07b27282" \
  -H "Content-Type: application/json" \
  -d '{"clauses": [ "0x23272358E253cE0EbBEBA4eAe3e8591A8E6194ce.setCountdownTo(uint256 2051218800)" ]}'

{"id":"0x189d1f7015df8cfe48666d8800337f7e0b9d504ddd3dc95e186f12d525b50d18","url":"https://vethor-node-test.vechaindev.com/transactions/0x189d1f7015df8cfe48666d8800337f7e0b9d504ddd3dc95e186f12d525b50d18?pending=true"}
```

Read  `countdown()`:

```shell
$ curl https://call.api.vechain.energy/test/0x23272358E253cE0EbBEBA4eAe3e8591A8E6194ce/countdown\(\)%20returns\(uint256\) -s
"389592910"
```

Read  `countdownMinutes()`:

```shell
$ curl https://call.api.vechain.energy/test/0x23272358E253cE0EbBEBA4eAe3e8591A8E6194ce/countdownMinutes\(\)%20returns\(uint256\) -s
"6493214"
```

Read  `changedAt()`:

```shell
$ curl https://call.api.vechain.energy/test/0x23272358E253cE0EbBEBA4eAe3e8591A8E6194ce/changedAt\(\)%20returns\(uint256\) -s
"1661625890"
```

## Result

* Transaction: https://explore-testnet.vechain.org/transactions/0x189d1f7015df8cfe48666d8800337f7e0b9d504ddd3dc95e186f12d525b50d18#info
