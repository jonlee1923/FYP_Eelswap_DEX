import React, { useState, useEffect, useRef } from "react";
import { useOnClickOutside } from "../../../utils/helpers";
import styles from "../../../styles";
import chevronDown from "../../../assets/chevron-down.svg";
import TokenRowIn from "../../swap/TokenRowIn";

export default function TokenIn(props) {
    const [showList, setShowList] = useState(false);
    const [activeToken, setactiveToken] = useState("Select");
    const ref = useRef();
    const [logo1, setLogo1] = useState("");
    // useOnClickOutside(ref, () => setShowList(false));

    useEffect(() => {
        const getTokenData = async (address) => {
            console.log(address);
            const response = await fetch("/.netlify/functions/getToken", {
                method: "POST",
                body: JSON.stringify(address),
            });

            const responseBody = await response.json();

            setLogo1(responseBody.data.tokens.values[0]["imageURL"]);
        };

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

    return (
        <div className="relative" onClick={() => setShowList(!showList)}>
            <div className="flex items-center justify-between">
                <p className="text-white text-center text-lg pr-2">Receive with:</p>
                <button className={`${styles.tokenDropdown}`}>
                    <img className="h-8 mr-2" src={logo1} alt="" />

                    {activeToken}
                    <img src={chevronDown} alt="chevronDown" className="ml-2" />
                </button>
            </div>

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
    );
}
