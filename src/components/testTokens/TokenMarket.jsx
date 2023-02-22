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
    const [addLoading, setAddLoading] = useState(false);

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

    const confirmAddToken = async () => {
        setAddLoading(true);
        await addToken(newTokenName, newTokenSymbol);
        setAddLoading(false);
    };

    const onClickAddtoken = async () => {
        setShowAddToken(!showAddToken);
    };

    return (
        <div className="flex flex-col">
            <div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Token Information
                </h3>
                <button
                    className="mr-4 bg-green-500 border-none outline-none px-6 py-2 font-poppins font-bold text-lg text-white rounded-3xl leading-[24px] hover:bg-green-400 transition-all"
                    onClick={onClickAddtoken}
                >
                    Add Token
                </button>
            </div>
            <div className="flex flex-col">
                {showAddToken && (
                    <AddTokenOverlay
                        nameChange={onTokenNameChange}
                        name={newTokenName}
                        symbolChange={onTokenSymbolchange}
                        symbol={newTokenSymbol}
                        confirmAddToken={confirmAddToken}
                        loading={addLoading}
                    />
                )}
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    tokens &&
                    tokens.map((token) => {
                        return (
                            <TokenInfo name={token.name} address={token.addr} />
                        );
                    })
                )}
            </div>
        </div>
    );
}
