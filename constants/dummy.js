import AsyncStorage from '@react-native-async-storage/async-storage';

export const holdings = [
    {
        id: "bitcoin",
        qty: 888
    },
    {
        id: "ethereum",
        qty: 188
    },
    {
        id: "dogecoin",
        qty: 88888
    }
]

// Basic profile with default values
export const profile = {
    id: 8888888,
    email: "user@example.com" // Default example email
}

export const settings = {
    launchScreen: "Home",
    currency: "USD",
    appearance: "Dark",
    language: "English",
    faceId: false,
}

// Function to get user data from AsyncStorage at runtime
export const getUserProfile = async () => {
    try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
            const userDataJSON = JSON.parse(userData);
            return {
                ...profile,
                email: userDataJSON.email || profile.email
            };
        }
        return profile;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return profile;
    }
};

const dummyData = {
    holdings,
    profile,
    settings,
    getUserProfile
};

export default dummyData;