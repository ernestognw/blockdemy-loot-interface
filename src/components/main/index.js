import { useEffect, useState, useCallback } from "react";
import Web3 from "web3";
import { abi, address as contractAddress } from "../../utils";
import "./styles.css";

const Main = () => {
  const [connected, setConnect] = useState(false);
  const [web3, setWeb3] = useState();
  const [contract, setContract] = useState();
  const [maxSupply, setMaxSupply] = useState(0);
  const [totalSuply, setTotalSupply] = useState(0);
  const [address, setAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [userAddress, setUserAddress] = useState();

  const connect = useCallback(async () => {
    if (web3.eth) {
      const [account] = await web3.eth.requestAccounts();
      setUserAddress(account);
      setConnect(true);
    }
  }, [web3?.eth]);

  useEffect(() => {
    if (web3) {
      connect();
    } else {
      const instance = new Web3(window.ethereum);
      setWeb3(instance);
      setContract(new instance.eth.Contract(abi, contractAddress));
    }
  }, [connect, web3]);

  const updateNumbers = useCallback(() => {
    if (contract) {
      contract.methods.maxSupply().call().then(setMaxSupply);
      contract.methods.totalSupply().call().then(setTotalSupply);
    }
  }, [contract]);

  useEffect(() => {
    updateNumbers();
  }, [updateNumbers]);

  const mint = (event) => {
    event.preventDefault();

    if (!web3.utils.isAddress(address)) {
      alert("Address no válido");
      return;
    }

    const id = Number(tokenId);

    if (Number.isNaN(id)) {
      alert("Número inválido");
      return;
    }

    if (id >= maxSupply) {
      alert("Número mayor a los disponibles");
      return;
    }

    contract.methods
      .mint(address, id)
      .send({
        from: userAddress,
      })
      .then(() => {
        alert("Minteado correctamente");
        updateNumbers();
      })
      .catch(() => {
        alert("Ocurrión un error");
      });
  };

  return (
    <>
      <h1>Blockdemy Loot</h1>
      {connected ? (
        <>
          <form onSubmit={mint} className="form">
            <label>Address</label>
            <input
              className="input"
              value={address}
              onChange={({ target: { value } }) => setAddress(value)}
              placeholder="Address"
              type="text"
            />
            <label>Token ID</label>
            <input
              className="input"
              value={tokenId}
              onChange={({ target: { value } }) => setTokenId(value)}
              placeholder="Token ID"
              type="text"
            />
            <input className="button" type="submit" value="Mint"></input>
          </form>
          <h3>
            {totalSuply} / {maxSupply} minted
          </h3>
        </>
      ) : (
        <div className="form center-text">
          <p>Porfavor, conecta tu wallet</p>
          <button onClick={connect} className="button">
            Conectar
          </button>
        </div>
      )}
      <iframe
        title="store"
        src="https://testnets.opensea.io/collection/blockdemy-loot-v2?embed=true"
        width="100%"
        height="100%"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </>
  );
};

export default Main;
