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
        <div className="flex items-center flex-col w-full mt-10">
            <div className="relative w-3/4 gradient-border rounded-3xl">
                {/* swap this bg-swapblack to another colour to change bg colr */}
                <div className="w-full bg-swapBlack backdrop-blur-[4px] rounded-3xl shadow-card py-7">
                    <div className="flex-col w-full">
                        <div className="flex flex-col items-center">
                            <p className="text-white mb-6 font-poppins">
                                Create a liquidity pool or add liquidity to a
                                existing one!
                            </p>
                        </div>
                        <div className="flex flex-row w-full justify-around">
                            {/* <span className="text-white mt-2">Pools</span> */}
                            <button
                                className="text-white rounded-full bg-green-600 hover:bg-green-400 p-2"
                                onClick={toggle}
                            >
                                {showAddPool
                                    ? "Current positions"
                                    : "+ New position"}
                            </button>
                        </div>
                        <div className="">
                            {showAddPool ? (
                                <Pools
                                    pools={props.pools}
                                    activeChain={props.activeChain}
                                    setActiveChain={props.setActiveChain}
                                />
                            ) : (
                                <Positions />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
