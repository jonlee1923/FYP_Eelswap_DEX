import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import pairObj from "../contractsData/pair.json";
import token from "../contractsData/token.json";
import WETHObj from "../contractsData/WETH.json";
import IrouterAbi from "../contractsData/IEelswapRouter.json";
import routerAbi from "../contractsData/EelswapRouter.json";
import routerAddress from "../contractsData/EelswapRouter-address.json";
import factoryAbi from "../contractsData/EelswapFactory.json";
import factoryAddress from "../contractsData/EelswapFactory-address.json";
import tokenMarketAbi from "../contractsData/TokenMarket.json";
import tokenMarketAddress from "../contractsData/TokenMarket-address.json";
import bridgeAbi from "../contractsData/BridgeEth.json";
import bridgeAddress from "../contractsData/BridgeEth-address.json";

import { WETH } from "../utils/helpers";
// import std from "../utils/constant.js";
export const EelswapContext = React.createContext();

const { ethereum } = window;

const getBridgeContract = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts) {
        const signer = provider.getSigner(accounts[0]);

        if (signer) {
            const bridge = new ethers.Contract(
                bridgeAddress.address,
                bridgeAbi.abi,
                signer
            );
            return bridge;
        }
    }
};

const getRouterContract = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts) {
        const signer = provider.getSigner(accounts[0]);

        if (signer) {
            const routerContract = new ethers.Contract(
                routerAddress.address,
                routerAbi.abi,
                signer
            );
            return routerContract;
        }
    }
};

const getFactoryContract = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts) {
        const signer = provider.getSigner(accounts[0]);

        if (signer) {
            const factoryContract = new ethers.Contract(
                factoryAddress.address,
                factoryAbi.abi,
                signer
            );

            return factoryContract;
        }
    }
};

const getTokenMarketContract = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts) {
        const signer = provider.getSigner(accounts[0]);
        console.log(tokenMarketAddress.address);
        // console.log(tokenMarketAbi.abi)
        if (signer) {
            const tokenMarketContract = new ethers.Contract(
                tokenMarketAddress.address,
                tokenMarketAbi.abi,
                signer
            );
            return tokenMarketContract;
        }
    }
};

