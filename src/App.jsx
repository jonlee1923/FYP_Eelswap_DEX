import "./App.css";
import React, { useContext } from "react";
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
import Payment from "./components/payment/Payment";
import TokenMarket from "./components/testTokens/TokenMarket";
import LandingPage from "./components/landingPage/LandingPage";

function App() {
    const [poolsLoading, pools] = usePools();
    const { connected } = useContext(EelswapContext);

    return (
        <BrowserRouter>
            <Navbar />
            {connected ? (
                poolsLoading ? (
                    <LoadingOverlay loading={poolsLoading} title={"Loading"} />
                ) : (
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/swap" element={<Swap pools={pools} />} />
                        <Route
                            path="/pools"
                            element={<PoolPositions pools={pools} />}
                        />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/getTokens" element={<TokenMarket />} />
                    </Routes>
                )
            ) : (
                <ConnectWallet />
            )}
        </BrowserRouter>
    );
}

export default App;
