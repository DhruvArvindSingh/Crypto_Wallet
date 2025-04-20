import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import MainLayout from './_mainLayout';
import {connect} from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { getHoldings } from '@/stores/market/marketActions';

import { BalanceInfo, Chart  } from '../../components';
import { SIZES, COLORS, FONTS, dummyData, icons} from "../../constants"



const Portfolio = () => {
  return (
    <MainLayout>
      <View>
        <Text>Portfolio</Text>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({})


function mapStateToProps(state: any) {
  return {
    myHoldings: state.marketReducer.myHoldings,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    getHoldings: (holdings: any, currencey: any, coinList: any, orderBy: any, sparkline: any, priceChangePerc: any, page: any, perPage: any) => {
      return dispatch(getHoldings(holdings, currencey, coinList, orderBy, sparkline, priceChangePerc, page, perPage))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio)

