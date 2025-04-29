import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Holdins / My Holdings

export const GET_HOLDINGS_BEGIN = "GET_HOLDINGS_BEGIN";
export const GET_HOLDINGS_SUCCESS = "GET_HOLDINGS_SUCCESS";
export const GET_HOLDINGS_FAILURE = "GET_HOLDINGS_FAILURE";
export const GET_COIN_MARKET_BEGIN = "GET_COIN_MARKET_BEGIN";
export const GET_COIN_MARKET_SUCCESS = "GET_COIN_MARKET_SUCCESS";
export const GET_COIN_MARKET_FAILURE = "GET_COIN_MARKET_FAILURE";


export const getHoldingsBegin = () => ({
    type: GET_HOLDINGS_BEGIN,
});
export const getHoldingsSuccess = (myholdings) => ({
    type: GET_HOLDINGS_SUCCESS,
    payload: { myholdings },
});
export const getHoldingsFailure = (error) => ({
    type: GET_HOLDINGS_FAILURE,
    payload: { error },
});

const getWallets = async () => {
    try {
        const walletsData = await AsyncStorage.getItem('wallets');
        return walletsData ? JSON.parse(walletsData[0]) : [];
    } catch (error) {
        console.error('Error fetching wallets:', error);
        return [];
    }
}


export function getHoldings(holdings = [], currency = "usd", coinList = [], orderBy = "market_cap_desc", sparkline = true, priceChangePerc = "7d", page = 1, perPage = 10) {
    return async dispatch => {
        dispatch(getHoldingsBegin());
        // let nholdings = [...holdings, ...wallets];
        let ids = holdings.map((coin) => coin.id).join(",");
        let apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=${orderBy}&per_page=${perPage}&page=${page}&sparkline=${sparkline}&price_change_percentage=${priceChangePerc}&ids=${ids}`;

        return axios({
            url: apiUrl,
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }).then((response) => {
            console.log("Holdings API response:", response);
            if (response.status === 200) {
                let myholdings = response.data.map((item) => {
                    let coin = holdings.find(a => a.id === item.id);
                    let price7d = item.current_price / (1 + item.price_change_percentage_7d_in_currency * 0.01);
                    return {
                        id: item.id,
                        symbol: item.symbol,
                        name: item.name,
                        image: item.image,
                        current_price: item.current_price,
                        qty: coin.qty,
                        total: coin.qty * item.current_price,
                        price_change_percentage_7d_in_currency: item.price_change_percentage_7d_in_currency,
                        holding_value_change_7d: coin.qty * (item.current_price - price7d),
                        sparkline_in_7d: {
                            value: item.sparkline_in_7d.price.map(
                                (price) => {
                                    return price * coin.qty;
                                }
                            ),
                        },
                    }
                });
                dispatch(getHoldingsSuccess(myholdings));
            } else {
                dispatch(getHoldingsFailure(response.data));
            }
        }).catch(error => {
            console.error("Holdings API error:", error);
            dispatch(getHoldingsFailure(error));
        });

    };
}

export const getCoinMarketBegin = () => ({
    type: GET_COIN_MARKET_BEGIN,
});
export const getCoinMarketSuccess = (coins) => ({
    type: GET_COIN_MARKET_SUCCESS,
    payload: { coins },
});
export const getCoinMarketFailure = (error) => ({
    type: GET_COIN_MARKET_FAILURE,
    payload: { error },
});

export function getCoinMarket(currency = "usd", orderBy = "market_cap_desc", sparkline = true, priceChangePerc = "7d", page = 1, perPage = 10) {
    return dispatch => {
        dispatch(getCoinMarketBegin());
        let apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=${orderBy}&per_page=${perPage}&page=${page}&sparkline=${sparkline}&price_change_percentage=${priceChangePerc}`;

        console.log("CoinMarket API URL:", apiUrl);

        return axios({
            url: apiUrl,
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }).then(response => {
            console.log("Coin Market API response:", response);
            if (response.status === 200) {
                dispatch(getCoinMarketSuccess(response.data));
            } else {
                dispatch(getCoinMarketFailure(response.data));
            }
        }).catch(error => {
            console.error("Coin Market API error:", error);
            dispatch(getCoinMarketFailure(error));
        });
    };
}
