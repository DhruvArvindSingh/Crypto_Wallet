import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MainLayout from './_mainLayout';

import { connect } from 'react-redux';
import { getHoldings, getCoinMarket } from '../../stores/market/marketActions';
import { useFocusEffect } from '@react-navigation/native';
import { SIZES, COLORS, FONTS, dummyData, icons } from "../../constants"
import { BalanceInfo, IconTextButton } from '../../components';

const Home = ({ getHoldings, getCoinMarket, myHoldings, coins }: any) => {
  useFocusEffect(
    React.useCallback(() => {
      getHoldings(dummyData.holdings);
      getCoinMarket();
    }, [])
  );

  let totalWallet = myHoldings.reduce((a: any, b: any) => a + (b.total || 0), 0);

  let valueChange = myHoldings.reduce((a: any, b: any) => a + (b.holding_value_change_7d || 0), 0);
  let changePct = (valueChange / totalWallet - valueChange) * 100;

  console.log("totalWallet", totalWallet);
  console.log("myHoldings", myHoldings);

  const renderWalletInfoSection = () => {
    return (
      <View
        style={{
          paddingHorizontal: SIZES.padding,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          backgroundColor: COLORS.gray,
        }}
      >
        <BalanceInfo
          title="Your Wallet"
          displayAmount={totalWallet}
          changePct={changePct}
          containerStyle={{
            marginTop: 40
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
            marginBottom: 5,
            paddingHorizontal: SIZES.radius,
          }}  
        >
          <IconTextButton
            label="Transfer"
            icon={icons.send}
            containerStyle={{
             flex: 1, 
              marginRight: SIZES.radius,
              height: 40,
              // marginBottom: 20,
            }}
            onPress={() => console.log("Transfer")}
          />
          
          <IconTextButton
            label="Withdraw"
            icon={icons.withdraw}
            containerStyle={{
             flex: 1, 
              // marginRight: SIZES.radius,
              height: 40,
            }}
            onPress={() => console.log("Withdraw")}
          />

        </View>
      </View>
    )
  }
  return (
    <MainLayout>
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.black,
        }}
      >
        {/* Header */}
        {renderWalletInfoSection()}

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
