import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import MainLayout from './_mainLayout';
import { connect } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { getHoldings } from '@/stores/market/marketActions';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BalanceInfo, Chart } from '../../components';
import { SIZES, COLORS, FONTS, dummyData, icons } from "../../constants"



const Portfolio = ({ myHoldings, getHoldings }: any) => {


    const [selectedCoin, setSelectedCoin] = React.useState<{
        sparkline_in_7d?: {
            value?: number[]
        }
    } | null>(null)
    const [wallets, setWallets] = React.useState<Array<{ id: string, qty: number }>>([])
    useFocusEffect(
        React.useCallback(() => {
            // Define a function to fetch and set wallet data
            const fetchWalletData = async () => {
                try {
                    const walletJson = await AsyncStorage.getItem('wallets');
                    const Wallet = JSON.parse(walletJson || '[]');
                    console.log("Portfolio - Wallet data from AsyncStorage:", Wallet);

                    if (Wallet.length > 0 && Wallet[0].id && Wallet[0].balance !== undefined) {
                        let id = Wallet[0].blockchainType;
                        id = (id == "USDT(polygon)") ? "tether" : id;
                        console.log("Portfolio - Wallet ID:", id);

                        const walletData = [{
                            id: id,
                            qty: Wallet[0].balance
                        }];

                        console.log("Portfolio - Setting wallet data:", walletData);
                        setWallets(walletData);

                        // Directly call getHoldings with the data we have
                        console.log("Portfolio - Calling getHoldings with wallet data:", walletData);
                        getHoldings(walletData);
                    } else {
                        console.log("Portfolio - No valid wallets found, using fallback for getHoldings");
                        // Try with a default coin as fallback for testing
                        getHoldings([{
                            id: "bitcoin",
                            qty: 0.1
                        }]);
                    }
                } catch (error) {
                    console.error("Portfolio - Error fetching wallet data:", error);
                    // Fallback to a test coin
                    getHoldings([{
                        id: "bitcoin",
                        qty: 0.1
                    }]);
                }
            };

            // Execute the function
            fetchWalletData();
        }, [])
    );

    let totalWallet = myHoldings.reduce((a: any, b: any) => a + (b.total || 0), 0);

    let valueChange = myHoldings.reduce((a: any, b: any) => a + (b.holding_value_change_7d || 0), 0);
    let changePct = totalWallet > 0 ? (valueChange / (totalWallet - valueChange)) * 100 : 0;

    // Add logging to debug values
    console.log("Portfolio - Total Wallet Value:", totalWallet);
    console.log("Portfolio - Value Change:", valueChange);
    console.log("Portfolio - Change Percentage:", changePct);

    function renderCurrentBalanceSection() {
        return (
            <View
                style={{
                    paddingHorizontal: SIZES.padding,
                    borderBottomLeftRadius: 25,
                    borderBottomRightRadius: 25,
                    backgroundColor: COLORS.gray
                }}
            >
                <Text style={{
                    marginTop: 25,
                    color: COLORS.white,
                    ...FONTS.largeTitle
                }}>Portfolio</Text>

                <BalanceInfo
                    title="Current Balance"
                    displayAmount={totalWallet}
                    changePct={changePct}
                    containerStyle={{
                        marginTop: SIZES.radius,
                        marginBottom: SIZES.padding,

                    }}

                />

            </View>
        )
    }

    return (
        <MainLayout>
            <View
                style={{
                    flex: 1,
                    backgroundColor: COLORS.black
                }}
            >
                {/* Header */}
                {renderCurrentBalanceSection()}


                {/* Chart */}

                <Chart
                    containerStyle={{
                        marginTop: SIZES.radius
                    }}
                    chartPrices={selectedCoin?.sparkline_in_7d?.value || myHoldings[0]?.sparkline_in_7d?.value}
                />
                {/* Assets */}
                {/* Debug: myHoldings length = {myHoldings?.length} */}

                <FlatList
                    data={myHoldings}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{
                        // marginTop: ,
                        paddingHorizontal: SIZES.padding
                    }}
                    ListHeaderComponent={
                        <View>
                            {/* Section_Title */}
                            <Text style={{
                                ...FONTS.h2,
                                color: COLORS.white
                            }}>Your Assets</Text>
                            <View style={{
                                flexDirection: 'row',
                                marginTop: SIZES.radius
                            }}
                            >
                                <Text
                                    style={{
                                        flex: 1,
                                        color: COLORS.lightGray3
                                    }}
                                >Asset</Text>
                                <Text
                                    style={{
                                        flex: 1,
                                        textAlign: 'right',
                                        color: COLORS.lightGray3
                                    }}
                                >Price</Text>
                                <Text
                                    style={{
                                        flex: 1,
                                        textAlign: 'right',
                                        color: COLORS.lightGray3
                                    }}
                                >Holdings</Text>

                            </View>
                        </View>

                    }

                    renderItem={({ item }) => {

                        let priceColor = item.price_change_percentage_7d_in_currency == 0 ? COLORS.lightGray3 : (item.price_change_percentage_7d_in_currency > 0) ? COLORS.lightGreen : COLORS.red;
                        return (
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    height: 55
                                }}
                                onPress={() => { setSelectedCoin(item) }}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Image
                                        source={{ uri: item.image }}
                                        style={{
                                            width: 20,
                                            height: 20
                                        }}
                                    />
                                    <Text
                                        style={{
                                            marginLeft: SIZES.radius,
                                            color: COLORS.white,
                                            ...FONTS.h4
                                        }}
                                    >{item.name}</Text>

                                    {/* Price */}

                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                textAlign: 'right',
                                                color: COLORS.white,
                                                ...FONTS.h4,
                                                lineHeight: 15
                                            }}
                                        >${item.current_price.toLocaleString()}</Text>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'flex-end'
                                            }}
                                        >{
                                                item.price_change_percentage_7d_in_currency != 0 &&
                                                <Image
                                                    source={icons.upArrow}
                                                    style={{
                                                        height: 10,
                                                        width: 10,
                                                        tintColor: priceColor,
                                                        transform: (item.price_change_percentage_7d_in_currency > 0) ? [{ rotate: '45deg' }] : [{ rotate: '135deg' }],

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
                                            >
                                                {item.price_change_percentage_7d_in_currency.toFixed(2)}%
                                            </Text>



                                        </View>


                                    </View>


                                </View>

                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Text
                                        style={{
                                            textAlign: 'right',
                                            color: COLORS.white,
                                            ...FONTS.h4,
                                            lineHeight: 15
                                        }}
                                    >
                                        ${item.total.toLocaleString()}
                                    </Text>
                                    <Text
                                        style={{
                                            textAlign: "right",
                                            color: COLORS.lightGray3,
                                            ...FONTS.body5,
                                            lineHeight: 15,
                                        }}
                                    >
                                        {item.qty}{item.symbol.toUpperCase()}
                                    </Text>

                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
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

