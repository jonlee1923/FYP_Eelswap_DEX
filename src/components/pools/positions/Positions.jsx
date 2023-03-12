import React from "react";
import { useEffect, useState, useContext } from "react";
import { EelswapContext } from "../../../context/EelswapContext";
import Position from "./Position";
import LoadingSpinner from "../../loading/LoadingSpinner";
import LoadingOverlay from "../../loading/LoadingOverlay";
import SuccessOverlay from "../../loading/SuccessOverlay";
import ErrorOverlay from "../../error/ErrorOverlay";

export default function Positions() {
    const [positions, setPositions] = useState(null);
    const {
        connected,
        removeLiquidity,
        removeLiquidityETH,
        burnWrappedTokens,
    } = useContext(EelswapContext);
    const [loading, setLoading] = useState(false);
    const [showEndMsg, setShowEndMsg] = useState(false);
    const [startup, setStartup] = useState(true);
    //For displaying messages
    const [pair, setPair] = useState(null);
    const [msgAmount, setMsgAmount] = useState("");
    const [tokenAmounts, setTokenAmounts] = useState([]);
    const [showError, setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const fetchData = async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // delay of 1 second (1000 milliseconds)
        
        const response = await fetch("/.netlify/functions/getPositions", {
            method: "POST",
            body: JSON.stringify(connected),
        });

        const responseBody = await response.json();
        console.log(responseBody.data.liquidityPositions.values);
        setPositions(responseBody.data.liquidityPositions.values);
        setLoading(false);
        setStartup(false);
    };

    const getTokenData = async (address) => {
        const response = await fetch("/.netlify/functions/getToken", {
            method: "POST",
            body: JSON.stringify(address),
        });

        const responseBody = await response.json();
        console.log(responseBody)
        return responseBody.data.tokens.values[0];
    };

    const closePosition = async (
        pair,
        token1,
        token2,
        liquidity,
        amount1Min,
        amount2Min,
        deadline,
        amount,
        open,
        pairSymbol,
        // tokenData1,
        // tokenData2,
        token1Amount,
        token2Amount
    ) => {
        try {
            console.log(amount1Min,amount2Min,deadline)
            setLoading(true);
            // these values are the amounts which have been redeemed by the user after removing liquidity
            const [amount1, amount2, pairAddr] = await removeLiquidity(
                pair,
                token1,
                token2,
                amount,
                amount1Min,
                amount2Min,
                deadline
            );
            setMsgAmount(amount);
            setPair(pairSymbol);
            setTokenAmounts([amount1, amount2]);

            await new Promise((resolve) => setTimeout(resolve, 2000)); // delay of 1 second (1000 milliseconds)


            console.log("done");
            liquidity -= amount;

            // updated position must have the current value inside subtracted by amounts received from removeLiquidity function
            let dict = {
                address: connected,
                liquidity: liquidity,
                pairAddress: pair,
                open: open,
                token1Amount: token1Amount - amount1,
                token2Amount: token2Amount - amount2,
                // date: date,
                // time: time,
            };

            await updatePosition(dict);

            // cross chain back to bsc if needed

            let tokenData1 = await getTokenData(token1)
            await new Promise((resolve) => setTimeout(resolve, 1000)); // delay of 1 second (1000 milliseconds)
            let tokenData2 = await getTokenData(token2)

            if (!tokenData1["eth"]) {
                console.log("cross chain 1");
                console.log(tokenData1);
                await burnWrappedTokens(tokenData1["address"], amount1);
            }

            if (!tokenData2["eth"]) {
                console.log("cross chain 2");
                await burnWrappedTokens(tokenData2["address"], amount2);
            }

            setLoading(false);
            setShowEndMsg(true);
        } catch (err) {
            setLoading(false);
            setErrorMsg("Please try again later")
            setShowError(true)
            console.log(err);
        }
    };

    const updatePosition = async (dict) => {
        const response = await fetch("/.netlify/functions/updatePosition", {
            method: "POST",
            body: JSON.stringify(dict),
        });

        const responseBody = await response.json();
        console.log(responseBody.data);
    };

    useEffect(() => {
        // setLoading(true);
        fetchData();
        // setLoading(false);
    }, []);

    return (
        <div className="mt-10 flex w-full justify-center">
            {loading ? (
                pair ? (
                    <div className="relative">
                        <LoadingOverlay
                            title={
                                "Please wait for your transaction to complete"
                            }
                            loading={loading}
                            message1={`Redemption of ${msgAmount} liquidity tokens from ${pair[0]} / ${pair[1]} pool position`}
                            message2={
                                "Please confirm your transaction in Metamask"
                            }
                        />
                    </div>
                ) : startup ? (
                    <div className="relative">
                        {/* <LoadingSpinner /> */}
                        <LoadingOverlay
                            title={"Loading"}
                            loading={loading}
                            message1="Please wait"
                            message2=""
                        />
                    </div>
                ) : (
                    <div className="relative">
                        <LoadingOverlay
                            title={"Loading"}
                            loading={loading}
                            message1="Please wait"
                            message2="Please confirm your transactions in Metamask"
                        />
                    </div>
                )
            ) : (
                <div className="w-4/5 text-white overflow-y-scroll max-h-56 sm:max-h-96">
                    {positions &&
                        Object.entries(positions).map((position, index) => (
                            <Position
                                key={index}
                                position={position[1]}
                                closePosition={closePosition}
                                fetchData={fetchData}
                                setLoading={setLoading}
                            />
                        ))}
                    {/* loading && startup <div><LoadingSpinner/></div> */}
                    {showEndMsg && (
                        <div className="relative">
                            <SuccessOverlay
                                title={
                                    "Please wait for your transaction to complete"
                                }
                                loading={loading}
                                message1={`Redeemed ${msgAmount} liquidity tokens from ${pair[0]} / ${pair[1]} pool position`}
                                message2={`${tokenAmounts[0]} tokens from ${pair[0]} and ${tokenAmounts[1]} tokens from ${pair[1]} `}
                                setShowEndMsg={setShowEndMsg}
                            />
                        </div>
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
            )}
        </div>
    );
}
