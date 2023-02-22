import React from "react";
import { ethers } from "ethers";
import { EelswapContext } from "../../context/EelswapContext";
import { useState, useEffect, useContext } from "react";
import {WETH} from "../../utils/helpers";

export default function ToBalance(props) {
    const { getTokenBalance } = useContext(EelswapContext);
    const [balance, setBalance] = useState("");

    useEffect(() => {
        const getBalance = async (token) => {
            let balance = await getTokenBalance(props.toToken);
            if(props.toToken === WETH){
                balance = ethers.utils.formatEther(balance)
            }
            setBalance(balance);
        };
        if (props.toToken !== "") {
            getBalance(props.token);
        } 
        // else if (props.toToken.length === 0) {
        //     setBalance("");
        // }
    }, [props.fromToken, props.toToken]);
    // const getBalance = async (token) => {
    //     let balance = await getTokenBalance(props.token);
    //     setBalance(balance);
    // };

    // getBalance(props.token);

    return (
        <div className="flex flex-row w-full text-left mt-2 ml-2">
            <span className="text-white font-semibold mr-2">Balance: </span>
            <p className="font-poppins font-normal text-dimWhite">
                {props.toToken.length === 0 ? "0" : balance}
            </p>
        </div>
    );
}
