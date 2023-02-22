import React, { useState, useEffect } from "react";
import styles from "../../../styles";
import chevronDown from "../../../assets/chevron-down.svg";

export default function Token1(props) {
    const [showList, setShowList] = useState(false);
    const [activeToken, setactiveToken] = useState("Select");
    const [address, setAddress] = useState("");

    useEffect(() => {
        // console.log("rerendering tkn1");
        if (Object.keys(props.availableTokens).includes(props.token)) {
            setactiveToken(props.availableTokens[props.token]);
            setAddress("");
        } else {
            if(!address)
            setactiveToken("Select");
        }
    }, [props.availableTokens, props.token]);

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
                    <div className="text-s flex flex-row">
                        <input
                            placeholder="Enter a token address"
                            value={address}
                            onChange={onAddressChange}
                            className={`${styles.amountInputPool}`}
                        />
                        <button
                            className="text-white"
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
                        {Object.entries(props.availableTokens).map(
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
                                        props.onTokenChange(token);
                                        props.setTokenName(tokenName);
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
