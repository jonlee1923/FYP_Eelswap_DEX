import React, { useContext, useState } from "react";
import { EelswapContext } from "../../context/EelswapContext";
import { useEffect } from "react";
import LoadingSpinner from "../loading/LoadingSpinner";
import TokenInfo from "./TokenInfo";
import AddTokenOverlay from "./AddTokenOverlay";

export default function TokenMarket() {
    const { addToken, getAvailTokens } = useContext(EelswapContext);
    const [loading, setLoading] = useState(false);
    const [tokens, setTokens] = useState([]);
    const [showAddToken, setShowAddToken] = useState(false);

    const [newTokenName, setNewTokenName] = useState("");
    const [newTokenSymbol, setNewTokenSymbol] = useState("");
    const [initialAmount, setInitialAmount] = useState("");

    useEffect(() => {
        const getTkns = async () => {
            setLoading(true);

            let tkns = await getAvailTokens();
            setTokens(tkns);
            setLoading(false);
            return tkns;
        };

        getTkns();
    }, []);

    const onTokenNameChange = (event) => {
        setNewTokenName(event.target.value);
    };

    const onTokenSymbolchange = (event) => {
        setNewTokenSymbol(event.target.value);
    };

    const onInitialAmountChange = (event) => {
        setInitialAmount(event.target.value);
    };

    const confirmAddToken = async () => {
        setLoading(true);
        await addToken(newTokenName, newTokenSymbol, initialAmount);
        setLoading(false);
    };

    const onClickAddtoken = async () => {
        setShowAddToken(!showAddToken);
    };

    return (
        <div className="flex flex-col">
            <div className="py-5 mx-16 flex flex-row justify-between">
                <h3 className="text-lg font-medium leading-6 text-white">
                    Token Information
                </h3>
                <button
                    className="bg-green-500 border-none outline-none px-6 py-2 font-poppins font-bold text-lg text-white rounded-3xl leading-[24px] hover:bg-green-400 transition-all"
                    onClick={onClickAddtoken}
                >
                    Add Token
                </button>
            </div>
            <div className="flex flex-col bg-transparent">
                {showAddToken && (
                    <AddTokenOverlay
                        nameChange={onTokenNameChange}
                        name={newTokenName}
                        symbolChange={onTokenSymbolchange}
                        symbol={newTokenSymbol}
                        confirmAddToken={confirmAddToken}
                        initialAmount={initialAmount}
                        onInitialAmountChange={onInitialAmountChange}
                        loading={loading}
                    />
                )}
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="overflow-y-scrollable ">
                        {tokens.length !== 0 ?
                            tokens.map((token) => {
                                return (
                                    <TokenInfo
                                        name={token.name}
                                        address={token.addr}
                                    />
                                );
                            }): <div className="flex text-white justify-center h-full">No tokens to be displayed</div>}
                    </div>
                )}
            </div>
        </div>
    );
}
