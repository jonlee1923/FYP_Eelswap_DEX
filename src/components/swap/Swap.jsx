import React, { useContext, useState, useEffect } from "react";
import { EelswapContext } from "../../context/EelswapContext";
import AmountIn from "./AmountIn";
import AmountOut from "./AmountOut";
import FromBalance from "./FromBalance";
import ToBalance from "./ToBalance";
import SwapButton from "./SwapButton";
import LoadingSpinner from "../loading/LoadingSpinner";
import LoadingOverlay from "../loading/LoadingOverlay";
import Settings from "./settings/Settings";
import { WETH } from "../../utils/helpers";

export default function Swap(props) {
    const {
        connected,
        getPairs,
        getAvailableTokens,
        getCounterpartTokens,
        findPoolByTokens,
        addLiquidity,
        getTokenBalance,
        swapExactTokensForTokens,
        swapExactETHForTokens,
        swapExactTokensForETH,
        getOutputAmount,
    } = useContext(EelswapContext);

    const [loading, setLoading] = useState(false);
    const [fromToken, setFromToken] = useState("");
    const [toToken, setToToken] = useState("");
    const [fromAmount, setfromAmount] = useState("");
    const [opAmt, setOpAmt] = useState("");

    const [fromTokenName, setFromTokenName] = useState("");
    const [toTokenName, setToTokenName] = useState("");

    const [showSettings, setShowSettings] = useState(false);
    const [slippage, setSlippage] = useState("");
    const [deadline, setDeadline] = useState("10");

    let availableTokens = getAvailableTokens(props.pools);
    let counterpartTokens = getCounterpartTokens(props.pools, fromToken);
    let pairAddress = "";

    const [fromBalance, setFromBalance] = useState("");
    const [toBalance, setToBalance] = useState("");

    useEffect(() => {
        if (props.pools.length !== 0) {
            setFromToken(props.pools[0].token0Address);
            pairAddress =
                findPoolByTokens(props.pools, fromToken, toToken)?.address ??
                "";
        }
    }, []);

    const onSlippageChange = async (event) => {
        setSlippage(event.target.value);
    };

    const onDeadlineChange = async (event) => {
        setDeadline(event.target.value);
    };

    const getTimestampInSeconds = () => {
        return Math.floor(Date.now() / 1000);
    };

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    const fromTokenChange = (value) => {
        // console.log("from: ",value);
        setFromToken(value);
    };

    const toTokenChange = async (value) => {
        // console.log("to: ", value)
        setToToken(value);
    };

    const fromAmountChange = (event) => {
        console.log(event.target.value);
        setfromAmount(event.target.value);
    };

    const onClickSwap = async (event) => {
        setLoading(true);
        console.log(fromToken);
        console.log(toToken);
        console.log(fromAmount);
        let inputAmt = parseInt(fromAmount);

        let currentTime = getTimestampInSeconds();
        console.log(currentTime)

        currentTime += parseInt(deadline) * 60;
        console.log(currentTime);

        if (fromToken === WETH) {
            let token = toToken;

            // await swapExactETHForTokens(token, fromAmount, 1, currentTime);
            await swapExactETHForTokens(token, inputAmt, (100-slippage) / 100 * inputAmt, currentTime);

        } else {

            await swapExactTokensForTokens(
                fromToken,
                toToken,
                inputAmt,
                (100-slippage) / 100 * inputAmt,
                currentTime
            );
        }

        setLoading(false);
        setToToken("");
        setfromAmount("");
    };

    return props.loading || loading ? (
        <LoadingOverlay
            title={"Loading Transaction"}
            loading={props.loading || loading}
            message1={`Swapping ${fromAmount} ${fromTokenName} tokens for ${opAmt} ${toTokenName} tokens`}
            message2={"Please confirm your transaction in Metamask"}
        />
    ) : (
        <div className="flex-1 flex justify-start items-center flex-col w-full mt-10 mb-10">
            <div className="relative md:max-w-[700px] md:min-w-[500px] min-w-full max-w-full gradient-border p-[2px] rounded-3xl">
                <div className="w-full min-h-[400px] bg-swapBlack backdrop-blur-[4px] rounded-3xl shadow-card flex p-7">
                    <div className="flex-col w-full items-center mx-20">
                        <div className="flex flex-row text-white justify-end">
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

                        <div className="my-8">
                            <AmountIn
                                fromToken={fromToken}
                                onTokenChange={fromTokenChange}
                                availableTokens={availableTokens}
                                amount={fromAmount}
                                onAmountChange={fromAmountChange}
                                setTokenName={setToTokenName}
                            />
                            <FromBalance fromToken={fromToken} />
                        </div>

                        <div className="mb-8">
                            <AmountOut
                                fromAmount={fromAmount}
                                toToken={toToken}
                                fromToken={fromToken}
                                onTokenChange={toTokenChange}
                                counterpartTokens={counterpartTokens}
                                setOp={setOpAmt}
                                setTokenName={setToTokenName}
                            />
                            <ToBalance
                                fromToken={fromToken}
                                toToken={toToken}
                            />
                        </div>
                        {loading ? (
                            LoadingSpinner
                        ) : (
                            <SwapButton onClickSwap={onClickSwap} />
                        )}
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
                    </div>
                </div>
            </div>
        </div>
    );
}
