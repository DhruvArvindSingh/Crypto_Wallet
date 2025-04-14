import React from 'react';
import { View, Text } from 'react-native';
import { COLORS, SIZES, icons } from '@/constants';


const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <View
            style={{
                flex: 1,
            }}
        >
            {children}
        </View>
    );
}

export default MainLayout;
