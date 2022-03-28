import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Web3Modal from "web3modal";
import { providers, Contract } from 'ethers';
import { useState, useRef, useEffect } from 'react';
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";

export default function Home() {

  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedwhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numberOfWhiteListed, setNumberOfWhiteListed] = useState(0);
  const web3modalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3modalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Change the network to rinkeby.")
      throw new Error("Change the network to rinkeby.");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;
  };

  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getNumberOfWhiteListed();
      setJoinedWhitelist(true);
    }
    catch (error) {
      console.error(error);
    }
  };

  const getNumberOfWhiteListed = async () => {
    try {
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      const _numberOfWhiteListed = await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhiteListed(_numberOfWhiteListed);
    }
    catch (error) {
      console.error(error);
    }
  };

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);
      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistContract.whiteListedAddresses(address);
      setJoinedWhitelist(_joinedWhitelist);
    }
    catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressInWhitelist();
      getNumberOfWhiteListed()
    }
    catch (error) {
      console.error(error);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinedwhitelist) {
        return (
          <div className={styles.description}>
            <p>You are already whitelisted</p>
          </div>
        )
      }
      else if (loading) {
        return (
          <div className={styles.description}>
            <p>Loading...</p>
          </div>
        )
      }
      else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    }
    else {
      return (
        <div className={styles.button}>
          <button onClick={connectWallet}>
            Connect wallet
          </button>
        </div>
      )
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3modalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numberOfWhiteListed} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-dev.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div >
  );
}
