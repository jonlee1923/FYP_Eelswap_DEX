import React, { useContext } from "react";
import { EelswapContext } from "../../context/EelswapContext";

export default function Payment() {
    const { connected, signMessage } = useContext(EelswapContext);

    const test = async () => {
        let signature = await signMessage();
        let body = JSON.stringify({
            account: connected,
            token: "avalanche",
            symbol: "avax",
            amount: 50,
            signature: signature,
        });

        console.log("Attempting");
        const method = "POST";
        let headers = {
            "Content-Type": "application/json",
        };
        const responseData = await fetch(
            "http://localhost:5000/api/toEth/mint",
            {
                method,
                body,
                headers,
            }
        );

        console.log(responseData);
    };

    const test2 = async () => {
        console.log(typeof connected)
        console.log("0xA537f8ED47d1887BFD62ED35583aCF5a072Cf275")
        let signature = await signMessage();
        let body = JSON.stringify({
            address: "0xA537f8ED47d1887BFD62ED35583aCF5a072Cf275",
            amount: 50,
            nonce: 3,
            signature: signature,
        });

        console.log("Attempting");
        const method = "POST";
        let headers = {
            "Content-Type": "application/json",
        };
        const responseData = await fetch(
            "http://localhost:5000/api/toEth/burn",
            {
                method,
                body,
                headers,
            }
        );

        console.log(responseData);
    };

    return (
        <div>
            <button onClick={test}>Payment</button>
            <button onClick={test2}>test2</button>
        </div>
    );
}
