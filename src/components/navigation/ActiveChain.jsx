import React, { useState, useEffect, useContext } from "react";
// import chevronDown from "../../assets/chevron-down.svg";
import styles from "../../styles";
import { EelswapContext } from "../../context/EelswapContext";

export default function ActiveChain(props) {
    const [open, setOpen] = useState(false);
    const { activeChain, setActiveChain } = useContext(EelswapContext);

    // useEffect(() => {
    //     props.setActiveChain("ETH");
    // }, []);
    const chains = [
        { chain: "ETH", id: 5 },
        { chain: "BSC", id: 97 },
    ];

    const toggleList = () => {
        setOpen(!open);
    };

    const chainSwitcher = async (chainId) => {
        try {
            // console.log(chainId);
            let value = Number(chainId).toString(16);
            // console.log(value);
            if (!window.ethereum) throw new Error("No crypto wallet found");
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: `0x${value}` }], // Rinkeby chain id
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="text-white">
            <button
                className={`${styles.connectButton} flex items-center m-2`}
                onClick={toggleList}
            >
                {props.activeChain}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    {open ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 15.75l7.5-7.5 7.5 7.5"
                            />
                        </svg>
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                    )}
                </svg>
            </button>
            {open && (
                <ul className="absolute right-40 z-10 mt-2 w-40 origin-top-right rounded-md shadow-lg ring-1 ring-black focus:outline-none">
                    {chains.map((chain) => (
                        <li
                            key={chain.id}
                            className=" text-xl  py-2 bg-black"
                        >
                            <button
                                className={`flex w-full pl-4 ${activeChain === chain.chain ? 'bg-green-600': ""}`}
                                onClick={() => {
                                    setOpen(!open);
                                    props.setActiveChain(chain.chain);
                                    chainSwitcher(chain.id);
                                }}
                            >
                                {chain.chain}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
