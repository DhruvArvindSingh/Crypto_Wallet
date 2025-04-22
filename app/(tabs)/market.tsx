import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Animated, Image } from 'react-native';
import MainLayout from './_mainLayout';
import { connect } from 'react-redux';
import { getCoinMarket } from '../../stores/market/marketActions';
import { constants, COLORS, icons, FONTS, SIZES } from '../../constants';
import { HeaderBar, TextButton } from '../../components';
import { LineChart } from 'react-native-chart-kit';


const marketTabs = constants.marketTabs.map((marketTab) => ({
    ...marketTab,
    ref: React.createRef<View>(),
}));

const TabIndicator = ({ measureLayout, scrollX }: any) => {
    const inputRange = marketTabs.map((_: any, i: any) => i * SIZES.width);
    const translateX = scrollX.interpolate({
        inputRange,
        outputRange: measureLayout.map((measure: any) => measure.x),
    });

    return (
        <Animated.View
            style={{
                position: 'absolute',
                left: 0,
                width: (SIZES.width - (SIZES.radius * 2)) / 2,
                height: "100%",
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.lightGray,
                transform: [{
                    translateX
                }],
            }}
        />
    )
}

const Tabs = ({ scrollX, onMarketTabPress }: any) => {
    const [measureLayout, setMeasureLayout] = React.useState<Array<{ x: number, y: number, width: number, height: number }>>([]);
    const containerRef = React.useRef<View>(null);

    React.useEffect(() => {
        let ml: Array<{ x: number, y: number, width: number, height: number }> = [];

        marketTabs.forEach((marketTab) => {
            if (marketTab.ref.current && containerRef.current) {
                marketTab.ref.current.measureLayout(
                    containerRef.current,
                    (x: number, y: number, width: number, height: number) => {
                        ml.push({ x, y, width, height });
                        if (ml.length === marketTabs.length) {
                            setMeasureLayout(ml);
                        }
                    },
                    () => console.log('measurement failed')
                );
            }
        });
    }, []);

    return (
        <View
            ref={containerRef}
            style={{
                flexDirection: 'row',
            }}
        >
            {measureLayout.length > 0 && (
                <TabIndicator
                    measureLayout={measureLayout}
                    scrollX={scrollX}
                />
            )}


            {
                marketTabs.map((item, index) => {
                    return (
                        <TouchableOpacity
                            onPress={() => onMarketTabPress(index)}
                            key={`Market-${index}`}
                            style={{
                                flex: 1,
                            }}
                        // onPress={() => setCurrentTab(tab)}
                        >
                            <View
                                ref={item.ref}
                                style={{
                                    paddingHorizontal: 15,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 40,

                                }}
                            >
                                <Text
                                    style={{
                                        ...FONTS.h3,
                                        color: COLORS.white,
                                    }}
                                >
                                    {item.title}
                                </Text>

                            </View>
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    );
};

const Market = ({ getCoinMarket, coins }: any) => {

    const scrollX = React.useRef(new Animated.Value(0)).current;

    const marketTabScrollViewRef = React.useRef();
    const onMarketTabPress = React.useCallback((marketTabIndex: number) => {
        marketTabScrollViewRef?.current?.scrollToOffset({
            offset: marketTabIndex * SIZES.width,
        });
    }, []);

    React.useEffect(() => {
        getCoinMarket();
    }, []);

    const renderTabBar = () => {
        return (
            <View
                style={{
                    marginTop: SIZES.radius,
                    marginHorizontal: SIZES.radius,
                    borderRadius: SIZES.radius,
                    backgroundColor: COLORS.gray,
                }}
            >
                <Tabs
                    scrollX={scrollX}
                    onMarketTabPress={onMarketTabPress}
                />
            </View>
        );
    };

    const renderButtons = () => {
        return (
            <View style={{
                flexDirection: 'row',
                marginHorizontal: SIZES.radius,
                marginTop: SIZES.radius,
            }}>
                <TextButton label="USD" containerStyle={{ marginRight: SIZES.base }} />
                <TextButton label="% (7d)" containerStyle={{ marginLeft: SIZES.base }} />
            </View>
        )
    }

    const renderList = () => {
        return (
            <Animated.FlatList
                ref={marketTabScrollViewRef}
                data={marketTabs}
                contentContainerStyle={{
                    marginTop: SIZES.padding,
                }}
                horizontal
                pagingEnabled
                scrollEventThrottle={16}
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                renderItem={({ item, index }) => {
                    return (
                        <View style={{
                            flex: 1,
                            width: SIZES.width,
                        }}>
                            <FlatList
                                data={coins}
                                keyExtractor={item => item.id}
                                renderItem={({ item, index }) => {

                                    const priceColor = item.price_change_percentage_7d_in_currency == 0 ? COLORS.lightGray3 : (item.price_change_percentage_7d_in_currency > 0 ? COLORS.lightGreen : COLORS.red);


                                    return (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                paddingHorizontal: SIZES.padding,
                                                marginBottom: SIZES.radius,
                                            }}
                                        >
                                            {/* Coins */}
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                flex: 1.5,
                                            }}>

                                                <Image source={{ uri: item.image }} style={{
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: SIZES.radius,
                                                }} />
                                                <Text style={{
                                                    ...FONTS.h3,
                                                    color: COLORS.white,
                                                    marginLeft: SIZES.radius,
                                                }}>
                                                    {item.name}
                                                </Text>
                                            </View>

                                            {/* Line Chart */}
                                            <View style={{
                                                flex: 1,
                                                alignItems: 'flex-end',
                                            }}>
                                                <LineChart
                                                    withVerticalLabels={false}
                                                    withHorizontalLabels={false}
                                                    withDots={false}
                                                    withInnerLines={false}
                                                    withOuterLines={false}
                                                    withShadow={false}
                                                    data={{
                                                        datasets: [
                                                            { data: item.sparkline_in_7d.price }],
                                                        labels: []
                                                    }}
                                                    width={100}
                                                    height={60}
                                                    chartConfig={{
                                                        color: () => priceColor,
                                                    }}
                                                    bezier
                                                    style={{
                                                        paddingRight: 0,
                                                    }}


                                                />
                                            </View>

                                            {/* Figures */}
                                            <View style={{
                                                flex: 1,
                                                alignItems: 'flex-end',
                                                justifyContent: 'center',
                                            }}>
                                                <Text style={{
                                                    ...FONTS.h4,
                                                    color: COLORS.white,
                                                }}>
                                                    ${item.current_price}
                                                </Text>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-end',
                                                    }}
                                                >
                                                    {
                                                        item.price_change_percentage_7d_in_currency != 0 &&
                                                        <Image
                                                            source={icons.upArrow}
                                                            style={{
                                                                width: 10,
                                                                height: 10,
                                                                tintColor: priceColor,
                                                                transform: item.price_change_percentage_7d_in_currency > 0 ? [{ rotate: '45deg' }] : [{ rotate: '135deg' }]
                                                            }}
                                                        />
                                                    }
                                                    <Text
                                                        style={{
                                                            marginLeft: 5,
                                                            ...FONTS.body5,
                                                            color: priceColor,
                                                        }}
                                                    >
                                                        {item.price_change_percentage_7d_in_currency.toFixed(2)}%
                                                    </Text>

                                                </View>
                                            </View>

                                        </View>
                                    )
                                }}
                            />
                        </View>
                    )
                }}
            />
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
                <HeaderBar title="Market" />
                {/* Tab Bar */}
                {renderTabBar()}

                {/* Buttons */}
                {renderButtons()}

                {/* Market List */}
                {renderList()}

            </View>
        </MainLayout>
    );
}

const styles = StyleSheet.create({})


function mapStateToProps(state: any) {
    return {
        coins: state.marketReducer.coins,

    }
}

function mapDispatchToProps(dispatch: any) {
    return {
        getCoinMarket: (currency: any, orderBy: any, sparkline: any, priceChangePerc: any, page: any, perPage: any) => {
            return dispatch(getCoinMarket(currency, orderBy, sparkline, priceChangePerc, page, perPage))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Market)


