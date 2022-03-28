const { ethers } = require('hardhat');

async function main() {

    const whitelistContract = await ethers.getContractFactory("Whitelist");
    const deployedWhitelistContract = await whitelistContract.deploy(10);
    await deployedWhitelistContract.deployed();

    console.log("Whitelist contract address: " + deployedWhitelistContract.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });


    //contract address 0x5fBA089f621A14A7b2Dccc863EC5E23F14D5CcEe