import React from "react";
import { useEffect, useState, useContext } from "react";
import { EelswapContext } from "../../../context/EelswapContext";
import LoadingSpinner from "../../loading/LoadingSpinner";
import { CurrencyDollarIcon } from "@heroicons/react/20/solid";
import ClosePositionOverlay from "./ClosePositionOverlay";
// import { Menu, Transition } from "@headlessui/react";

export default function Position(props) {
    const { getPairSymbols } = useContext(EelswapContext);
    const [pairSymbol, setPairSymbol] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showClosePositionOverlay, setShowClosePositionOverlay] = useState(false);
    
    useEffect(() => {
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
        setLoading(false);
    }, []);

    const onClickClosePosition = () => {
        setShowClosePositionOverlay(!showClosePositionOverlay)
    }

    

    return (
        <div>
            {showClosePositionOverlay && <ClosePositionOverlay />}
            {loading && <LoadingSpinner />}
            {!loading && pairSymbol && (
                <div className="lg:flex flex-col lg:items-center lg:justify-between my-6 mr-4">
                    <div className="border-t-2 border-white w-full mb-6"></div>
                    <div className="flex flex-row">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
                                {pairSymbol[0]} / {pairSymbol[1]}
                            </h2>
                            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <CurrencyDollarIcon
                                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    {pairSymbol[0]} amount:{" "}
                                    {props.position["token1Amount"]}
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <CurrencyDollarIcon
                                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    {pairSymbol[1]} amount:{" "}
                                    {props.position["token2Amount"]}
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 flex lg:mt-0 lg:ml-4">
                            <span className="hidden sm:block m-2">
                                Liquidity: {props.position["liquidity"]}
                            </span>
                            <span className="hidden sm:block">
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    {/* <PencilIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" /> */}
                                    Status:{" "}
                                    {props.position["open"] ? "Open" : "Closed"}
                                </button>
                            </span>

                            <span className="sm:ml-3">
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    onClick={()=>
                                        {onClickClosePosition()}
                                        // props.closePosition(
                                        //     props.position["pairAddress"],
                                        //     props.position["token1Address"],
                                        //     props.position["token2Address"],
                                        //     parseInt(
                                        //         props.position["liquidity"] *
                                        //             0.5
                                        //     ),
                                        //     props.position["token1Amount"],
                                        //     props.position["token2Amount"],
                                        //     1683487766
                                        // );
                                    }
                                >
                                    {/* <CheckIcon
                                    className="-ml-1 mr-2 h-5 w-5"
                                    aria-hidden="true"
                                /> */}
                                    Close
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
