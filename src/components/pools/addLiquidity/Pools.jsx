// import { checkProperties } from "ethers/lib/utils";
import React, { useContext, useState, useEffect } from "react";
import { EelswapContext } from "../../../context/EelswapContext";
import DepositAmount1 from "./DepositAmount1";
import DepositAmount2 from "./DepositAmount2";
// import Token1 from "./Token1";
// import Token2 from "./Token2";
import Balance1 from "./Balance1";
import Balance2 from "./Balance2";
import LoadingOverlay from "../../loading/LoadingOverlay";
import { WETH } from "../../../utils/helpers";
import Settings from "../../settings/Settings";
import Tokens1 from "./Tokens1";
import ErrorOverlay from "../../error/ErrorOverlay";

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

    const [error, setError] = useState(false);
    const [slippage, setSlippage] = useState("");
    const [deadline, setDeadline] = useState("");
    const [imageUrl1, setImageUrl1] = useState("");
    const [imageUrl2, setImageUrl2] = useState("");


    const onSlippageChange = async (event) => {
        setSlippage(event.target.value);
    };

    const onDeadlineChange = async (event) => {
        setDeadline(event.target.value);
    };
    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };
    // let availableTokens = getAvailableTokens(props.pools);
    // let counterpartTokens = getCounterpartTokens(props.pools, token1);
    let pairAddress = "";

    const getTimestampInSeconds = () => {
        const now = new Date();
        return Math.floor(now.getTime() / 1000);
    };

    useEffect(() => {
        // if (props.pools.length !== 0) {
        //     setToken1(props.pools[0].token0Address);
        //     pairAddress =
        //         findPoolByTokens(props.pools, token1, token2)?.address ?? "";
        // }
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

            if (token1 === token2) {
                setError(
                    "The same token cannot be used, please choose another token"
                );

                throw new Error();
            }
            let currentTime = getTimestampInSeconds();

            let defaultSlippage = 50;
            let defaultDeadline = 10;
            let finalDeadline

            console.log(slippage, deadline)
            
            if (deadline === "") {
                currentTime += parseInt(defaultDeadline) * 60;
                console.log(currentTime);
                finalDeadline = currentTime
            } else {
                currentTime += parseInt(deadline) * 60;
                console.log(currentTime);
                finalDeadline = currentTime
            }

            let dict;
            let finalSlippage
            
            if (slippage === "") {
                finalSlippage = defaultSlippage
            }
            if (token1 === WETH || token2 === WETH) {
                if (token1 === WETH) {
                    let token = token2;
                    let amountInput = amount2;
                    let amountInputETH = amount1;
                    dict = await addLiquidityETH(
                        token,
                        amountInput,
                        amountInputETH,
                        Math.floor(((100 - finalSlippage) / 100) * amountInput),
                        Math.floor(((100 - finalSlippage) / 100) * amountInputETH),
                        finalDeadline
                    );
                } else {
                    let token = token1;
                    let amountInput = amount1;
                    let amountInputETH = amount2;
                    console.log(Math.floor(((100 - finalSlippage) / 100) * amountInputETH),)
                    dict = await addLiquidityETH(
                        token,
                        amountInput,
                        amountInputETH,
                        Math.floor(((100 - finalSlippage) / 100) * amountInput),
                        Math.floor(((100 - finalSlippage) / 100) * amountInputETH),
                        finalDeadline
                    );
                }
            } else {
                console.log(Math.floor(((100 - finalSlippage) / 100) * amount1))
                dict = await addLiquidity(
                    token1,
                    token2,
                    amount1,
                    amount2,
                    // 1,1,
                    Math.floor(((100 - finalSlippage) / 100) * amount1),
                    Math.floor(((100 - finalSlippage) / 100) * amount2),
                    finalDeadline
                );
            }
            await updateOrAdd(dict);
            // await updateOrAdd({});

            setLoading(false);
            setToken2("");
            setAmount1("");
            setAmount2("");
            setDeadline("");
            setSlippage("")
        } catch (err) {
            setLoading(false);
            setDeadline("");
            setSlippage("")
            setError(true)
            console.log(err);
        }
    };

    const checkIfPositionExists = async (dict) => {
        const response = await fetch("/.netlify/functions/getPosition", {
            method: "POST",
            body: dict,
        });

        const responseBody = await response.json();
        console.log(responseBody.data.liquidityPositions.values[0])
        return responseBody.data.liquidityPositions.values[0]
        // console.log(responseBody.data.positions.values[0]);
        // return responseBody.data.positions.values[0];
    };

    const updateOrAdd = async (dict) => {
        let newdict = { address: connected, pairAddress: dict["pairAddress"] };
        // let newdict = { address: connected, pairAddress: "0xcf876bEf1A443c7Ae820018Cb8ABd0ac05819d05" };
        // console.log(checkIfPositionExists(JSON.stringify(newdict)))
        console.log(dict);
        let position = await checkIfPositionExists(JSON.stringify(newdict));
        let finalOpen = position["open"]

        if(position["liquidity"] + dict["liquidity"] > 0){
            finalOpen = true
        }

        if (position !== null && position !== undefined) {
            console.log("update");
            let updateDict = {
                address: connected,
                pairAddress: position["pairAddress"],
                liquidity: position["liquidity"] + dict["liquidity"],
                token1Amount: position["token1Amount"] + dict["token1Amount"],
                token2Amount: position["token2Amount"] + dict["token2Amount"],
                open: finalOpen,
            };
            updateData(JSON.stringify(updateDict));
        } else {
            console.log("ADD");
            let liquidity = await getLiquidityAmt(dict["pairAddress"]);
            dict["liquidity"] = liquidity;
            dict["token1Address"] = token1;
            dict["token2Address"] = token2;
            dict["open"] = true;

            // add imageurl here
            dict["token1ImageUrl"] = imageUrl1
            dict["token2ImageUrl"] = imageUrl2
            console.log(dict)
            console.log(JSON.stringify(dict));
            fetchData(JSON.stringify(dict));
            setSlippage("")
            setDeadline("")
        }
    };

    const fetchData = async (dict) => {
        const response = await fetch("/.netlify/functions/addPositions", {
            method: "POST",
            body: dict,
        });

        const responseBody = await response.json();
        console.log(responseBody.data);
    };

    const updateData = async (dict) => {
        const response = await fetch("/.netlify/functions/updatePosition", {
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
            <div className="pt-6 flex flex-row text-white justify-end mr-48"></div>
            <div className="mx-10 flex flex-row justify-center">
                <div className=" mr-5 flex flex-col">
                    <div className="my-5">
                        <Tokens1
                            token={token1}
                            onTokenChange={token1Change}
                            setToken={setToken1}
                            setTokenName={setToken1Name}
                            amount={amount1}
                            loading={loading}
                            setLoading={setLoading}
                            activeChain={props.activeChain}
                            setActiveChain={props.setActiveChain}
                            setImageUrl={setImageUrl1}

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
                <div className="ml-5 flex flex-col justify-start">
                    <div className="my-5 flex justify-between mr-2">
                        <Tokens1
                            token={token2}
                            onTokenChange={token2Change}
                            setToken={() => {}}
                            setTokenName={setToken2Name}
                            amount={amount2}
                            loading={loading}
                            setLoading={setLoading}
                            activeChain={props.activeChain}
                            setActiveChain={props.setActiveChain}
                            setImageUrl={setImageUrl2}
                        />
                        <div className="flex text-white items-center">
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
                    deadline={deadline}
                    slippage={slippage}
                    onDeadlineChange={onDeadlineChange}
                    onSlippageChange={onSlippageChange}
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

            {error && (
                <ErrorOverlay
                    title="Error"
                    message1={error}
                    message2="Please try again"
                    setError={setError}
                />
            )}
        </div>
    );
}
