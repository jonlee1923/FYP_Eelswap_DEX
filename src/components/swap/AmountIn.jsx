import React, { useState, useEffect, useRef } from "react";
import { useOnClickOutside } from "../../utils/helpers";
import styles from "../../styles";
import chevronDown from "../../assets/chevron-down.svg";

export default function AmountIn(props) {
    const [showList, setShowList] = useState(false);
    const [activeToken, setactiveToken] = useState("Select");
    const ref = useRef();
    useOnClickOutside(ref, () => setShowList(false));

    useEffect(() => {
        if (Object.keys(props.availableTokens).includes(props.fromToken))
            setactiveToken(props.availableTokens[props.fromToken]);
        else setactiveToken("Select");
    }, [props.availableTokens, props.fromToken]);

    return (
        <div className={styles.amountContainer}>
            <input
                className={styles.amountInput}
                value={props.amount}
                onChange={props.onAmountChange}
            />

            <div className="relative" onClick={() => setShowList(!showList)}>
                <button className={`${styles.tokenDropdown}`}>
                    {activeToken}
                    <img src={chevronDown} alt="chevronDown" className="ml-2" />
                </button>

                {showList && (
                    <ul ref={ref} className={styles.currencyList}>
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
                                        // if (typeof onSelect === "function") {
                                        //     props.onTokenChange(token);
                                        // }
                                        props.onTokenChange(token);
                                        props.setTokenName(tokenName);
                                        setactiveToken(tokenName);
                                        setShowList(false);
                                    }}
                                >
                                    {tokenName}
                                </li>
                            )
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}
