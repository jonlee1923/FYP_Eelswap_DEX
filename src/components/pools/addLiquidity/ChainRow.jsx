import React from "react";
import styles from "../../../styles";

export default function ChainRow(props) {
    console.log("chain",props.chain);
    console.log(props.activeChain)
    console.log(typeof props.activeChain, typeof props.chain[0])
    return (
        // <div className='text-white'>{props.chain[1]}</div>
        <li
            className={`flex items-center justify-between ${
                styles.currencyListItem
            } ${
                props.activeChain === props.chain[0]
                    ? "bg-green-600"
                    : "bg-black"
            } cursor-pointer`}
            onClick={() => {
                props.setActiveChain(props.chain[0]);
                props.toggleShowChain();
                props.onChange(props.chain[1]);
            }}
        >
            <div className="flex space-x-2 items-center">{props.chain[0]}</div>
        </li>
    );
}
