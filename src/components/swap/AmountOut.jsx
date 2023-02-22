import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "../../styles";
import chevronDown from "../../assets/chevron-down.svg";
import { EelswapContext } from "../../context/EelswapContext";
import { useOnClickOutside } from "../../utils/helpers";

export default function AmountOut(props) {
    const [showList, setShowList] = useState(false);
    const [activeToken, setactiveToken] = useState("Select");
    const [outputAmount, setOutputAmount] = useState("");
    const ref = useRef();
    const { getOutputAmount } = useContext(EelswapContext);

    if (props.fromToken.length !== 0 && props.toToken.length !== 0) {
    }

    useEffect(() => {
        const getOpAmount = async () => {
            let op = await getOutputAmount(
                props.fromAmount,
                props.fromToken,
                props.toToken
            );
            
            setOutputAmount(op);
            props.setOp(op);
        };

        getOpAmount();
        
    }, [props.fromToken, props.toToken, props.fromAmount]);

    useEffect(() => {
        if (Object.keys(props.counterpartTokens).includes(props.toToken))
            setactiveToken(props.counterpartTokens[props.toToken]);
        else {
            setactiveToken("Select");
            props.onTokenChange("");
            setOutputAmount("")
        }
    }, [props.counterpartTokens, props.toToken]);

    return (
        <div className={`${styles.amountContainer}`}>
            <input className={`${styles.amountInput}`} disabled value={outputAmount} />
            <div className="relative">
                <button
                    className={`${styles.tokenDropdown}`}
                    onClick={() => setShowList(!showList)}
                >
                    {activeToken}
                    <img src={chevronDown} alt="chevronDown" className="ml-2" />
                </button>
                {showList && (
                    <ul ref={ref} className={styles.currencyList}>
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
