import React from 'react';
import { View, Text, Image } from 'react-native';
import { FONTS, COLORS } from '../constants';


interface TabIconProps {
    focused: boolean;
    icon: any;
    label?: string;
    isTrade?: boolean;
    iconStyle?: any;
    labelStyle?: any;
}
const TabIcon = ({ focused, icon, label, isTrade = false, iconStyle, labelStyle }: TabIconProps) => {
    if (isTrade) {
        return (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: COLORS.black,
                }}
            >
                <Image
                    source={icon}
                    resizeMode="contain"
                    style={{ width: 25, height: 25, ...iconStyle }}
                    tintColor={COLORS.white}
                />
                <Text style={{ color: COLORS.white, ...FONTS.h4 }}>Trade</Text>
            </View>
        )
    } else {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
                <Image
                    source={icon}
                    resizeMode="contain"
                    style={{ width: 25, height: 25, ...iconStyle }}
                    tintColor={focused ? COLORS.white : COLORS.secondary}
                />
                {label && (
                    <Text style={{
                        color: focused ? COLORS.white : COLORS.secondary,
                        ...FONTS.h4
                    }}>
                        {label}
                    </Text>
                )}
            </View>
        )
    }

}

export default TabIcon;
