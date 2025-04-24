import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { COLORS } from '@/constants';

// This component checks if user is already signed up
// and redirects to the appropriate screen
export default function AuthIndex() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');

                // If there's user data, redirect to sign-in
                // Otherwise, redirect to sign-up
                if (userData) {
                    router.replace('/auth/sign-in');
                } else {
                    router.replace('/auth/sign-up');
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                // On error, go to sign-up as default
                router.replace('/auth/sign-up');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Show loading spinner while checking
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.black }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return null;
} 