import React from "react";

export default function Deadline(props) {
    return (
        <div className="m-2">
            <label
                htmlFor="price"
                className="block text-sm font-medium"
            >
                Transaction Deadline
            </label>
            <div className="relative mt-1 rounded-md ">
                <div className="flex flex-row p-2 border-[1px] border-transparent hover:border-slate-600 rounded-md bg-slate-800">
                    <input
                        type="text"
                        name="time"
                        id="time"
                        className=" block w-full pl-7 pr-12 sm:text-sm outline-none bg-transparent"
                        placeholder="10"
                        onChange={props.onDeadlineChange}
                        value={props.deadline}
                    />
                    <p className="ml-2">Minutes</p>
                </div>
            </div>
        </div>
    );
}
