import { HardhatUserConfig } from "hardhat/config";
// import "hardhat-docgen";
import 'solidity-docgen';
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
};

export default config;
