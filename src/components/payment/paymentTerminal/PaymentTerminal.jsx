import React, { useState, useEffect, useContext } from "react";
import { EelswapContext } from "../../../context/EelswapContext";
import TokenOut from "./TokenOut";
import { WETH } from "../../../utils/helpers";
import { useParams } from "react-router-dom";
import LoadingOverlay from "../../loading/LoadingOverlay";
import SuccessOverlay from "../../loading/LoadingOverlay";
import ErrorOverlay from "../../loading/LoadingOverlay";

export default function PaymentTerminal(props) {
    const { opAmt, recieverAddress, toToken } = useParams();

    const {
        connected,
        getPairs,
        getAvailableTokens,
        getCounterpartTokens,
        findPoolByTokens,
        getInputAmount,
        chainSwitcher,
        getWrappedBscTokenAddressETH,
        lockBscToken,
        swapExactTokensForTokens,
        swapExactETHForTokens,
        swapExactTokensForETH,
        burnWrappedTokens,
    } = useContext(EelswapContext);

    const [loading, setLoading] = useState(false);
    const [fromToken, setfromToken] = useState("");
    const [fromTokenName, setFromTokenName] = useState("");
    const [toTokenName, setToTokenName] = useState("");
    const [slippage, setSlippage] = useState("");
    const [deadline, setDeadline] = useState("");
    const [finalInputAmount, setFinalInputAmount] = useState("");
    const [finalOutAmount, setFinalOutAmount] = useState("");
    const [showError, setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showEndMsg, setShowEndMsg] = useState(false);
    const [amountIn, setAmountIn] = useState("0");

    // let pairAddress = "";
    let counterpartTokens = getCounterpartTokens(props.pools, toToken);

    // console.log(opAmt, recieverAddress, fromToken);
    useEffect(() => {
        setAmountIn("0");
        // if (props.pools.length !== 0) {
        //     pairAddress =
        //         findPoolByTokens(props.pools, fromToken, toToken)?.address ??
        //         "";
        // }
    }, []);

    useEffect(() => {
        onTokenSelect();
    }, [fromToken]);

    const fromTokenChange = async (value) => {
        console.log(value);
        setfromToken(value);
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

    const getTimestampInSeconds = () => {
        const now = new Date();
        return Math.floor(now.getTime() / 1000);
    };

    const onTokenSelect = async () => {
        if (toToken !== undefined && toToken !== "") {
            let value = await getInputAmount(opAmt, fromToken, toToken);
            console.log(value);
            // if (!Number.isNan(value)) {
            if( typeof value === 'string'){
                setAmountIn(parseInt(value));
            }
        }
    };

    const onClickSwap = async (event) => {
        setLoading(true);
        console.log(fromToken);
        console.log(toToken);
        let paymentToken = fromToken;
        let recieveToken = toToken;
        let currentTime = getTimestampInSeconds();
        console.log(currentTime);

        try {
            //Cross chain for tokenIN
            let paymentTokenData = await getTokenData(paymentToken);
            let amountOut;

            //calculate amountIn according to what path params is for output amount
            // let amountIn = await getInputAmount(opAmt, paymentToken, toToken);

            if (!paymentTokenData["eth"]) {
                console.log("bsc token found");
                let bscAddress = await getWrappedBscTokenAddressETH(
                    paymentToken
                );
                await chainSwitcher(97);
                await lockBscToken(bscAddress, amountIn);
                await chainSwitcher(5);
            }

            let defaultSlippage = 0;
            let defaultDeadline = 10;
            let finalDeadline;
            let finalSlippage;

            if (slippage === "") {
                finalSlippage = defaultSlippage;
                console.log(finalSlippage);
            }
            if (deadline === "") {
                currentTime += parseInt(defaultDeadline) * 60;
                console.log(currentTime);
                finalDeadline = currentTime;
            } else {
                currentTime += parseInt(deadline) * 60;
                console.log(currentTime);
                finalDeadline = currentTime;
            }

            if (paymentToken === WETH) {
                let token = recieveToken;
                amountOut = await swapExactETHForTokens(
                    token,
                    amountIn,
                    Math.floor(((100 - finalSlippage) / 100) * opAmt),
                    finalDeadline,
                    recieverAddress
                );
            } else {
                console.log(Math.floor(((100 - finalSlippage) / 100) * opAmt));
                amountOut = await swapExactTokensForTokens(
                    paymentToken,
                    recieveToken,
                    amountIn,
                    Math.floor(((100 - finalSlippage) / 100) * opAmt),
                    // amountOut,
                    finalDeadline,
                    recieverAddress
                );
            }
            setFinalInputAmount(amountIn);
            setFinalOutAmount(amountOut);
            // cross chain for tokenOut1
            let recieveTokenData = await getTokenData(recieveToken);
            if (!recieveTokenData["eth"]) {
                console.log("recieveToken is bsc token");
                console.log(amountOut);
                burnWrappedTokens(recieveTokenData["address"], amountOut);
            }

            setLoading(false);
            setfromToken("");
            // setFromAmount("");
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
    return (
        <div className="flex justify-center h-screen">
            <div className="flex-col bg-swapBlack h-2/5 sm:h-3/5 w-4/5 sm:w-1/2 rounded-lg p-8 m-8 mt-16 space-y-8">
                {/* <div className=""> */}
                <TokenOut
                    toToken={toToken}
                    fromToken={fromToken}
                    onTokenChange={fromTokenChange}
                    counterpartTokens={counterpartTokens}
                    setTokenName={setFromTokenName}
                    onTokenSelect={onTokenSelect}
                />
                {/* </div> */}
                <div className="text-white text-lg">Amount: {amountIn}</div>
                <div className="flex-col">
                    <p className="flex text-white text-lg ">To:</p>
                    <p className="flex text-white text-sm sm:text-lg truncate ...">
                        {recieverAddress}
                    </p>
                </div>
                <div className="flex justify-center">
                    <button
                        className="bg-green-600 rounded-md text-white px-8 py-2"
                        onClick={onClickSwap}
                    >
                        Pay!
                    </button>
                </div>
                {loading && (
                    <LoadingOverlay
                        title={"Loading Transaction"}
                        loading={props.loading || loading}
                        message1={`Paying recipient ${recieverAddress} ${toTokenName} tokens`}
                        message2={"Please confirm your transaction in Metamask"}
                    />
                )}
                {showEndMsg && (
                    <SuccessOverlay
                        title={"Please wait for your transaction to complete"}
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
    );
}

// import React, { useState, useEffect, useContext } from "react";
// import { EelswapContext } from "../../../context/EelswapContext";
// import TokenOut from "./TokenOut";
// import { WETH } from "../../../utils/helpers";
// import { useParams } from "react-router-dom";
// import LoadingOverlay from "../../loading/LoadingOverlay";
// import SuccessOverlay from "../../loading/LoadingOverlay";
// import ErrorOverlay from "../../loading/LoadingOverlay";

// export default function PaymentTerminal(props) {
//     const { opAmt, recieverAddress, fromToken } = useParams();

//     const {
//         connected,
//         getPairs,
//         getAvailableTokens,
//         getCounterpartTokens,
//         findPoolByTokens,
//         getInputAmount,
//         chainSwitcher,
//         getWrappedBscTokenAddressETH,
//         lockBscToken,
//         swapExactTokensForTokens,
//         swapExactETHForTokens,
//         swapExactTokensForETH,
//         burnWrappedTokens,
//     } = useContext(EelswapContext);

//     const [loading, setLoading] = useState(false);
//     const [toToken, setToToken] = useState("");
//     const [fromTokenName, setFromTokenName] = useState("");
//     const [toTokenName, setToTokenName] = useState("");
//     const [slippage, setSlippage] = useState("");
//     const [deadline, setDeadline] = useState("");
//     const [finalInputAmount, setFinalInputAmount] = useState("");
//     const [finalOutAmount, setFinalOutAmount] = useState("");
//     const [showError, setShowError] = useState(false);
//     const [errorMsg, setErrorMsg] = useState("");
//     const [showEndMsg, setShowEndMsg] = useState(false);
//     const [amountIn, setAmountIn] = useState("0");

//     let pairAddress = "";
//     let counterpartTokens = getCounterpartTokens(props.pools, fromToken);

//     // console.log(opAmt, recieverAddress, fromToken);
//     useEffect(() => {
//         setAmountIn("0");
//         if (props.pools.length !== 0) {
//             pairAddress =
//                 findPoolByTokens(props.pools, fromToken, toToken)?.address ??
//                 "";
//         }
//     }, []);

//     useEffect(() => {
//         onTokenSelect();
//     }, [toToken]);

//     const toTokenChange = async (value) => {
//         console.log(value);
//         setToToken(value);
//     };

//     const getTokenData = async (address) => {
//         console.log(address);
//         await new Promise((resolve) => setTimeout(resolve, 1000)); // delay of 1 second (1000 milliseconds)
//         const response = await fetch("/.netlify/functions/getToken", {
//             method: "POST",
//             body: JSON.stringify(address),
//         });

//         const responseBody = await response.json();
//         return responseBody.data.tokens.values[0];
//     };

//     const getTimestampInSeconds = () => {
//         const now = new Date();
//         return Math.floor(now.getTime() / 1000);
//     };

//     const onTokenSelect = async () => {
//         if (toToken !== undefined && toToken !== "") {
//             let value = await getInputAmount(opAmt, fromToken, toToken);
//             console.log(value);
//             setAmountIn(parseInt(value));
//         }
//     };

//     const onClickSwap = async (event) => {
//         setLoading(true);
//         console.log(fromToken);
//         console.log(toToken);
//         let paymentToken = toToken;
//         let recieveToken = fromToken;
//         let currentTime = getTimestampInSeconds();
//         console.log(currentTime);

//         try {
//             //Cross chain for tokenIN
//             let paymentTokenData = await getTokenData(paymentToken);
//             let amountOut;

//             //calculate amountIn according to what path params is for output amount
//             // let amountIn = await getInputAmount(opAmt, paymentToken, toToken);

//             if (!paymentTokenData["eth"]) {
//                 console.log("bsc token found");
//                 let bscAddress = await getWrappedBscTokenAddressETH(
//                     paymentToken
//                 );
//                 await chainSwitcher(97);
//                 await lockBscToken(bscAddress, amountIn);
//                 await chainSwitcher(5);
//             }

//             let defaultSlippage = 0;
//             let defaultDeadline = 10;
//             let finalDeadline;
//             let finalSlippage;

//             if (slippage === "") {
//                 finalSlippage = defaultSlippage;
//                 console.log(finalSlippage);
//             }
//             if (deadline === "") {
//                 currentTime += parseInt(defaultDeadline) * 60;
//                 console.log(currentTime);
//                 finalDeadline = currentTime;
//             } else {
//                 currentTime += parseInt(deadline) * 60;
//                 console.log(currentTime);
//                 finalDeadline = currentTime;
//             }

//             if (paymentToken === WETH) {
//                 let token = recieveToken;
//                 amountOut = await swapExactETHForTokens(
//                     token,
//                     amountIn,
//                     Math.floor(((100 - finalSlippage) / 100) * opAmt),
//                     finalDeadline,
//                     recieverAddress
//                 );
//             } else {
//                 console.log(Math.floor(((100 - finalSlippage) / 100) * opAmt));
//                 amountOut = await swapExactTokensForTokens(
//                     paymentToken,
//                     recieveToken,
//                     amountIn,
//                     Math.floor(((100 - finalSlippage) / 100) * opAmt),
//                     // amountOut,
//                     finalDeadline,
//                     recieverAddress
//                 );
//             }
//             setFinalInputAmount(amountIn);
//             setFinalOutAmount(amountOut);
//             // cross chain for tokenOut1
//             let recieveTokenData = await getTokenData(recieveToken);
//             if (!recieveTokenData["eth"]) {
//                 console.log("recieveToken is bsc token");
//                 console.log(amountOut);
//                 burnWrappedTokens(recieveTokenData["address"], amountOut);
//             }

//             setLoading(false);
//             setToToken("");
//             // setFromAmount("");
//             setShowEndMsg(true);
//             setSlippage("");
//             setDeadline("");
//         } catch (e) {
//             console.log(e.message);
//             setLoading(false);
//             setErrorMsg(e.message);
//             setShowError(true);
//             setSlippage("");
//             setDeadline("");
//         }
//     };
//     return (
//         <div className="flex justify-center h-screen">
//             <div className="flex-col bg-swapBlack h-2/5 sm:h-3/5 w-4/5 sm:w-1/2 rounded-lg p-8 m-8 mt-16 space-y-8">
//                 <div className="">
//                     <TokenOut
//                         toToken={toToken}
//                         fromToken={fromToken}
//                         onTokenChange={toTokenChange}
//                         counterpartTokens={counterpartTokens}
//                         setTokenName={setToTokenName}
//                         onTokenSelect={onTokenSelect}
//                     />
//                 </div>
//                 <div className="text-white text-lg">Amount: {amountIn}</div>
//                 <div className="flex-col">
//                     <p className="flex text-white text-lg ">To:</p>
//                     <p className="flex text-white text-sm sm:text-lg truncate ...">
//                         {recieverAddress}
//                     </p>
//                 </div>
//                 <div className="flex justify-center">
//                     <button
//                         className="bg-green-600 rounded-md text-white px-8 py-2"
//                         onClick={onClickSwap}
//                     >
//                         Pay!
//                     </button>
//                 </div>
//                 {loading && (
//                     <LoadingOverlay
//                         title={"Loading Transaction"}
//                         loading={props.loading || loading}
//                         message1={`Paying recipient ${recieverAddress} with ${toTokenName} tokens`}
//                         message2={"Please confirm your transaction in Metamask"}
//                     />
//                 )}
//                 {showEndMsg && (
//                     <SuccessOverlay
//                         title={"Please wait for your transaction to complete"}
//                         loading={loading}
//                         message1={`Successfully swapped ${finalInputAmount} ${fromTokenName} tokens for ${finalOutAmount} ${toTokenName} tokens`}
//                         message2={``}
//                         setShowEndMsg={setShowEndMsg}
//                     />
//                 )}
//                 {showError && (
//                     <ErrorOverlay
//                         title="Error"
//                         message1={errorMsg}
//                         message2="Please try again"
//                         setError={setShowError}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// }
