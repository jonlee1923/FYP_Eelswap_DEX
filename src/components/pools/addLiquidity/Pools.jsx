// import { checkProperties } from "ethers/lib/utils";
import React, { useContext, useState, useEffect } from "react";
import { EelswapContext } from "../../../context/EelswapContext";
import DepositAmount1 from "./DepositAmount1";
import DepositAmount2 from "./DepositAmount2";
import Token1 from "./Token1";
import Token2 from "./Token2";
import Balance1 from "./Balance1";
import Balance2 from "./Balance2";
import LoadingSpinner from "../../loading/LoadingSpinner";
import LoadingOverlay from "../../loading/LoadingOverlay";
import { WETH } from "../../../utils/helpers";
import Settings from "../../settings/Settings";

export default function Pools(props) {
    const {
        connected,
        getPairs,
        getAvailableTokens,
        getCounterpartTokens,
        findPoolByTokens,
        addLiquidity,
        addLiquidityETH,
        getLiquidityAmt,
    } = useContext(EelswapContext);

    const [loading, setLoading] = useState(false);
    const [token1, setToken1] = useState("");
    const [token2, setToken2] = useState("");
    const [amount1, setAmount1] = useState("");
    const [amount2, setAmount2] = useState("");

    const [token1Name, setToken1Name] = useState("");
    const [token2Name, setToken2Name] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };
    let availableTokens = getAvailableTokens(props.pools);
    let counterpartTokens = getCounterpartTokens(props.pools, token1);
    let pairAddress = "";

    useEffect(() => {
        if (props.pools.length !== 0) {
            setToken1(props.pools[0].token0Address);
            pairAddress =
                findPoolByTokens(props.pools, token1, token2)?.address ?? "";
        }
    }, []);

    const token1Change = (value) => {
        console.log(value);
        setToken1(value);
    };

    const token2Change = (value) => {
        console.log(value);
        setToken2(value);
        console.log(token2);
    };

    const amount1Change = (event) => {
        console.log(event.target.value);
        setAmount1(event.target.value);
    };

    const amount2Change = (event) => {
        console.log(event.target.value);
        setAmount2(event.target.value);
    };

    const onAddLiquidity = async () => {
        try {
            setLoading(true);
            console.log("token1: " + token1);
            console.log("token2: " + token2);
            console.log("amount1: " + amount1);
            console.log("amount2: " + amount2);
            console.log("connected: " + connected);
            // let amount1Int = parseInt(amount1);
            // let amount2Int = parseInt(amount2);

            let dict;

            if (token1 === WETH || token2 === WETH) {
                if (token1 === WETH) {
                    let token = token2;
                    let amountInput = amount2;
                    let amountInputETH = amount1;
                    dict = await addLiquidityETH(
                        token,
                        amountInput,
                        amountInputETH,
                        1671815772
                    );
                } else {
                    let token = token1;
                    let amountInput = amount1;
                    let amountInputETH = amount2;
                    dict = await addLiquidityETH(
                        token,
                        amountInput,
                        amountInputETH,
                        1671815772
                    );
                }
            } else {
                dict = await addLiquidity(
                    token1,
                    token2,
                    amount1,
                    amount2,
                    connected,
                    1671641174
                );
            }
            updateOrAdd(dict);
            setLoading(false);
            setToken2("");
            setAmount1("");
            setAmount2("");
        } catch (err) {
            setLoading(false);
            console.log(err);
        }
    };

    const updateOrAdd = async (dict) => {
        let liquidity = await getLiquidityAmt(dict["pairAddress"]);
        dict["liquidity"] = liquidity;
        dict["token1Address"] = token1;
        dict["token2Address"] = token2;

        const now = new Date();
        let date = now.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
        date = date.replace(/\//g, "-");
        date = date.slice(6, 10) + "-" + date.slice(0, 3) + date.slice(3, 5);
        const time = now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });

        dict["time"] = time;
        dict["date"] = date;
        dict["open"] = true;

        console.log(JSON.stringify(dict));
        fetchData(JSON.stringify(dict));
    };

    const fetchData = async (dict) => {
        const response = await fetch("/.netlify/functions/addPositions", {
            method: "POST",
            body: dict,
        });

        const responseBody = await response.json();
        console.log(responseBody.data);
    };

    return props.loading || loading ? (
        <LoadingOverlay
            title={"Please wait for your transaction to complete"}
            loading={props.loading || loading}
            message1={`Adding liquidity with ${amount1} ${token1Name} tokens and ${amount2} ${token2Name} tokens`}
            message2={"Please confirm your transaction in Metamask"}
        />
    ) : (
        <div className="flex flex-col">
            <div className="pt-6 flex flex-row text-white justify-end">
                <button onClick={toggleSettings}>
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                </button>
            </div>
            <div className="mx-10 flex flex-row justify-center ">
                <div className=" mr-5 flex flex-col">
                    <div className="my-5">
                        <Token1
                            token={token1}
                            onTokenChange={token1Change}
                            setToken={setToken1}
                            availableTokens={availableTokens}
                            setTokenName={setToken1Name}
                        />
                    </div>
                    <div className="my-5">
                        <DepositAmount1
                            amount1={amount1}
                            onAmountChange={amount1Change}
                        />
                    </div>

                    <Balance1 token={token1} />
                </div>
                <div className="ml-5 flex flex-col">
                    <div className="my-5">
                        <Token2
                            token={token2}
                            onTokenChange={token2Change}
                            counterpartTokens={counterpartTokens}
                            setTokenName={setToken2Name}
                        />
                    </div>
                    <div className="my-5">
                        <DepositAmount2
                            amount2={amount2}
                            onAmountChange={amount2Change}
                        />
                    </div>

                    <Balance2 token={token2} />
                </div>
            </div>
            {showSettings && (
                <Settings
                    show={showSettings}
                    toggleShow={toggleSettings}
                    // deadline={deadline}
                    // slippage={slippage}
                    // onDeadlineChange={onDeadlineChange}
                    // onSlippageChange={onSlippageChange}
                />
            )}

            <div className="mt-10 flex justify-center">
                <button
                    className="text-white text-lg bg-green-500 rounded-2xl p-2"
                    onClick={() => {
                        onAddLiquidity();
                    }}
                >
                    Add Liquidity
                </button>
            </div>
        </div>
    );
}
