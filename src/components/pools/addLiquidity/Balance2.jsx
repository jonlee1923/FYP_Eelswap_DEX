import React from "react";
import { EelswapContext } from "../../../context/EelswapContext";
import { useState, useEffect, useContext } from "react";

export default function Balance2(props) {
    const { getTokenBalance } = useContext(EelswapContext);
    const [balance, setBalance] = useState("");

    // console.log(props.token);

    useEffect(() => {
        const getBalance = async (token) => {
            let balance = await getTokenBalance(props.token);
            setBalance(balance);
        };
        getBalance(props.token);
    }, [props.token]);

    return (
        <div className="flex flex-row w-full text-left mt-2 ml-2">
            <span className="text-white font-semibold mr-2">Balance: </span>
            <p className="font-poppins font-normal text-dimWhite">
                {props.token.length === 0 ? "0" : balance}
            </p>
        </div>
    );
}
