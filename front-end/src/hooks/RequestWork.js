import RequestWork from "../contracts/Workchain.json";
import { useState, useEffect } from "react";
import { utils } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useCall, useContractFunction } from "@usedapp/core";

//address
//abi
const workchainAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const { abi } = RequestWork;
const workchainInterface = new utils.Interface(abi);
const workchainContract = new Contract(workchainAddress, workchainInterface);

export const CreateWork = () => {
  const { send, state } = useContractFunction(workchainContract, "createWork", {
    transactionName: "Request New Work",
  });
  return { send, state };
};

export const GetPricePerWorkId = () => {
  const { send, state } = useContractFunction(
    workchainContract,
    "workIdToPrice",
    {
      transactionName: "Get the correct price ID",
    }
  );
  return { send, state };
};

export const GetPricePerWorkIdCall = (priceResult) => {
  const { value, error } =
    useCall({
      contract: workchainContract,
      method: "workIdToPrice",
      args: [priceResult],
    }) ?? {};
  if (error) {
    console.error(error.message);
    return undefined;
  }
  return value?.[0];
};

// export const createRequestWork = (nameInput, fileInput, priceInput) => {
//   setName(nameInput);
//   setFile(fileInput);
//   setPrice(priceInput);
//   return requestWorkSend(name, file, utils.parseEther(price), {
//     value: utils.parseEther(price),
//   });
// };

// const [state, setState] = useState(requestWorkState);

// useEffect(() => {
//   if (requestWorkState.status === "Success") {
//     console.log("Request Work Success");
//     setState(requestWorkState);
//   } else {
//     console.log(requestWorkState);
//   }
// }, [requestWorkState]);
