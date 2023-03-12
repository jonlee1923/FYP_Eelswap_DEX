const fetch = require("node-fetch"); 
//npm install node-fetch
// import fetch from 'node-fetch';

exports.handler = async function (event) {
    const dict = JSON.parse(event.body);
    const url = process.env.ASTRA_GRAPHQL_ENDPOINT;
    
    const query = `
    mutation {
        liquidityPositions: insertliquidityPositions(
        value: {
            address: "${dict["address"]}",
            pairAddress: "${dict["pairAddress"]}",
            token1ImageUrl: "${dict["token1ImageUrl"]}",
            token2ImageUrl: "${dict["token2ImageUrl"]}",
            liquidity: ${dict["liquidity"]},
            token1Address: "${dict["token1Address"]}",
            token2Address: "${dict["token2Address"]}",
            token1Amount:${dict["token1Amount"]},
            token2Amount:${dict["token2Amount"]},
            open: ${dict["open"]},
        }
    )
        
        {
                value{
                        address
                    }
                
            }
        }
    `;

    console.log(query)  
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-cassandra-token": process.env.ASTRA_DB_APPLICATION_TOKEN,
        },
        body: JSON.stringify({ query }),
    });

    try {
        const responseBody = await response.json();
        console.log(responseBody)
        return {
            statusCode: 200,
            body: JSON.stringify(responseBody),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify(err),
        };
    }
};


// const query = `
//     mutation {
//         position: insertpositions(
//         value: {
//             address: "${dict["address"]}",
//             pairAddress: "${dict["pairAddress"]}",
//             time: "${dict["time"]}",
//             date: "${dict["date"]}",
//             liquidity: ${dict["liquidity"]},
//             token1Address: "${dict["token1Address"]}",
//             token2Address: "${dict["token2Address"]}",
//             token1Amount:${dict["token1Amount"]},
//             token2Amount:${dict["token2Amount"]},
//             open: ${dict["open"]},
//         }
//     )
        
//         {
//                 value{
//                         address
//                     }
                
//             }
//         }
//     `;