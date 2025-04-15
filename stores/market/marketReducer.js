import *  as marketActions from './marketActions';

const initialState = {
    myHoldings: [],
    coins: [],
    loading: false,
    error: null,
};

const marketReducer = (state = initialState, action) => {
    switch (action.type) {
        case marketActions.GET_HOLDINGS_BEGIN:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case marketActions.GET_HOLDINGS_SUCCESS:
            return {
                ...state,
                loading: false,
                myHoldings: action.payload.myholdings,
            };
        case marketActions.GET_HOLDINGS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };
        case marketActions.GET_COIN_MARKET_BEGIN:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case marketActions.GET_COIN_MARKET_SUCCESS:
            return {
                ...state,
                loading: false,
                coins: action.payload.coins,
            };
        case marketActions.GET_COIN_MARKET_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };
        default:
            return state;
    }
};

export default marketReducer;

