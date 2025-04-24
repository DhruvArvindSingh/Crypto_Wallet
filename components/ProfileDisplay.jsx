import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '@/constants';
import { getUserProfile } from '@/constants/dummy';

/**
 * ProfileDisplay component that shows user profile information
 * Fetches the real email from AsyncStorage at runtime using getUserProfile
 */
const ProfileDisplay = () => {
    const [userProfile, setUserProfile] = useState({ id: 0, email: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getUserProfile();
                setUserProfile(profile);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Profile</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>User ID:</Text>
                <Text style={styles.value}>{userProfile.id}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{userProfile.email}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: COLORS.gray,
        borderRadius: 8,
        marginVertical: 8,
    },
    title: {
        ...FONTS.h3,
        color: COLORS.white,
        marginBottom: 16,
    },
    infoContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        ...FONTS.body4,
        color: COLORS.lightGray,
        width: 80,
    },
    value: {
        ...FONTS.body4,
        color: COLORS.white,
        flex: 1,
    },
    loadingText: {
        ...FONTS.body4,
        color: COLORS.lightGray,
        textAlign: 'center',
    },
});

export default ProfileDisplay; 