import React, { useState, useEffect, useRef } from "react";
import { useOnClickOutside } from "../../utils/helpers";
import styles from "../../styles";
import chevronDown from "../../assets/chevron-down.svg";
import TokenRowIn from "./TokenRowIn";

export default function AmountIn(props) {
    const [showList, setShowList] = useState(false);
    const [activeToken, setactiveToken] = useState("Select");
    const ref = useRef();
    const [logo1, setLogo1] = useState("");
    useOnClickOutside(ref, () => setShowList(false));
    const getTokenData = async (address) => {
        console.log(address);
        const response = await fetch("/.netlify/functions/getToken", {
            method: "POST",
            body: JSON.stringify(address),
        });

        const responseBody = await response.json();

        setLogo1(responseBody.data.tokens.values[0]["imageURL"]);
    };
    useEffect(() => {
        // getTokenData(props.token);
        if (Object.keys(props.availableTokens).includes(props.fromToken)) {
            setactiveToken(props.availableTokens[props.fromToken]);
            for (const key in props.availableTokens) {
                if (props.availableTokens[key] === activeToken) {
                    getTokenData(key);
                    break;
                }
            }
        } else setactiveToken("Select");
    }, [props.availableTokens, props.fromToken]);

    // useEffect(() => {
    //     getTokenData()
    // },[])

    return (
        <div className={styles.amountContainer}>
            <input
                className={styles.amountInput}
                value={props.amount}
                onChange={props.onAmountChange}
            />

            <div className="relative" onClick={() => setShowList(!showList)}>
                <button className={`${styles.tokenDropdown}`}>
                    <img className="h-8 mr-2" src={logo1} alt="" />

                    {activeToken}
                    <img src={chevronDown} alt="chevronDown" className="ml-2" />
                </button>

                {showList && (
                    <ul ref={ref} className={styles.currencyList}>
                        {Object.entries(props.availableTokens).map(
                            ([token, tokenName], index) => (
                                <TokenRowIn
                                    key={index}
                                    activeToken={activeToken}
                                    token={token}
                                    tokenName={tokenName}
                                    onTokenChange={props.onTokenChange}
                                    setTokenName={props.setTokenName}
                                    setactiveToken={setactiveToken}
                                    setShowList={setShowList}
                                    setLogo1={setLogo1}
                                />
                            )
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}
