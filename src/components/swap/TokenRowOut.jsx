import React, { useEffect, useState } from "react";
import styles from "../../styles";

export default function TokenRowOut(props) {
    const [logo, setLogo] = useState("");
    useEffect(() => {
        const getTokenData = async (address) => {
            const response = await fetch("/.netlify/functions/getToken", {
                method: "POST",
                body: JSON.stringify(address),
            });

            const responseBody = await response.json();

            setLogo(responseBody.data.tokens.values[0]["imageURL"]);
        };

        getTokenData(props.token);
    }, []);
    return (
        <li
            className={`flex items-center${styles.currencyListItem} ${
                props.activeToken === props.tokenName
                    ? "bg-green-600"
                    : "bg-black"
            } cursor-pointer`}
            onClick={() => {
                if (typeof onSelect === "function")
                    props.onTokenChange(props.token);

                props.setTokenName(props.tokenName);
                props.onTokenChange(props.token);
                props.setactiveToken(props.tokenName);
                props.setShowList(false);
                props.setLogo2(logo)
            }}
        >
            <img className="h-8 mr-2" src={logo} alt="" />
            <div className="items-center flex">{props.tokenName}</div>
        </li>
    );
}
