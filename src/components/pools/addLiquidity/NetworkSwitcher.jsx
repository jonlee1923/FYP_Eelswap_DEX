import React, { useEffect } from "react";

export default function NetworkSwitcher() {
    const networks = {
        goerli: {
            chainId: `0x${Number(5).toString(16)}`,
            chainName: "Goerli Test Network",
            nativeCurrency: {
                name: "Goerli Ether",
                symbol: "GoETH",
                decimals: 18,
            },
            rpcUrls: [
                "https://rpc.goerli.mudit.blog/",
                "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
                "https://goerli.infura.io/v3/",
            ],
            blockExplorerUrls: ["https://goerli.etherscan.io"],
        },
        bsc: {
            chainId: `0x${Number(97).toString(16)}`,
            chainName: "Binance Smart Chain TestNet",
            nativeCurrency: {
                name: "Binance Chain Native Token",
                symbol: "BNB",
                decimals: 18,
            },
            rpcUrls: ["https://data-seed-prebsc-1-s3.binance.org:8545/"],
            blockExplorerUrls: ["https://bscscan.com"],
        },
    };

    const changeNetwork = async (chainId) => {
        try {
            console.log(chainId)
            let value = Number(chainId).toString(16)
            console.log(value)
            if (!window.ethereum) throw new Error("No crypto wallet found");
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: `0x${value}` }], // Rinkeby chain id

            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleNetworkSwitch = async (chainId) => {
        // setError();
        await changeNetwork(chainId);
    };
    const networkChanged = (chainId) => {
        console.log({ chainId });
    };
    useEffect(() => {
        window.ethereum.on("chainChanged", networkChanged);

        return () => {
            window.ethereum.removeListener("chainChanged", networkChanged);
        };
    }, []);

    return (
        <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
            <main className="mt-4 p-4">
                <div className="mt-4">
                    <button
                        onClick={() => handleNetworkSwitch(5)}
                        className="mt-2 mb-2 btn btn-primary submit-button focus:ring focus:outline-none w-full"
                    >
                        Switch to Goerli
                    </button>
                    <button
                        onClick={() => handleNetworkSwitch(97)}
                        className="mt-2 mb-2 bg-warning border-warning btn submit-button focus:ring focus:outline-none w-full"
                    >
                        Switch to BSC
                    </button>
                    {/* <ErrorMessage message={error} /> */}
                </div>
            </main>
        </div>
    );
}
