import React from 'react';
import { Stack } from 'expo-router';
import { COLORS } from '@/constants';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.black },
                animation: 'slide_from_right',
            }}
        />
    );
} 