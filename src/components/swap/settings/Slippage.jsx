import React from "react";

export default function Slippage(props) {
    return (
        <div className="m-2">
            <label
                htmlFor="price"
                className="justify-start block text-sm font-medium text-gray-700"
            >
                Slippage Tolerance
            </label>
            <div className="relative mt-1 rounded-md ">

                <div className="flex flex-row">
                    <input
                        type="text"
                        name="time"
                        id="time"
                        className="shadow-sm block  rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="0.10"
                        onChange={props.onSlippageChange}
                        value={props.slippage}
                    />
                    <p className="ml-2">%</p>
                </div>
            </div>
        </div>
    );
}
