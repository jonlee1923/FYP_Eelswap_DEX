import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { EelswapContext } from "../context/EelswapContext";

export const usePools = () => {
    const [loading, setLoading] = useState(true);
    const [pools, setPools] = useState({});
    const { getPairs } = useContext(EelswapContext);

    useEffect(() => {
        const getPools = async () => {
            let pools = await getPairs();
            console.log("usePools ", pools);
            setPools(pools);
            setLoading(false);
            return pools;
        };

        let pools = getPools();
    }, []);

    return [loading, pools];
};
