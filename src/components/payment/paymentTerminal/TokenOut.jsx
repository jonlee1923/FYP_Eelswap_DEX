import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "../../../styles";
import chevronDown from "../../../assets/chevron-down.svg";
import TokenRowOut from "../../swap/TokenRowOut";
import TokenRow from "./TokenRow";
export default function TokenOut(props) {
    const [showList, setShowList] = useState(false);
    const [activeToken, setactiveToken] = useState("Select");
    const [outputAmount, setOutputAmount] = useState("");
    const ref = useRef();
    const [logo2, setLogo2] = useState("");

    const getTokenData = async (address) => {
        const response = await fetch("/.netlify/functions/getToken", {
            method: "POST",
            body: JSON.stringify(address),
        });

        const responseBody = await response.json();
        return responseBody.data.tokens.values[0];
    };

    useEffect(() => {
        if (Object.keys(props.counterpartTokens).includes(props.fromToken))
            setactiveToken(props.counterpartTokens[props.fromToken]);
        else {
            setactiveToken("Select");
            props.onTokenChange("");
            setOutputAmount("");
        }
    }, [props.counterpartTokens, props.fromToken]);

    return (
        <div className="relative">
            <div className="flex justify-between items-center">
                <div className="text-white text-lg">Pay with:</div>
                <button
                    className={`${styles.tokenDropdown}`}
                    onClick={() => setShowList(!showList)}
                >
                    <img className="h-8 mr-2" src={logo2} alt="" />

                    {activeToken}
                    <img src={chevronDown} alt="chevronDown" className="ml-2" />
                </button>
            </div>
            {/* <div className=""> */}
            {showList && (
                <ul ref={ref} className={styles.currencyList}>
                    {Object.entries(props.counterpartTokens).map(
                        ([token, tokenName], index) => (
                            <TokenRow
                                key={index}
                                token={token}
                                tokenName={tokenName}
                                onTokenChange={props.onTokenChange}
                                setTokenName={props.setTokenName}
                                setactiveToken={setactiveToken}
                                setShowList={setShowList}
                                activeToken={activeToken}
                                setLogo2={setLogo2}
                            />
                        )
                    )}
                </ul>
            )}
            {/* </div> */}
        </div>
    );
}

// import React, { useState, useEffect, useRef, useContext } from "react";
// import styles from "../../../styles";
// import chevronDown from "../../../assets/chevron-down.svg";
// import TokenRowOut from "../../swap/TokenRowOut";
// import TokenRow from "./TokenRow";
// export default function TokenOut(props) {
//     const [showList, setShowList] = useState(false);
//     const [activeToken, setactiveToken] = useState("Select");
//     const [outputAmount, setOutputAmount] = useState("");
//     const ref = useRef();
//     const [logo2, setLogo2] = useState("");

//     const getTokenData = async (address) => {
//         const response = await fetch("/.netlify/functions/getToken", {
//             method: "POST",
//             body: JSON.stringify(address),
//         });

//         const responseBody = await response.json();
//         return responseBody.data.tokens.values[0];
//     };

//     useEffect(() => {
//         if (Object.keys(props.counterpartTokens).includes(props.toToken))
//             setactiveToken(props.counterpartTokens[props.toToken]);
//         else {
//             setactiveToken("Select");
//             props.onTokenChange("");
//             setOutputAmount("");
//         }
//     }, [props.counterpartTokens, props.toToken]);

//     return (
//         <div className="flex justify-between items-center">
//             <div className="text-white text-lg">Pay with:</div>
//             <button
//                 className={`${styles.tokenDropdown}`}
//                 onClick={() => setShowList(!showList)}
//             >
//                 <img className="h-8 mr-2" src={logo2} alt="" />

//                 {activeToken}
//                 <img src={chevronDown} alt="chevronDown" className="ml-2" />
//             </button>
//             {showList && (
//                 <ul ref={ref} className={styles.currencyList}>
//                     {Object.entries(props.counterpartTokens).map(
//                         ([token, tokenName], index) => (
//                             <TokenRow
//                                 key={index}
//                                 token={token}
//                                 tokenName={tokenName}
//                                 onTokenChange={props.onTokenChange}
//                                 setTokenName={props.setTokenName}
//                                 setactiveToken={setactiveToken}
//                                 setShowList={setShowList}
//                                 activeToken={activeToken}
//                                 setLogo2={setLogo2}
//                             />
//                         )
//                     )}
//                 </ul>
//             )}
//         </div>
//     );
// }
