const fetch = require("node-fetch"); //npm install node-fetch
// import fetch from 'node-fetch';

exports.handler = async function (event) {
    const address = JSON.parse(event.body);
    const url = process.env.ASTRA_GRAPHQL_ENDPOINT;
    // console.log(address);
    const query = `
    query {
        tokens (value: {address:"${address}"}){ 
          values {
            address
            imageURL
            symbol
            eth
          }
        }
      }
    `;

    // console.log(query);

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