export const EelswapProvider = ({ children }) => {
    const [connected, setCurrentAccount] = useState("");

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert("Please install Metamask");
            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            } else {
                console.log("No accounts found");
            }
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object");
        }
    };

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install Metamask");

            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

            setCurrentAccount(accounts[0]);
            console.log("set connected");
            window.location.reload();
        } catch (error) {
            throw new Error("No ethereum object");
        }
    };

    const addToken = async (name, symbol) => {
        try {
            let tokenMarketContract = await getTokenMarketContract();
            let tx = await tokenMarketContract.addToken(name, symbol);
            await tx.wait();
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    };

    const getAvailTokens = async () => {
        try {
            let tokenMarketContract = await getTokenMarketContract();

            let data = await tokenMarketContract.getTokens();

            const mappedTokens = await Promise.all(
                data.map(async (i) => {
                    // console.log(i);
                    // console.log(i.name, i.addr);
                    return { name: i.name, addr: i.addr };
                })
            );
            // console.log(mappedTokens);

            return mappedTokens;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    };

    const getPairs = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(ethereum);

            let factoryContract = await getFactoryContract();
            let allPairs = [];
            let pairsInfo = [];

            let length = await factoryContract.allPairsLength();
            length = length.toNumber();

            if (length === 0) {
                return pairsInfo;
            }

            for (let i = 0; i < length; i++) {
                allPairs[i] = await factoryContract.allPairs(i);
            }

            for (let i = 0; i < allPairs.length; i++) {
                const pairAddress = allPairs[i];
                const pair = new ethers.Contract(
                    pairAddress,
                    pairObj.abi,
                    provider
                );
                const token0Address = await pair.token0();
                const token1Address = await pair.token1();
                const token0Contract = new ethers.Contract(
                    token0Address,
                    token.abi,
                    provider
                );
                const token1Contract = new ethers.Contract(
                    token1Address,
                    token.abi,
                    provider
                );

                const token0Name = await token0Contract.name();
                const token1Name = await token1Contract.name();
                pairsInfo.push({
                    address: pairAddress,
                    token0Address,
                    token1Address,
                    token0Name,
                    token1Name,
                });
            }

            // console.log(pairsInfo);
            return pairsInfo;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    };

    const getAvailableTokens = (pools) =>
        pools.reduce((prev, curr) => {
            prev[curr.token0Address] = curr.token0Name;
            prev[curr.token1Address] = curr.token1Name;
            return prev;
        }, {});

    const getCounterpartTokens = (pools, fromToken) =>
        pools
            .filter(
                (cur) => cur.token0Address === fromToken || cur.token1Address
            )
            .reduce((prev, curr) => {
                if (curr.token0Address === fromToken) {
                    prev[curr.token1Address] = curr.token1Name;
                } else if (curr.token1Address === fromToken) {
                    prev[curr.token0Address] = curr.token0Name;
                }
                return prev;
            }, {});

    const findPoolByTokens = (pools, fromToken, toToken) => {
        if (!Array.isArray(pools) || !fromToken || !toToken) return undefined;

        return pools.find(
            (cur) =>
                (cur.token0Address === fromToken &&
                    cur.token1Address === toToken) ||
                (cur.token1Address === fromToken &&
                    cur.token0Address === toToken)
        );
    };

    const getTokenBalance = async (address) => {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const tkn = new ethers.Contract(address, token.abi, provider);
        let balance = await tkn.balanceOf(connected);
        let strBalance = balance.toString();
        return strBalance;
    };

    const getAmountsOut = async (pairAddress, amountIn, fromToken, toToken) => {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const signer = provider.getSigner(accounts[0]);
        let routerContract = await getRouterContract();
        let tx = await routerContract.getAmountsOut(amountIn, [
            fromToken,
            toToken,
        ]);
        // tx.await()
        // return tx.data;
    };

    const addLiquidity = async (token1, token2, amount1, amount2, deadline) => {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const signer = provider.getSigner(accounts[0]);
        let routerContract = await getRouterContract();
        const token0Contract = new ethers.Contract(token1, token.abi, signer);
        const token1Contract = new ethers.Contract(token2, token.abi, signer);

        await token0Contract.approve(routerContract.address, amount1);
        await token1Contract.approve(routerContract.address, amount2);

        let transaction = await routerContract.addLiquidity(
            token1,
            token2,
            amount1,
            amount2,
            1,
            1,
            connected,
            deadline,
            {
                gasLimit: ethers.BigNumber.from("4000000"),
            }
        );

        let tx = await transaction.wait();

        let dict = {
            address: connected,
            pairAddress: tx.events[7].args[0],
            token1Amount: tx.events[7].args[1].toNumber(),
            token2Amount: tx.events[7].args[2].toNumber(),
        };

        // console.log("events 0", tx.events[7].args[0]);
        // console.log("events 1", tx.events[7].args[1].toNumber());
        // console.log("events 2", tx.events[7].args[2].toNumber());

        return dict;
    };

    const addLiquidityETH = async (
        inputToken,
        amountInput,
        // minAmountInput,
        amountInputETH,
        // minAmountInputETH,
        deadline
    ) => {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const signer = provider.getSigner(accounts[0]);
        let routerContract = await getRouterContract();

        const tokenContract = new ethers.Contract(
            inputToken,
            token.abi,
            signer
        );

        const wethContract = new ethers.Contract(WETH, WETHObj.abi, signer);

        await tokenContract.approve(routerContract.address, amountInput);

        await wethContract.approve(
            routerContract.address,
            ethers.utils.parseEther(amountInputETH.toString())
        );

        let transaction = await routerContract.addLiquidityETH(
            inputToken,
            amountInput,
            1,
            1,
            connected,
            deadline,
            {
                value: ethers.utils.parseEther(amountInputETH.toString()),
                gasLimit: ethers.BigNumber.from("4000000"),
            }
        );
        let tx = await transaction.wait();
        let arr = [
            tx.events[7].args[0],
            tx.events[7].args[1].toNumber(),
            tx.events[7].args[2].toNumber(),
        ];
        return arr;
    };

    const swapExactTokensForTokens = async (
        fromToken,
        toToken,
        amountIn,
        amountOutMin,
        deadline
    ) => {
        try {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const accounts = await ethereum.request({ method: "eth_accounts" });
            const signer = provider.getSigner(accounts[0]);
            let routerContract = await getRouterContract();
            const inputToken = new ethers.Contract(
                fromToken,
                token.abi,
                signer
            );
            await inputToken.approve(routerContract.address, amountIn);

            let transaction = await routerContract.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                [fromToken, toToken],
                connected,
                deadline,
                {
                    gasLimit: ethers.BigNumber.from("3000000"),
                }
            );
            let tx = transaction.wait();
        } catch (error) {
            console.log(error);
        }
    };

    const swapExactETHForTokens = async (
        toToken,
        amountInputETH,
        amountOutMin,
        deadline
    ) => {
        try {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const accounts = await ethereum.request({ method: "eth_accounts" });
            const signer = provider.getSigner(accounts[0]);
            let routerContract = await getRouterContract();

            const wethContract = new ethers.Contract(WETH, WETHObj.abi, signer);

            await wethContract.approve(
                routerContract.address,
                ethers.utils.parseEther(amountInputETH.toString())
            );

            let transaction = await routerContract.swapExactETHForTokens(
                amountOutMin,
                [WETH, toToken],
                connected,
                deadline,
                {
                    value: ethers.utils.parseEther(amountInputETH.toString()),
                    // gasLimit: 3000000
                }
            );
            let tx = transaction.wait();
        } catch (error) {
            console.log(error);
        }
    };

    const swapExactTokensForETH = async (
        fromToken,
        amountIn,
        amountOutMin,
        deadline
    ) => {
        try {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const accounts = await ethereum.request({ method: "eth_accounts" });
            const signer = provider.getSigner(accounts[0]);
            let routerContract = await getRouterContract();

            const inputToken = new ethers.Contract(
                fromToken,
                token.abi,
                signer
            );
            await inputToken.approve(routerContract.address, amountIn);

            let transaction = await routerContract.swapExactTokensForETH(
                amountIn,
                amountOutMin,
                [fromToken, WETH],
                connected,
                deadline,
                {
                    gasLimit: ethers.BigNumber.from("3000000"),
                }
            );
            let tx = transaction.wait();
        } catch (error) {
            console.log(error);
        }
    };

    const getOutputAmount = async (amountIn, fromToken, toToken) => {
        try {
            // console.log("inside op op");
            if (amountIn !== 0 && fromToken !== "" && toToken !== "") {
                // console.log("insied if");
                const provider = new ethers.providers.Web3Provider(ethereum);
                const accounts = await ethereum.request({
                    method: "eth_accounts",
                });
                const signer = provider.getSigner(accounts[0]);
                let routerContract = await getRouterContract();

                let value = await routerContract.getAmountsOut(amountIn, [
                    fromToken,
                    toToken,
                ]);

                // console.log("waiting")
                // let tx = transaction.wait();
                // console.log(value[1].toString());
                if (toToken === WETH) {
                    return ethers.utils.formatEther(value[1].toString());
                }

                return value[1].toString();
            }
        } catch (error) {}
    };

    const getLiquidityAmt = async (address) => {
        try {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const pair = new ethers.Contract(address, pairObj.abi, provider);
            let liquidityAmt = await pair.balanceOf(connected);

            return liquidityAmt.toNumber();
        } catch (error) {}
    };

    const getPairSymbols = async (address1, address2) => {
        try {
            // console.log("addrsses", address1, address2);
            const provider = new ethers.providers.Web3Provider(ethereum);
            const token1 = new ethers.Contract(address1, token.abi, provider);
            const token2 = new ethers.Contract(address2, token.abi, provider);

            let symbol1 = await token1.symbol();
            let symbol2 = await token2.symbol();

            return [symbol1, symbol2];
        } catch (error) {}
    };

    const removeLiquidity = async (
        pair,
        token1,
        token2,
        liquidity,
        amount1Min,
        amount2Min,
        deadline
    ) => {
        try {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const accounts = await ethereum.request({ method: "eth_accounts" });
            const signer = provider.getSigner(accounts[0]);
            let routerContract = await getRouterContract();
            const pairContract = new ethers.Contract(pair, pairObj.abi, signer);

            await pairContract.approve(routerContract.address, liquidity);
            console.log(token1);
            console.log(token2);
            console.log(liquidity);
            console.log(amount1Min);
            console.log(amount2Min);
            console.log(deadline);

            let transaction = await routerContract.removeLiquidity(
                token1,
                token2,
                liquidity,
                amount1Min,
                amount2Min,
                connected,
                deadline,
                {
                    gasLimit: ethers.BigNumber.from("5000000"),
                }
            );

            let tx = await transaction.wait();
        } catch (error) {
            console.log(error);
        }
    };

    const removeLiquidityETH = async (
        token,
        liquidity,
        amountMin,
        amountETHMin,
        deadline
    ) => {
        try {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const accounts = await ethereum.request({ method: "eth_accounts" });
            const signer = provider.getSigner(accounts[0]);
            let routerContract = await getRouterContract();

            let transaction = await routerContract.removeLiquidityETH(
                token,
                WETH,
                liquidity,
                amountMin,
                amountETHMin,
                connected,
                deadline,
                {
                    gasLimit: ethers.BigNumber.from("4000000"),
                }
            );

            let tx = await transaction.wait();
        } catch (error) {}
    };

    const signMessage = async () => {
        // const sig = await owner.signMessage(ethers.utils.arrayify(hash))
        const bridge = await getBridgeContract();
        const provider = new ethers.providers.Web3Provider(ethereum);
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const signer = provider.getSigner(accounts[0]);
        const hash = await bridge.getMessageHash(connected, 10, 1);
        console.log("hash", hash);
        const sig = await signer.signMessage(ethers.utils.arrayify(hash));
        console.log("signature", sig);
        return sig;
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <EelswapContext.Provider
            value={{
                connectWallet,
                checkIfWalletIsConnected,
                connected,
                //FUNCTIONS
                // SWAP,
                swapExactTokensForTokens,
                getPairs,
                getAvailableTokens,
                getCounterpartTokens,
                findPoolByTokens,
                swapExactETHForTokens,
                swapExactTokensForETH,
                //POOL FN
                addLiquidity,
                addLiquidityETH,
                removeLiquidity,
                removeLiquidityETH,
                //Helpers
                getTokenBalance,
                getOutputAmount,
                //Market
                getAvailTokens,
                addToken,
                //Pair functions
                getLiquidityAmt,
                getPairSymbols,

                signMessage,
            }}
        >
            {children}
        </EelswapContext.Provider>
    );
};
