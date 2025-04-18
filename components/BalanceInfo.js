import React from 'react';
import { View, Text, Image } from 'react-native';
import { COLORS, SIZES, icons, FONTS } from '../constants';

const BalanceInfo = ({ title, displayAmount, changePct, containerStyle }) => {
    return (
        <View
            style={{
                ...containerStyle
            }}
        >
            {/* Title */}
            <Text
                style={{
                    ...FONTS.h3,
                    color: COLORS.lightGray3,
                }}
            >
                {title}
            </Text>

            {/* Figures */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                }}
            >
                <Text
                    style={{
                        ...FONTS.h3,
                        color: COLORS.lightGray3,
                    }}
                >$</Text>
                <Text
                    style={{
                        marginLeft: SIZES.base,
                        ...FONTS.h2,
                        color: COLORS.white,
                    }}
                >{displayAmount}</Text>
                <Text
                    style={{
                        ...FONTS.h3,
                        color: COLORS.lightGray3,
                    }}
                >
                    USD
                </Text>
            </View>

            {/* changePct */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                {
                    changePct != 0 &&
                    <Image
                        source={icons.upArrow}
                        style={{
                            width: 10,
                            height: 10,
                            alignSelf: 'center',
                            tintColor: (changePct > 0 ? COLORS.lightGreen : COLORS.red),
                            transform: [{ rotate: (changePct > 0 ? '45deg' : '135deg') }],
                        }}
                    />
                }
                <Text
                    style={{
                        marginLeft: SIZES.base,
                        alignSelf: 'flex-end',
                        ...FONTS.h4,
                        color: (changePct == 0 ? COLORS.lightGray3 : (changePct > 0 ? COLORS.lightGreen : COLORS.red)),

                    }}
                >{changePct.toFixed(2)}%</Text>
                
                <Text
                    style={{
                        ...FONTS.h4,
                        marginLeft: SIZES.radius,
                        alignSelf: 'flex-end',
                        color: COLORS.lightGray3,
                    }}
                >7d Change</Text>
            </View>
        </View>
    )
}

export default BalanceInfo;
