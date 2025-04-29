import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import MainLayout from './_mainLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { connect } from 'react-redux';
import { getHoldings, getCoinMarket } from '../../stores/market/marketActions';
import { useFocusEffect } from '@react-navigation/native';
import { SIZES, COLORS, FONTS, icons } from "../../constants"
import { BalanceInfo, Chart, IconTextButton } from '../../components';

const Home = ({ getHoldings, getCoinMarket, myHoldings, coins }: any) => {

  const [selectedCoin, setSelectedCoin] = React.useState<{
    sparkline_in_7d?: {
      price?: number[]
    }
  } | null>(null)
  const [wallets, setWallets] = React.useState<Array<{ id: string, qty: number }>>([])

  // React.useEffect(() => {
  // }, [])

  useFocusEffect(
    React.useCallback(() => {
      console.log("Focus effect triggered");

      // Define a function to fetch and set wallet data
      const fetchWalletData = async () => {
        try {
          const walletJson = await AsyncStorage.getItem('wallets');
          const Wallet = JSON.parse(walletJson || '[]');
          console.log("Wallet data from AsyncStorage:", Wallet);

          if (Wallet.length > 0) {
            // Get the first wallet
            const firstWallet = Wallet[0];

            // Double check all required fields are present
            if (!firstWallet.id && firstWallet.blockchainType) {
              // If id is missing but blockchainType exists, use blockchainType
              firstWallet.id = firstWallet.blockchainType === 'USDT(polygon)' ? 'tether' : firstWallet.blockchainType;
            }

            // Make sure we have both id and balance for API call
            if (firstWallet.id && (firstWallet.balance !== undefined || firstWallet.qty !== undefined)) {
              const balance = firstWallet.balance !== undefined ? firstWallet.balance : firstWallet.qty;
              console.log("Wallet ID:", firstWallet.id, "Balance:", balance);

              const walletData = [{
                id: firstWallet.id,
                qty: balance
              }];

              console.log("Setting wallet data:", walletData);
              setWallets(walletData);

              // Directly call getHoldings with the data we have
              console.log("Calling getHoldings with wallet data:", walletData);
              getHoldings(walletData);
            } else {
              console.log("Wallet missing required fields, using fallback");
              useFallbackWallet();
            }
          } else {
            console.log("No wallets found, using fallback");
            useFallbackWallet();
          }
        } catch (error) {
          console.error("Error fetching wallet data:", error);
          useFallbackWallet();
        }
      };

      // Fallback to use a test coin
      const useFallbackWallet = () => {
        console.log("Using fallback test wallet");
        const testWallet = [{
          id: "bitcoin",
          qty: 0.1
        }];
        setWallets(testWallet);
        getHoldings(testWallet);
      };

      // Execute the function
      fetchWalletData();

      // Get market data separately
      console.log("Calling getCoinMarket");
      getCoinMarket();
    }, [])
  );

  console.log("Current state - myHoldings:", myHoldings);
  console.log("Current state - coins:", coins);

  // Make sure myHoldings exists and is an array
  const safeMyHoldings = Array.isArray(myHoldings) ? myHoldings : [];

  // Calculate wallet total value
  let totalWallet = safeMyHoldings.reduce((a, b) => a + (b.total || 0), 0);

  // Calculate value change
  let valueChange = safeMyHoldings.reduce((a, b) => a + (b.holding_value_change_7d || 0), 0);

  // Fix percentage calculation with safety check for division by zero
  let changePct = totalWallet > 0 ? (valueChange / (totalWallet - valueChange)) * 100 : 0;

  // Log values to debug
  console.log("Home - Total Wallet:", totalWallet);
  console.log("Home - Value Change:", valueChange);
  console.log("Home - Change Percentage:", changePct);

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
