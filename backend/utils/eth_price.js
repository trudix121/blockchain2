const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://coingecko.p.rapidapi.com/coins/ethereum',
  params: {
    localization: 'true',
    tickers: 'true',
    market_data: 'true',
    community_data: 'true',
    developer_data: 'true',
    sparkline: 'false'
  },
  headers: {
    'X-RapidAPI-Key': 'b25ea3be8amshd063e77bb9223d7p1985c0jsn348dce625571',
    'X-RapidAPI-Host': 'coingecko.p.rapidapi.com'
  }
};

async function view() {
    try {
        const response = await axios.request(options);
        return response.data.market_data.current_price.eur;
    } catch (error) {
        console.error(error);
    }
}

async function fetchData() {
    const vs = await view();
    return vs;
}

module.exports = fetchData;
