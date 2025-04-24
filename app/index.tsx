import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/constants';

// App entry point - redirects to appropriate screen based on auth status
export default function Index() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasAccount, setHasAccount] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                // Check if user is logged in
                const loginStatus = await AsyncStorage.getItem('isLoggedIn');
                setIsLoggedIn(loginStatus === 'true');

                // Check if user has an account (userData exists)
                const userData = await AsyncStorage.getItem('userData');
                setHasAccount(!!userData);
            } catch (error) {
                console.error('Error checking authentication status:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.black }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    // Redirection logic:
    // 1. If logged in -> home
    // 2. If has account but not logged in -> sign-in
    // 3. If no account -> auth (which will redirect to sign-up)
    if (isLoggedIn) {
        return <Redirect href="/(tabs)/home" />;
    } else if (hasAccount) {
        return <Redirect href="/auth/sign-in" />;
    } else {
        return <Redirect href="/auth" />;
    }
}
