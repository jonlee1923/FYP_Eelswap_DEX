import React from "react";

export default function Slippage(props) {
    return (
        <div className="m-2">
            <label
                htmlFor="price"
                className="justify-start block text-sm font-medium"
            >
                Slippage Tolerance
            </label>
            <div className="relative mt-1 rounded-md ">
                <div className="flex flex-row p-2 border-[1px] border-transparent hover:border-slate-600 rounded-md bg-slate-800">
                    <input
                        type="text"
                        name="time"
                        id="time"
                        className=" block rounded-md outline-none pl-7 pr-12 bg-transparent sm:text-sm"
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
