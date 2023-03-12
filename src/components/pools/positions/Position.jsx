import React from "react";
import { useEffect, useState, useContext } from "react";
import { EelswapContext } from "../../../context/EelswapContext";
import LoadingSpinner from "../../loading/LoadingSpinner";
// import { CurrencyDollarIcon } from "@heroicons/react/20/solid";
import ClosePositionOverlay from "./ClosePositionOverlay";
// import { Menu, Transition } from "@headlessui/react";

export default function Position(props) {
    const { getPairSymbols } = useContext(EelswapContext);
    const [pairSymbol, setPairSymbol] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showClosePositionOverlay, setShowClosePositionOverlay] =
        useState(false);
    // const [logo1, setLogo1] = useState("");
    // const [logo2, setLogo2] = useState("");
    const [amount, setAmount] = useState(null);
    const [slippage, setSlippage] = useState("");
    const [deadline, setDeadline] = useState("");
    useEffect(() => {
        console.log(props.position);

        const fetchData = async () => {
            let symbolArr = await getPairSymbols(
                props.position["token1Address"],
                props.position["token2Address"]
            );
            setPairSymbol(symbolArr);
            // console.log(pairSymbol);
        };
        setLoading(true);
        fetchData();
        // setLogos();
        setLoading(false);
    }, []);
    const onSlippageChange = async (event) => {
        setSlippage(event.target.value);
    };

    const onDeadlineChange = async (event) => {
        setDeadline(event.target.value);
    };

    const onClickClosePosition = () => {
        setShowClosePositionOverlay(!showClosePositionOverlay);
    };

    const getTimestampInSeconds = () => {
        const now = new Date();
        return Math.floor(now.getTime() / 1000);
    };

    const submitClosePosition = async () => {
        props.setLoading(true);
        // let tokenData1 = await getTokenData(props.position["token1Address"])
        // let tokenData2 = await getTokenData(props.position["token2Address"])

        let defaultSlippage = 50;
        let defaultDeadline = 10;
        let currentTime = getTimestampInSeconds();

        let finalSlippage;
        let finalDeadline;

        if (slippage === "") {
            finalSlippage = defaultSlippage;
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

        await props.closePosition(
            props.position["pairAddress"],
            props.position["token1Address"],
            props.position["token2Address"],
            props.position["liquidity"],
            // 1,
            // 1,
            // 1699586187,
            Math.floor(
                ((100 - finalSlippage) / 100) *
                    (amount / props.position["liquidity"]) *
                    props.position["token1Amount"]
            ),
            Math.floor(
                ((100 - finalSlippage) / 100) *
                    (amount / props.position["liquidity"]) *
                    props.position["token2Amount"]
            ),
            finalDeadline,
            amount,
            props.position["open"],
            pairSymbol,
            // tokenData1,
            // tokenData2,
            props.position["token1Amount"],
            props.position["token2Amount"]
        );
        await props.fetchData();
    };

    // const getTokenData = async (address) => {
    //     const response = await fetch("/.netlify/functions/getToken", {
    //         method: "POST",
    //         body: JSON.stringify(address),
    //     });

    //     const responseBody = await response.json();
    //     return responseBody.data.tokens.values[0];
    // };

    // const setLogos = async () => {
    //     const lg1 = await getTokenData(props.position["token1Address"]);
    //     const lg2 = await getTokenData(props.position["token2Address"]);
    //     setLogo1(lg1["imageURL"]);
    //     setLogo2(lg2["imageURL"]);
    // };

    const toggleOverlay = () => {
        setShowClosePositionOverlay(!showClosePositionOverlay);
    };

    return (
        <div>
            {showClosePositionOverlay && (
                <ClosePositionOverlay
                    closePosition={submitClosePosition}
                    amount={amount}
                    setAmount={setAmount}
                    toggleOverlay={toggleOverlay}
                    deadline={deadline}
                    slippage={slippage}
                    onDeadlineChange={onDeadlineChange}
                    onSlippageChange={onSlippageChange}
                />
            )}
            {loading && <LoadingSpinner />}
            {!loading && pairSymbol && (
                <div className="flex-col my-6 mr-4">
                    <div className="border-t-2 border-white w-full mb-6"></div>
                    <div className="flex flex-col">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
                                {pairSymbol[0]} / {pairSymbol[1]}
                            </h2>
                        </div>
                        <div className="mt-5 flex items-center">
                            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6 items-center">
                                <div className="flex items-center text-sm text-gray-100">
                                    <img
                                        className="h-8 mr-2"
                                        // src={logo1}
                                        src={props.position["token1ImageUrl"]}
                                        alt=""
                                    />
                                    {pairSymbol[0]} Amount:{" "}
                                    {props.position["token1Amount"]}
                                </div>
                                <div className="flex items-center text-sm text-gray-100">
                                    <img
                                        className="h-8 mr-2"
                                        // src={logo2}
                                        src={props.position["token2ImageUrl"]}
                                        alt=""
                                    />
                                    {pairSymbol[1]} Amount:{" "}
                                    {props.position["token2Amount"]}
                                </div>
                                <div className="">
                                    Liquidity: {props.position["liquidity"]}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between mt-8">
                            <button
                                type="button"
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                {/* <PencilIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" /> */}
                                Status:{" "}
                                {props.position["open"] ? "Open" : "Closed"}
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                onClick={() => {
                                    onClickClosePosition();
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
