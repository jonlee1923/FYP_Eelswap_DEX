import React, { useContext, useState, useEffect } from "react";
import { EelswapContext } from "../../context/EelswapContext";
import AmountIn from "./AmountIn";
import AmountOut from "./AmountOut";
import FromBalance from "./FromBalance";
import ToBalance from "./ToBalance";
import SwapButton from "./SwapButton";
import LoadingSpinner from "../loading/LoadingSpinner";
import LoadingOverlay from "../loading/LoadingOverlay";
import Settings from "../settings/Settings";
import { WETH } from "../../utils/helpers";
import SuccessOverlay from "../loading/SuccessOverlay";
import ErrorOverlay from "../error/ErrorOverlay";

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
        lockBscToken,
        getWrappedBscTokenAddressETH,
        chainSwitcher,
        burnWrappedTokens,
    } = useContext(EelswapContext);

    const [loading, setLoading] = useState(false);
    const [fromToken, setFromToken] = useState("");
    const [toToken, setToToken] = useState("");
    const [fromAmount, setfromAmount] = useState("");
    const [opAmt, setOpAmt] = useState("");
    const [showEndMsg, setShowEndMsg] = useState(false);
    const [fromTokenName, setFromTokenName] = useState("");
    const [toTokenName, setToTokenName] = useState("");

    const [showSettings, setShowSettings] = useState(false);
    const [slippage, setSlippage] = useState("");
    const [deadline, setDeadline] = useState("");
    const [finalInputAmount, setFinalInputAmount] = useState("");
    const [finalOutAmount, setFinalOutAmount] = useState("");

    let availableTokens = getAvailableTokens(props.pools);
    let counterpartTokens = getCounterpartTokens(props.pools, fromToken);
    let pairAddress = "";

    const [fromBalance, setFromBalance] = useState("");
    const [toBalance, setToBalance] = useState("");
    const [showError, setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

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
        const now = new Date();
        return Math.floor(now.getTime() / 1000);
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

    const getTokenData = async (address) => {
        console.log(address);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // delay of 1 second (1000 milliseconds)
        const response = await fetch("/.netlify/functions/getToken", {
            method: "POST",
            body: JSON.stringify(address),
        });

        const responseBody = await response.json();
        return responseBody.data.tokens.values[0];
    };

    const onClickSwap = async (event) => {
        setLoading(true);
        console.log(fromToken);
        console.log(toToken);
        console.log(fromAmount);
        let inputAmt = parseInt(fromAmount);

        let currentTime = getTimestampInSeconds();
        console.log(currentTime);

        try {
            //Cross chain for tokenIN
            let fromTokenData = await getTokenData(fromToken);
            let amountOut;

            if (!fromTokenData["eth"]) {
                console.log("bsc token found");
                let bscAddress = await getWrappedBscTokenAddressETH(fromToken);
                await chainSwitcher(97);
                await lockBscToken(bscAddress, inputAmt);
                await chainSwitcher(5);
            }

            let defaultSlippage = 50;
            let defaultDeadline = 10;
            let finalDeadline
            let finalSlippage

            if (slippage === "") {
                finalSlippage = defaultSlippage
            }
            if (deadline === "") {
                currentTime += parseInt(defaultDeadline) * 60;
                console.log(currentTime);
                finalDeadline = currentTime
            } else {
                currentTime += parseInt(deadline) * 60;
                console.log(currentTime);
                finalDeadline = currentTime
            }

            if (fromToken === WETH) {
                let token = toToken;

                // await swapExactETHForTokens(token, fromAmount, 1, currentTime);
                // await swapExactETHForTokens(token, inputAmt, (100-slippage) / 100 * inputAmt, currentTime);

                amountOut = await swapExactETHForTokens(
                    token,
                    inputAmt,
                    Math.floor(((100 - finalSlippage) / 100) * inputAmt),
                    finalDeadline,
                    connected
                );
            } else {
                amountOut = await swapExactTokensForTokens(
                    fromToken,
                    toToken,
                    inputAmt,
                    Math.floor(((100 - finalSlippage) / 100) * inputAmt),
                    finalDeadline,
                    connected
                );
            }
            setFinalInputAmount(inputAmt);
            setFinalOutAmount(amountOut);
            // cross chain for tokenOut1
            let toTokenData = await getTokenData(toToken);
            if (!toTokenData["eth"]) {
                console.log("toToken is bsc token");
                console.log(amountOut);
                burnWrappedTokens(toTokenData["address"], amountOut);
            }

            setLoading(false);
            setToToken("");
            setfromAmount("");
            setShowEndMsg(true);
            setSlippage("");
            setDeadline("");
        } catch (e) {
            console.log(e.message);
            setLoading(false);
            setErrorMsg(e.message);
            setShowError(true);
            setSlippage("");
            setDeadline("");
        }
    };

    // useEffect(() => {

    // }, [onClickSwap])

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
                                setTokenName={setFromTokenName}
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
                        {showEndMsg && (
                            <SuccessOverlay
                                title={
                                    "Please wait for your transaction to complete"
                                }
                                loading={loading}
                                message1={`Successfully swapped ${finalInputAmount} ${fromTokenName} tokens for ${finalOutAmount} ${toTokenName} tokens`}
                                message2={``}
                                setShowEndMsg={setShowEndMsg}
                            />
                        )}
                        {showError && (
                            <ErrorOverlay
                                title="Error"
                                message1={errorMsg}
                                message2="Please try again"
                                setError={setShowError}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
