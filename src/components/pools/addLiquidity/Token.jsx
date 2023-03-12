import React, { useState, useEffect, useContext } from "react";
import styles from "../../../styles";
import { EelswapContext } from "../../../context/EelswapContext";
import bscLogo from "../../../assets/bscTokenLogo.png"
import ethLogo from "../../../assets/ethTokenLogo.png"

export default function Token(props) {
    const { getTokenBalance } = useContext(EelswapContext);
    const [balance, setBalance] = useState("");

    useEffect(() => {
        const getBalance = async (token) => {
            let balance = await getTokenBalance(token);
            if (balance.length > 4) {
                setBalance(balance.substring(0, 4) + "...");
            } else {
                setBalance(balance);
            }
        };
        getBalance(props.address);
    }, []);

    return (
        <li
            className={`flex items-center justify-between ${
                styles.currencyListItem
            } ${
                props.activeToken === props.symbol ? "bg-green-600" : "bg-black"
            } cursor-pointer`}
            onClick={() => {
                if (typeof onSelect === "function")
                    props.onTokenChange(props.address);
                props.onTokenChange(props.address);
                props.setTokenName(props.symbol);
                props.setAddress("");
                props.setactiveToken(props.symbol);
                props.setShowList(false);
                props.setactiveTokenUrl(props.imageURL);
                props.setImageUrl(props.imageURL);
                if(props.imageURl === ""){
                    props.setButtonImage(props.eth)
                }
            }}
        >
            <div className="flex space-x-2 items-center">
                <img
                    className="h-8"
                    src={`${props.imageURL ? props.imageURL : props.eth
                        ? ethLogo
                        : bscLogo}`}
                    alt=""
                />
                <p>{props.symbol}</p>
            </div>
            <p>{balance}</p>
        </li>
    );
}
