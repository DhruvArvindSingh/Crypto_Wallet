import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS } from '@/constants';

// Define type for user data
interface UserData {
    email: string;
    password: string;
}

const SignIn = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);

    // Fetch user data on component mount
    useEffect(() => {
        const getUserData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('userData');
                if (jsonValue) {
                    const parsedData = JSON.parse(jsonValue) as UserData;
                    setUserData(parsedData);

                    // Ensure password field is empty when the page loads
                    setPassword('');
                } else {
                    // If no user data, redirect to sign-up
                    router.replace('/auth/sign-up');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        getUserData();

        // Reset password field when component mounts
        setPassword('');
    }, []);

    const handleSignIn = async () => {
        if (!password) {
            Alert.alert('Error', 'Please enter your password');
            return;
        }

        setLoading(true);
        try {
            // Verify password matches the stored one
            if (userData && userData.password === password) {
                // Set login status
                await AsyncStorage.setItem('isLoggedIn', 'true');

                // Navigate to home after successful login
                router.replace('/(tabs)/home');
            } else {
                Alert.alert('Error', 'Invalid password');
            }
        } catch (error) {
            console.error('Error during sign in:', error);
            Alert.alert('Error', 'Failed to sign in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const goToSignUp = () => {
        router.replace('/auth/sign-up');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>

            {userData && (
                <View style={styles.userInfoContainer}>
                    <Text style={styles.emailText}>{userData.email}</Text>
                </View>
            )}

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={COLORS.gray}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoFocus={true}
                />
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleSignIn}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Signing In...' : 'Sign In'}
                </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <TouchableOpacity onPress={goToSignUp}>
                    <Text style={styles.signUpText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.black,
        justifyContent: 'center',
    },
    title: {
        ...FONTS.h2,
        color: COLORS.white,
        marginBottom: 30,
        textAlign: 'center',
    },
    userInfoContainer: {
        backgroundColor: COLORS.gray,
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
    },
    emailText: {
        color: COLORS.white,
        ...FONTS.h4,
        marginBottom: 5,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: COLORS.white,
        ...FONTS.h4,
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.gray,
        borderRadius: 8,
        padding: 15,
        color: COLORS.white,
        ...FONTS.body3,
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: COLORS.white,
        ...FONTS.h4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        alignItems: 'center',
    },
    footerText: {
        color: COLORS.gray,
        ...FONTS.body4,
    },
    signUpText: {
        color: COLORS.primary,
        ...FONTS.h4,
        marginLeft: 5,
    },
});

export default SignIn; 