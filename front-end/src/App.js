import React from "react";
import { useEtherBalance, useEthers } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import Main from "./components/Main.js";

function App() {
  const { activateBrowserWallet, account, deactivate } = useEthers();
  const etherBalance = useEtherBalance(account);
  return (
    <div>
      {account ? (
        <button onClick={() => deactivate()}>Disconnect</button>
      ) : (
        <button onClick={() => activateBrowserWallet()}>Connect</button>
      )}

      {account && <p>Account: {account}</p>}
      {etherBalance && <p>Balance: {formatEther(etherBalance)}</p>}
      <Main />
    </div>
  );
}

export default App;
