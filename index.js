const ethers = require('ethers');
const controllerAbi = require('./controller.json');

const controllerAddress = '0x4aaE9823Fb4C70490F1d802fC697F3ffF8D5CbE3';
const vaultAbi = [
    "function baseLiability() external view returns (uint256)"
]
const provider = new ethers.providers.InfuraProvider("homestead", {
    projectId: "a4dc2de06c56459f9874d8b56ec53699",
    projectSecret: "7817c281170b4f1da28eea41ff551329"
});

const controllerContract = new ethers.Contract(controllerAddress, controllerAbi, provider);

const checkVaultFromId = async (id) => {
    return controllerContract.checkVault(id);
}

/* const main = async () => {
    const amountOfVaults = await controllerContract.vaultsMinted(); // 28

    for (let i = 1; i < amountOfVaults; i++) {
        if ((await checkVaultFromId(i)) == false) {
            console.log(i);
        }
    }
} */

const main = async () => {
    const amountOfVaults = await controllerContract.vaultsMinted(); // 28
    const interestFactor = await controllerContract.interestFactor();

    for (let i = 1; i <= amountOfVaults; i++) {
      const vaultAddr = await controllerContract.vaultAddress(i);
      const vaultContract = new ethers.Contract(vaultAddr, vaultAbi, provider);

      const vaultBorrowingPower = await controllerContract.vaultBorrowingPower(i);
      const vaultBaseLiability = await vaultContract.baseLiability();

      const adjustBaseLiability = vaultBaseLiability.mul(interestFactor).div(ethers.BigNumber.from(10).pow(18));

        if (vaultBorrowingPower.toString() === '0') {
            console.log(`${i} - dead`);
        continue;
        }
      console.log(`${i} - ${ethers.BigNumber.from(ethers.BigNumber.from(1000000).mul(adjustBaseLiability)).div(vaultBorrowingPower).toNumber() / 10000}% - ${vaultAddr}`);
    }
    }
 


main();