import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { EelswapContext } from "../context/EelswapContext";

export const usePools = () => {
    const [loading, setLoading] = useState(true);
    const [pools, setPools] = useState({});
    const { getPairs } = useContext(EelswapContext);

    useEffect(() => {
        let exclude = [
            "0xB50A30c17aa3dF170d295360541CBd245B76f258",
            "0x7b489851c92d7CD235692a14fDf33996Ba809eeB",
            "0xF5Db337987F9DD35e42f2722da71b5747a09FA54",
            "0xF7C2677D7D0b65b61c4DdE3F5f19F9Ff1B5b446e",
            "0xcf876bEf1A443c7Ae820018Cb8ABd0ac05819d05",
            "0xFBa0589959FFf3B82A4aAb3B2941359460374D96",
            "0x71bC31dC2582D497776916189D5Eaaf3A187fEb9",
            "0x87DB1F8b3FCC91Bd035096B04267AdCAFe2C4360",
            "0x87DB1F8b3FCC91Bd035096B04267AdCAFe2C4360",
            "0x755A5643A07FdCc7dbE08322fe7E0FA55A2707B7"
        ];

        const getPools = async () => {
            let pools = await getPairs();
            console.log("usePools ", pools);
            let finalPools = []
            for (let i = 0; i < pools.length; i++) {
                if (!exclude.includes(pools[i]["address"])) {
                    finalPools.push(pools[i])
                }
            }
            setPools(finalPools);
            setLoading(false);
        };

        getPools();
    }, []);

    return [loading, pools];
};
