import React, { useState } from 'react';
import { View, Dimensions, Platform, Text, TouchableWithoutFeedback } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS, SIZES, FONTS } from '../constants';
import moment from 'moment';

// Add polyfill for requestAnimationFrame
if (Platform.OS === 'web') {
    if (!global.requestAnimationFrame) {
        global.requestAnimationFrame = function (callback) {
            setTimeout(callback, 0);
        };
    }
}

const Chart = ({ containerStyle, chartPrices }) => {
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);

    //Points
    let startUnixTimestamp = moment().subtract(7, 'day').unix();
    let data = chartPrices ? chartPrices.map((item, index) => {
        return {
            x: startUnixTimestamp + (index + 1) * 3600,
            y: item,
        }
    }) : [];

    const chartData = {
        labels: data.map(item => moment.unix(item.x).format('DD/MM')),
        datasets: [{
            data: data.length > 0 ? data.map(item => item.y) : [0]
        }]
    };

    const handleChartTouch = (event) => {
        if (data.length === 0) return;

        const { locationX } = event.nativeEvent;
        const chartWidth = Dimensions.get('window').width - 16;
        const index = Math.floor((locationX / chartWidth) * (data.length - 1));

        if (index >= 0 && index < data.length) {
            setSelectedIndex(index);
            setSelectedPrice(data[index].y);
        }
    };

    return (
        <View style={containerStyle}>
            <TouchableWithoutFeedback onPress={handleChartTouch}>
                <View>
                    <LineChart
                        data={chartData}
                        width={Dimensions.get('window').width - 16}
                        height={220}
                        yAxisLabel="$"
                        chartConfig={{
                            // backgroundColor: COLORS.primary,
                            // backgroundGradientFrom: COLORS.primary,
                            // backgroundGradientTo: COLORS.primary,
                            decimalPlaces: 2,
                            color: (opacity = 1) => COLORS.lightGray3,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16
                            },
                            propsForDots: {
                                r: "2",
                                // strokeWidth: "2",
                                // stroke: COLORS.lightGreen
                            }
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16
                        }}
                        withDots={false}
                        withInnerLines={false}
                        withOuterLines={false}
                        withVerticalLines={false}
                        withHorizontalLines={false}
                        withVerticalLabels={false}
                        withHorizontalLabels={true}
                        fromZero={false}
                        renderDotContent={({ x, y, index }) => {
                            if (index === selectedIndex) {
                                const timestamp = data[index].x;
                                const date = moment.unix(timestamp);
                                console.log("timestamp", timestamp)
                                return (
                                    <View
                                        style={{
                                            position: 'absolute',
                                            top: y - 50,
                                            left: x - 60,
                                            backgroundColor: COLORS.primary,
                                            padding: 8,
                                            borderRadius: 8,
                                            borderWidth: 1,
                                            borderColor: COLORS.lightGreen,
                                            minWidth: 120,
                                        }}
                                    >
                                        <Text style={{ color: COLORS.white, ...FONTS.body4, textAlign: 'center' }}>
                                            ${data[index].y.toFixed(2)}
                                        </Text>
                                        <Text style={{ color: COLORS.white, ...FONTS.body4, textAlign: 'center' }}>
                                            {date.format('MMM DD, HH:mm')}
                                        </Text>
                                    </View>
                                );
                            }
                            return null;
                        }}
                    />
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default Chart;