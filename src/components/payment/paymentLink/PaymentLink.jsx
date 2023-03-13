import React, { useState, useEffect, useContext } from "react";
import { EelswapContext } from "../../../context/EelswapContext";
import TokenIn from "./TokenIn";
import { QRCode } from "react-qrcode-logo";

// import TokenOut from "./TokenOut";

export default function PaymentLink(props) {
    const {
        connected,
        getPairs,
        getAvailableTokens,
        // getCounterpartTokens,
        findPoolByTokens,
    } = useContext(EelswapContext);
    const [amount, setAmount] = useState("");
    const [address, setAddress] = useState("");
    const [fromToken, setFromToken] = useState("");
    const [showQr, setShowQr] = useState(false);
    const [fromTokenName, setFromTokenName] = useState("");
    const [qrCodestring, setQrCodestring] = useState("");
    let availableTokens = getAvailableTokens(props.pools);
    let pairAddress = "";

    useEffect(() => {
        if (props.pools.length !== 0) {
            setFromToken(props.pools[0].token0Address);
        }
    }, []);

    const onAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const onAddressChange = (event) => {
        setAddress(event.target.value);
    };

    const fromTokenChange = (value) => {
        console.log("from: ",value);
        setFromToken(value);
    };

    const generateQr = () => {
        console.log("generateQr");
        setQrCodestring(
            // `https://eelswap.netlify.app/pay/${amount}/${address}/${fromToken}`
            `http://localhost:8888/pay/${amount}/${address}/${fromToken}`

        );
        setShowQr(true);
    };

    const resetQrcode = () => {
        console.log("resetQrcode");
        setQrCodestring("");
        setAddress("");
        setAmount("");
        setShowQr(false);
    };

    // const toTokenChange = async (value) => {
    //     // console.log("to: ", value)
    //     setToToken(value);
    // };

    // const getTokenData = async (address) => {
    //     console.log(address);
    //     await new Promise((resolve) => setTimeout(resolve, 1000)); // delay of 1 second (1000 milliseconds)
    //     const response = await fetch("/.netlify/functions/getToken", {
    //         method: "POST",
    //         body: JSON.stringify(address),
    //     });

    //     const responseBody = await response.json();
    //     return responseBody.data.tokens.values[0];
    // };

    return (
        <div className="flex justify-center h-full mb-16">
            <div className="flex-col bg-swapBlack h-full sm:h-7/8  w-5/12 rounded-lg p-8 m-8 space-y-6">
                <TokenIn
                    fromToken={fromToken}
                    onTokenChange={fromTokenChange}
                    availableTokens={availableTokens}
                    setTokenName={setFromTokenName}
                />

                <div className="relative mt-1 rounded-md text-white text-center">
                    <label htmlFor="" className="m-2">
                        Enter Payment Amount
                    </label>

                    <div className="flex flex-row p-2 border-[1px] border-transparent hover:border-slate-600 rounded-md bg-slate-800">
                        <input
                            type="text"
                            className=" block w-full pl-7 pr-12 sm:text-sm outline-none bg-transparent"
                            placeholder="10"
                            // onChange={props.onDeadlineChange}
                            // value={props.deadline}
                            onChange={onAmountChange}
                            value={amount}
                        />
                    </div>
                </div>

                <div className="relative mt-1 rounded-md text-white text-center">
                    <label htmlFor="" className="m-2">
                        Enter Recipient Address
                    </label>

                    <div className="flex flex-row p-2 border-[1px] border-transparent hover:border-slate-600 rounded-md bg-slate-800">
                        <input
                            type="text"
                            className=" block w-full pl-7 pr-12 sm:text-sm outline-none bg-transparent"
                            placeholder="0xabc123..."
                            // onChange={props.onDeadlineChange}
                            // value={props.deadline}
                            onChange={onAddressChange}
                            value={address}
                        />
                    </div>
                </div>
                <div className="flex justify-center mt-2">
                    {!showQr && (
                        <button
                            className="text-white bg-green-600 rounded-md p-2"
                            onClick={generateQr}
                        >
                            Generate QR code
                        </button>
                    )}
                </div>

                {showQr && (
                    <div className="flex flex-row items-center justify-around">
                        <button
                            className="text-white bg-green-600 rounded-md py-2 px-4"
                            onClick={resetQrcode}
                        >
                            Reset
                        </button>
                        <div className="flex-col text-white text-center">
                            <QRCode size={200} value={qrCodestring} />
                            <p>Or</p>
                            <a href={qrCodestring}  className="underline text-blue-500">
                                Click here
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
