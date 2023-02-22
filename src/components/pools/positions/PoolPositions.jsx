import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Positions from "./Positions";
import Pools from "../addLiquidity/Pools";

export default function PoolPositions(props) {
    const [showAddPool, setShowAddPool] = useState(false);

    const toggle = () => {
        setShowAddPool(!showAddPool);
    };

    return (
        <div className="flex items-center flex-col w-full my-10">
            <div className="relative md:max-w-[1000px] md:min-w-[500px] min-w-full max-w-full gradient-border p-[2px] rounded-3xl">
                {/* swap this bg-swapblack to another colour to change bg colr */}
                <div className="w-full min-h-[400px] bg-swapBlack backdrop-blur-[4px] rounded-3xl shadow-card flex p-7">
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col items-center">
                            <p className="text-white mb-6 font-poppins">
                                Create a liquidity pool or add liquidity to a
                                existing one!
                            </p>
                        </div>

                        <div className="flex flex-row w-full justify-between">
                            <span className="text-white mt-2">Pools</span>
                            <button
                                className="text-white rounded-full bg-green-600 hover:bg-green-400 p-2"
                                onClick={toggle}
                            >
                                {showAddPool ? "Current positions":"+ New position"}
                            </button>
                        </div>
                        {showAddPool ? (
                            <Pools pools={props.pools} />
                        ) : (
                            <Positions />
                        )}
                        {/* <Pools pools={props.pools}/> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
