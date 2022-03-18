const { NFTStorage, File, Blob } = require("nft.storage");
const fs = require("fs");
const path = require("path");
const mime = require("mime");
require("dotenv").config();
//const { hre } = require("hardhat");

async function main() {
  const fileFromPath = async (filePath) => {
    const content = await fs.promises.readFile(filePath);
    const type = mime.getType(filePath);
    return new File([content], path.basename(filePath), { type });
  };

  const NFT_STORAGE_TOKEN = process.env.NFT_STORAGE_TOKEN;
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
  const image = await fileFromPath("./files/contract.PNG");

  console.log(image);

  const metadata = await client.store({
    name: "My sweet NFT",
    description: "Just try to funge it. You can't do it.",
    image: image,
  });

  console.log(metadata);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
