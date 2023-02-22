import React from "react";

export default function Deadline(props) {
    return (
        <div className="m-2">
            <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
            >
                Transaction Deadline
            </label>
            <div className="relative mt-1 rounded-md ">
                {/* <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                </div> */}
                <div className="flex flex-row">
                    <input
                        type="text"
                        name="time"
                        id="time"
                        className="shadow-sm block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
