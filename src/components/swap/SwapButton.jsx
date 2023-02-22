import React from "react";

export default function SwapButton(props) {
    return (
        <div className="flex w-full flex-row justify-center">
            <button
                className="text-white bg-green-600 text-lg rounded-full px-4 py-1"
                onClick={props.onClickSwap}
            >
                Swap
            </button>
        </div>
    );
}
