import React from "react";
import { useEffect, useState, useContext } from "react";
import { EelswapContext } from "../../../context/EelswapContext";
import Position from "./Position";
import LoadingSpinner from "../../loading/LoadingSpinner";

export default function Positions() {
    const [positions, setPositions] = useState(null);
    const { connected, removeLiquidity, removeLiquidityETH } =
        useContext(EelswapContext);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        const response = await fetch("/.netlify/functions/getPositions", {
            method: "POST",
            body: JSON.stringify(connected),
        });

        const responseBody = await response.json();
        console.log(responseBody.data.positions.values)
        setPositions(responseBody.data.positions.values);
    };

    const closePosition = async (
        pair,
        token1,
        token2,
        liquidity,
        amount1Min,
        amount2Min,
        deadline
    ) => {
        setLoading(true);
        await removeLiquidity(
            pair,
            token1,
            token2,
            liquidity,
            amount1Min,
            amount2Min,
            deadline
        );

        console.log('done');
        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        fetchData();
        setLoading(false);
    }, []);

    return (
        <div className="mt-10 flex flex-row w-full justify-center">
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="text-white overflow-y-scroll">
                    {positions &&
                        Object.entries(positions).map((position, index) => (
                            <Position
                                key={index}
                                position={position[1]}
                                closePosition={closePosition}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}
