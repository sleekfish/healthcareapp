import hre from "hardhat";

async function main() {
    // This looks for your MedicalVault.sol in the contracts folder
    const MedicalVault = await hre.ethers.getContractFactory("MedicalVault");

    console.log("🚀 Starting deployment...");

    // Deploys the contract to your local network
    const vault = await MedicalVault.deploy();

    await vault.waitForDeployment();

    const address = await vault.getAddress();

    console.log("-----------------------------------------");
    console.log("✅ Medical Vault deployed successfully!");
    console.log("📍 Contract Address:", address);
    console.log("-----------------------------------------");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});