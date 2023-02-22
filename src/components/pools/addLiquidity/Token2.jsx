import React, { useState, useEffect } from "react";
import styles from "../../../styles";
import chevronDown from "../../../assets/chevron-down.svg";

export default function Token2(props) {
    const [showList, setShowList] = useState(false);
    const [activeToken, setactiveToken] = useState("Select");
    const [address, setAddress] = useState("");

    useEffect(() => {

        // console.log("rerendering token2");

        if (Object.keys(props.counterpartTokens).includes(props.token)) {
            setactiveToken(props.counterpartTokens[props.token]);
            setAddress("");
        } else if (!address) {
            setactiveToken("Select");
            props.onTokenChange("");
        } 
        // else {
        //     setactiveToken("Select");
        //     props.onTokenChange("");
        // }
    }, [props.counterpartTokens, props.token]);

    const onAddressChange = (event) => {
        // console.log(event.target.value);
        setAddress(event.target.value);
        props.onTokenChange(event.target.value);
    };

    return (
        <div className="relative">
            <button
                className={`${styles.tokenDropdown}`}
                onClick={() => setShowList(!showList)}
            >
                {activeToken}
                <img className="ml-2" src={chevronDown} alt="chevronDown" />
            </button>
            {showList && (
                <div>
                    <div className="flex flex-row">
                        <input
                            placeholder="Enter a token address"
                            value={address}
                            onChange={onAddressChange}
                            className={`${styles.amountInputPool}`}
                        />
                        <button
                            className="ml-2 text-white"
                            onClick={() => {
                                setShowList(false);
                                setactiveToken(address);
                                props.setToken(address);
                            }}
                        >
                            Add
                        </button>
                    </div>
                    <ul className={styles.currencyList}>
                        {Object.entries(props.counterpartTokens).map(
                            ([token, tokenName], index) => (
                                <li
                                    key={index}
                                    className={`${styles.currencyListItem} ${
                                        activeToken === tokenName
                                            ? "bg-green-600"
                                            : "bg-black"
                                    } cursor-pointer`}
                                    onClick={() => {
                                        if (typeof onSelect === "function")
                                            props.onTokenChange(token);
                                        props.setTokenName(tokenName);
                                        props.onTokenChange(token);
                                        setAddress("");
                                        setactiveToken(tokenName);
                                        setShowList(false);
                                    }}
                                >
                                    {tokenName}
                                </li>
                            )
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
