require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env" });

const AlCHEMY_API_KEY = process.env.ALCHEMY_API_KEY_URL;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;


module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: AlCHEMY_API_KEY,
      accounts: [RINKEBY_PRIVATE_KEY],
    },
  },
};
