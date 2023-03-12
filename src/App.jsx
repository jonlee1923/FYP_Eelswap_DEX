import "./App.css";
import React, { useContext, useEffect, useState } from "react";
import styles from "./styles.js";
import Navbar from "./components/navigation/Navbar";
import Swap from "./components/swap/Swap";
import Pools from "./components/pools/addLiquidity/Pools";
import PoolPositions from "./components/pools/positions/PoolPositions";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { usePools } from "./hooks/usePools";
import { EelswapContext } from "./context/EelswapContext";
// import LoadingSpinner from "./components/loading/LoadingSpinner";
import LoadingOverlay from "./components/loading/LoadingOverlay";
import ConnectWallet from "./components/navigation/ConnectWallet";
import TokenMarket from "./components/testTokens/TokenMarket";
import LandingPage from "./components/landingPage/LandingPage";
import NetworkSwitcher from "./components/pools/addLiquidity/NetworkSwitcher";
import Tokens1 from "./components/pools/addLiquidity/Tokens1";
import PaymentLink from "./components/payment/paymentLink/PaymentLink";
import PaymentTerminal from "./components/payment/paymentTerminal/PaymentTerminal";
import SuccessOverlay from "./components/loading/SuccessOverlay";

function App() {
    const [poolsLoading, pools] = usePools();
    const { connected, activeChain, setActiveChain } =
        useContext(EelswapContext);
    return (
        <div
            className={
                activeChain === "ETH"
                    ? `${styles.ETHStyle}`
                    : `${styles.BSCStyle}`
            }
        >
            <BrowserRouter>
                <Navbar
                    activeChain={activeChain}
                    setActiveChain={setActiveChain}
                />
                {connected ? (
                    poolsLoading ? (
                        <LoadingOverlay
                            loading={poolsLoading}
                            title={"Loading"}
                        />
                    ) : (
                        // <LoadingOverlay
                        //     loading={poolsLoading}
                        //     title={"Loading"}
                        // />
                        // <SuccessOverlay
                        //     title={
                        //         "Please wait for your transaction to complete"
                        //     }
                        //     // loading={loading}
                        //     message1={`Successfully swapped 15 aave tokens for 9 usdc tokens`}
                        //     message2={``}
                        //     setShowEndMsg={true}
                        // />
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route
                                path="/swap"
                                element={<Swap pools={pools} />}
                            />
                            <Route
                                path="/pools"
                                // element={<PoolPositions pools={pools} />}
                                element={
                                    <PoolPositions
                                        activeChain={activeChain}
                                        setActiveChain={setActiveChain}
                                    />
                                }
                            />
                            <Route
                                path="/paymentLink"
                                element={<PaymentLink pools={pools}/>}
                            />
                            <Route
                                path="/getTokens"
                                element={<TokenMarket  />}
                            />
                            <Route
                                path="/pay/:opAmt/:recieverAddress/:toToken"
                                element={<PaymentTerminal pools={pools} />}
                            />
                        </Routes>
                    )
                ) : (
                    <ConnectWallet />
                )}
            </BrowserRouter>
        </div>
    );
}

export default App;
