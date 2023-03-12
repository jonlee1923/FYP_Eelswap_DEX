import React, { useState, useEffect, useContext } from "react";
import Token from "./Token";
import styles from "../../../styles";
import chevronDown from "../../../assets/chevron-down.svg";
import bscLogo from "../../../assets/bscTokenLogo.png";
import ethLogo from "../../../assets/ethTokenLogo.png";
import ChainRow from "./ChainRow";
import { EelswapContext } from "../../../context/EelswapContext";
import LoadingOverlay from "../../loading/LoadingOverlay";
import LoadingSpinner from "../../loading/LoadingSpinner";
import ErrorOverlay from "../../error/ErrorOverlay";

export default function Tokens1(props) {
    const [loading, setLoading] = useState(false);
    const [tokens, setTokens] = useState(null);
    const [showList, setShowList] = useState(false);
    const [activeToken, setactiveToken] = useState("Select");
    const [activeTokenUrl, setactiveTokenUrl] = useState("");
    const [showChains, setShowChains] = useState(false);
    const [address, setAddress] = useState("");
    const [buttonImage, setButtonImage] = useState(false);
    const [loadingTokens, setLoadingTokens] = useState(true);
    const [symbol, setSymbol] = useState("");
    const [error, setError] = useState(false);

    const {
        activeChain,
        getEthTokenSymbol,
        lockBscToken,
        lockedBscTokenAmt,
        getTokenBalance,
        getWrappedBscTokenAddress,
        getBscTokenSymbol,
    } = useContext(EelswapContext);

    const fetchData = async () => {
        const response = await fetch("/.netlify/functions/getTokens", {
            method: "POST",
        });

        const responseBody = await response.json();
        setTokens(responseBody.data.tokens.values);
        setLoadingTokens(false);
    };

    const checkIfTokenExists = async (address) => {
        const response = await fetch("/.netlify/functions/getToken", {
            method: "POST",
            body: JSON.stringify(address),
        });

        const responseBody = await response.json();

        console.log(responseBody.data.tokens.values[0]);
        return responseBody.data.tokens.values[0];
    };

    const addToken = async (addressInput) => {
        if (activeChain === "ETH") {
            setLoading(true);
            let symbol = await getEthTokenSymbol(addressInput);
            let dict = {
                address: addressInput,
                eth: props.activeChain === "eth",
                imageURL: "",
                symbol: symbol,
            };
            const response = await fetch("/.netlify/functions/addToken", {
                method: "POST",
                body: dict,
            });
            const responseBody = await response.json();
            console.log(responseBody);
        } else {
            try {
                setLoading(true);
                let symbol = await getBscTokenSymbol(addressInput);
                setSymbol(symbol);
                await lockBscToken(addressInput, props.amount, symbol);

                await lockedBscTokenAmt(addressInput);

                await chainSwitcher(5);

                props.setActiveChain("ETH");
                await new Promise((resolve) => setTimeout(resolve, 2000)); // delay of 1 second (1000 milliseconds)
                console.log("address",addressInput)
                let ethAddress = await getWrappedBscTokenAddress(addressInput);
                console.log(ethAddress);
                let dict = {
                    address: ethAddress,
                    eth: props.activeChain === "eth",
                    imageURL: "",
                    symbol: symbol,
                };
                let tokenExists = await checkIfTokenExists(ethAddress);
                if (tokenExists === null || tokenExists === undefined) {
                    const response = await fetch(
                        "/.netlify/functions/addToken",
                        {
                            method: "POST",
                            body: dict,
                        }
                    );
                    const responseBody = await response.json();
                    console.log(responseBody);
                }

                setLoading(false);
            } catch (err) {
                console.log(err);
                setError(true);
            }
        }
    };

    const onAddressChange = (event) => {
        // console.log(event.target.value);
        setAddress(event.target.value);
        // props.onTokenChange(event.target.value);
    };

    const toggleShowChain = (event) => {
        setShowChains(!showChains);
    };

    const chainSwitcher = async (chainId) => {
        try {
            // console.log(chainId);
            let value = Number(chainId).toString(16);
            // console.log(value);
            if (!window.ethereum) throw new Error("No crypto wallet found");
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: `0x${value}` }], // Rinkeby chain id
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        console.log("loading");
        fetchData();
        console.log(tokens);
    }, []);

    const chains = { ETH: 5, BSC: 97 };

    return (
        <div className="relative ml-2">
            {loading && (
                <LoadingOverlay
                    title={"Please wait for your transaction to complete"}
                    loading={loading}
                    message1={`Transferring ${props.amount} of ${symbol} tokens to the ethereum chain`}
                    message2={"Please confirm your transaction in Metamask"}
                />
            )}
            <button
                className={`${styles.tokenDropdown}`}
                onClick={() => setShowList(!showList)}
            >
                {loadingTokens ? (
                    <div className="flex">
                        <LoadingSpinner margin="2" height="5" />
                    </div>
                ) : (
                    <div className="flex">
                        <div className="flex items-center">
                            <img
                                className="h-6 mr-2"
                                src={
                                    activeTokenUrl
                                        ? activeTokenUrl
                                        : setButtonImage
                                        ? ethLogo
                                        : bscLogo
                                }
                                alt=""
                            />

                            {activeToken.length < 10
                                ? activeToken
                                : activeToken.substring(0, 6) +
                                  "..." +
                                  activeToken.substring(activeToken.length - 4)}
                        </div>
                        <img
                            className="ml-2"
                            src={chevronDown}
                            alt="chevronDown"
                        />
                    </div>
                )}
            </button>
            {showList && (
                <div>
                    <div className="text-s flex flex-col bg-black px-5 py-4 rounded-t-lg border mt-2">
                        <div className="flex border rounded-md p-2">
                            <div className="text-white mr-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                    />
                                </svg>
                            </div>
                            <input
                                placeholder="Enter a token address"
                                value={address}
                                onChange={onAddressChange}
                                className={`${styles.amountInputPool}`}
                            />
                        </div>
                        <div className="flex justify-around mt-2">
                            <button
                                className="text-white bg-green-600 rounded-md p-1 px-2"
                                onClick={() => {
                                    setShowList(false);
                                    setactiveToken(address);
                                    props.setToken(address);
                                    addToken(address);
                                }}
                            >
                                Add Token
                            </button>
                            <button
                                className="text-white bg-green-600 rounded-md p-1 px-2"
                                onClick={() => {
                                    toggleShowChain();
                                }}
                            >
                                Select Chain
                            </button>
                        </div>
                    </div>
                    <ul className={styles.currencyList}>
                        <hr class="border-t border-gray-300" />
                        {!showChains
                            ? Object.entries(tokens).map((token, index) => (
                                  <Token
                                      key={index}
                                      address={token[1]["address"]}
                                      symbol={token[1]["symbol"]}
                                      imageURL={token[1]["imageURL"]}
                                      setAddress={setAddress}
                                      setactiveToken={setactiveToken}
                                      setShowList={setShowList}
                                      setTokenName={props.setTokenName}
                                      onTokenChange={props.onTokenChange}
                                      setactiveTokenUrl={setactiveTokenUrl}
                                      setImageUrl={props.setImageUrl}
                                      setButtonImage={setButtonImage}
                                  />
                              ))
                            : Object.entries(chains).map((chain, index) => (
                                  <ChainRow
                                      key={index}
                                      chain={chain}
                                      toggleShowChain={toggleShowChain}
                                      activeChain={props.activeChain}
                                      setActiveChain={props.setActiveChain}
                                      onChange={chainSwitcher}
                                  />
                              ))}
                    </ul>
                    {error && (
                        <ErrorOverlay
                            title="Error"
                            message1={error}
                            message2="Please try again"
                            setError={setError}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
