import React, { useEffect, useState, useContext } from "react";
import { EelswapContext } from "../../context/EelswapContext";
import styles from "../../styles";

export default function ConnectButton() {
    const [rendered, setRendered] = useState("");
    const { connected, connectWallet } = useContext(EelswapContext);

    useEffect(() => {
        if (connected) {
            setRendered(
                connected.substring(0, 6) +
                    "..." +
                    connected.substring(connected.length - 4)
            );
        } else {
            setRendered("");
        }
    }, [connected, setRendered]);

    return (
        <button
            onClick={() => {
                console.log("clicked");
                connectWallet();
            }}
            className={styles.connectButton}
        >
            {rendered === "" && "Connect Wallet"}
            {rendered !== "" && rendered}
        </button>
    );
}
