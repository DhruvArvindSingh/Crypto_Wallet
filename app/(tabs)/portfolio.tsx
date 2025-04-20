import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import MainLayout from './_mainLayout';
import { connect } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { getHoldings } from '@/stores/market/marketActions';

import { BalanceInfo, Chart } from '../../components';
import { SIZES, COLORS, FONTS, dummyData, icons } from "../../constants"



const Portfolio = ({ myHoldings, getHoldings }: any) => {


    const [selectedCoin, setSelectedCoin] = React.useState(null)

    useFocusEffect(
        React.useCallback(() => {
            getHoldings(dummyData.holdings);
        }, [])
    );

    let totalWallet = myHoldings.reduce((a: any, b: any) => a + (b.total || 0), 0);

    let valueChange = myHoldings.reduce((a: any, b: any) => a + (b.holding_value_change_7d || 0), 0);
    let changePct = (valueChange / totalWallet - valueChange) * 100;

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
                    chartPrices={selectedCoin ? selectedCoin?.sparkline_in_7d.value : myHoldings[0]?.sparkline_in_7d?.value}
                />
                {/* Assets */}

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

