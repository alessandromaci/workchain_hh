import { useState } from "react";
import { CreateWork, GetPricePerWorkId, GetPricePerWorkIdCall } from "../hooks";
import { utils } from "ethers";

export const Main = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState("");
  const [price, setPrice] = useState(0);

  const [inputWorkId, setInputWorkId] = useState(0);

  const { send: sendCreateWork, state: stateCreateWork } = CreateWork();
  const result = GetPricePerWorkIdCall(inputWorkId)?.toString();

  const hanleChangeName = (e) => setName(e.target.value);
  const hanleChangeFile = (e) => setFile(e.target.value);
  const hanleChangePrice = (e) => {
    const price = e.target.value;
    setPrice(price);
    console.log(price);
  };
  const handleChangeWorkId = (e) => {
    const inputWorkId = Number(e.target.value);
    setInputWorkId(inputWorkId);
    console.log(inputWorkId);
  };

  const handleSubmit = () => {
    createWork();
  };

  const createWork = () => {
    sendCreateWork(name, file, utils.parseEther(price), {
      value: utils.parseEther(price),
    });
    console.log(stateCreateWork);
  };

  return (
    <div>
      <div>
        <input type="text" placeholder="Name" onChange={hanleChangeName} />
        <input type="text" placeholder="File" onChange={hanleChangeFile} />
        <input type="text" placeholder="Price" onChange={hanleChangePrice} />
        <button onClick={handleSubmit}>Request Work</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Work ID"
          onChange={handleChangeWorkId}
        />
        {result ? <div>{result}</div> : <div></div>}
      </div>
    </div>
  );
};

export default Main;
