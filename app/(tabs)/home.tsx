import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import MainLayout from './_mainLayout';

import { connect } from 'react-redux';
import { getHoldings, getCoinMarket } from '../../stores/market/marketActions';
import { useFocusEffect } from '@react-navigation/native';
import { SIZES, COLORS, FONTS, dummyData, icons } from "../../constants"
import { BalanceInfo, Chart, IconTextButton } from '../../components';

const Home = ({ getHoldings, getCoinMarket, myHoldings, coins }: any) => {

  const [selectedCoin, setSelectedCoin] = React.useState(null)

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
            marginBottom: -20,
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

        {/* Chart */}
        <Chart
          containerStyle={{
            marginTop: SIZES.padding,

          }}
          chartPrices={selectedCoin ? selectedCoin?.sparkline_in_7d?.price : coins[0]?.sparkline_in_7d?.price}
        />

        {/* Top Crypto */}
        <FlatList
          data={coins}
          keyExtractor={item => item.id}
          contentContainerStyle={{
            marginTop: 30,
            paddingHorizontal: SIZES.padding
          }}
          ListHeaderComponent={
            <View style={{ marginBottom: SIZES.radius }}>
              <Text style={{ color: COLORS.white, ...FONTS.h3, fontSize: 18 }}>
                Top Cryptocurrency
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            let priceColor = (item.price_change_percentage_7d_in_currency == 0) ? COLORS.lightGray3 : (item.price_change_percentage_7d_in_currency > 0) ? COLORS.lightGreen : COLORS.red;
            return (
              <TouchableOpacity
                style={{
                  height: 55,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={() => setSelectedCoin(item)}
              >
                {/* Logo */}
                <View style={{
                  width: 35
                }}>
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      height: 20,
                      width: 20
                    }}
                  />
                </View>

                {/* Name */}
                <View style={{
                  flex: 1
                }}>
                  <Text style={{ color: COLORS.white, ...FONTS.h3 }}>{item.name}</Text>
                </View>
                {/* Logo */}
                <View style={{
                  width: 60
                }}>
                  <Text
                    style={{
                      textAlign: 'right',
                      color: COLORS.white,
                      ...FONTS.h3,
                      fontSize: 16,
                    }}
                  >${item.current_price.toFixed(1)}</Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end'
                    }}
                  >
                    {
                      item.price_change_percentage_7d_in_currency != 0 &&
                      <Image
                        source={
                          icons.upArrow
                        }
                        style={{
                          height: 10,
                          width: 10,
                          tintColor: priceColor,
                          transform: item.price_change_percentage_7d_in_currency > 0 ? [{ rotate: '45deg' }] : [{ rotate: '135deg' }]
                        }}
                      />
                    }
                    <Text
                      style={{
                        marginLeft: 5,
                        color: priceColor,
                        ...FONTS.body5,
                        lineHeight: 15
                      }}
                    >{item.price_change_percentage_7d_in_currency.toFixed(2)}%</Text>

                  </View>
                </View>
              </TouchableOpacity>
            )

          }}
          ListFooterComponent={
            <View
              style={{
                marginBottom: 50
              }}
            />
          }

        />

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
