import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MainLayout from './_mainLayout';

import { connect } from 'react-redux';
import { getHoldings, getCoinMarket } from '../../stores/market/marketActions';
import { useFocusEffect } from '@react-navigation/native';
import { SIZES, COLORS, FONTS, dummyData, icons } from "../../constants"

const Home = ({getHoldings, getCoinMarket, myHoldings, coins}: any) => {
  useFocusEffect(
    React.useCallback(() => {
      getHoldings(  );
      getCoinMarket();
    }, [])
  );
  return (
    <MainLayout>
      <View>
        <Text>Home</Text>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({})


function mapStateToProps(state: any) {
  return {
    myHoldings: state.marketReducer.myHoldings,
    coins: state.marketReducer.coins,
    loading: state.marketReducer.loading,
    error: state.marketReducer.error,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    getHoldings: (holdings: any, currencey: any, coinList: any, orderBy: any, sparkline: any, priceChangePerc: any, page: any, perPage: any) => {
      return dispatch(getHoldings(holdings, currencey, coinList, orderBy, sparkline, priceChangePerc, page, perPage))
    },
    getCoinMarket: (currency: any, orderBy: any, sparkline: any, priceChangePerc: any, page: any, perPage: any) => {
      return dispatch(getCoinMarket(currency, orderBy, sparkline, priceChangePerc, page, perPage))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
