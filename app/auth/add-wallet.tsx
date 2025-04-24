import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// Define types
interface BlockchainType {
    id: string;
    name: string;
}

const blockchainTypes: BlockchainType[] = [
    { id: 'utxo', name: 'Bitcoin' },
    { id: 'ethereum', name: 'Ethereum' },
    { id: 'ethereum-classic', name: 'Ethereum Classic' },
    { id: 'tron', name: 'Tron' },
    { id: 'polygon', name: 'Polygon' },
    { id: 'binance-smart-chain', name: 'Binance Smart Chain' },
    { id: 'solana', name: 'Solana' },
    { id: 'xrp', name: 'XRP' },
    { id: 'kaspa', name: 'KASPA' },
    { id: 'polygon', name: 'Polygon' }
];

const AddWallet = () => {
    const [publicKey, setPublicKey] = useState('');
    const [selectedBlockchain, setSelectedBlockchain] = useState<BlockchainType | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAddWallet = async () => {
        // Validate inputs
        if (!publicKey || !selectedBlockchain) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        setLoading(true);
        try {

            try{
                const response = await axios.get(`https://rest.cryptoapis.io/addresses-latest/evm/${selectedBlockchain.id}/mainnet/${publicKey}/balance`, {
                    headers: {
                        'x-api-key': 'ce9223e56a0ac1aa480985e556435d2476c9c92a'
                    }
                })
                console.log("response", response.data);
            } catch (error) {
                console.error('Error fetching balance:', error);
                Alert.alert('Error', 'Failed to fetch balance. Please try again.');
            }
            // Get existing wallets if any
            const existingWalletsJSON = await AsyncStorage.getItem('wallets');
            let wallets = existingWalletsJSON ? JSON.parse(existingWalletsJSON) : [];

            // Create new wallet
            const newWallet = {
                id: Date.now().toString(),
                publicKey,
                blockchainType: selectedBlockchain.id,
                blockchainName: selectedBlockchain.name,
                createdAt: new Date().toISOString()
            };

            // Add new wallet to list
            wallets.push(newWallet);

            // Save updated wallet list to AsyncStorage
            await AsyncStorage.setItem('wallets', JSON.stringify(wallets));

            // Navigate to home screen
            router.replace('/(tabs)/home');
        } catch (error) {
            console.error('Error adding wallet:', error);
            Alert.alert('Error', 'Failed to add wallet. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const selectBlockchain = (blockchain: BlockchainType) => {
        setSelectedBlockchain(blockchain);
        setShowDropdown(false);
    };

    const skipForNow = () => {
        router.replace('/(tabs)/home');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Add Your Wallet</Text>
                <Text style={styles.subtitle}>
                    Add your existing wallet or create a new one to get started
                </Text>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Public Key</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your public key"
                            placeholderTextColor={COLORS.gray}
                            value={publicKey}
                            onChangeText={setPublicKey}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Blockchain Type</Text>
                        <TouchableOpacity
                            style={styles.dropdownSelector}
                            onPress={() => setShowDropdown(!showDropdown)}
                        >
                            <Text style={styles.dropdownText}>
                                {selectedBlockchain ? selectedBlockchain.name : 'Select blockchain type'}
                            </Text>
                            <Ionicons
                                name={showDropdown ? "chevron-up" : "chevron-down"}
                                size={24}
                                color={COLORS.white}
                            />
                        </TouchableOpacity>

                        {showDropdown && (
                            <View style={styles.dropdownMenu}>
                                {blockchainTypes.map(blockchain => (
                                    <TouchableOpacity
                                        key={blockchain.id}
                                        style={styles.dropdownItem}
                                        onPress={() => selectBlockchain(blockchain)}
                                    >
                                        <Text style={styles.dropdownItemText}>{blockchain.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddWallet}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Adding Wallet...' : 'Add Wallet'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={skipForNow}
                    >
                        <Text style={styles.skipButtonText}>Skip for now</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
        paddingTop: 40,
    },
    title: {
        ...FONTS.h1,
        color: COLORS.white,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        ...FONTS.body3,
        color: COLORS.lightGray,
        marginBottom: 30,
        textAlign: 'center',
    },
    form: {
        marginTop: 20,
    },
    inputContainer: {
        marginBottom: 24,
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
    dropdownSelector: {
        backgroundColor: COLORS.gray,
        borderRadius: 8,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        color: COLORS.white,
        ...FONTS.body3,
    },
    dropdownMenu: {
        backgroundColor: COLORS.gray,
        borderRadius: 8,
        marginTop: 5,
        padding: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    dropdownItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray1,
    },
    dropdownItemText: {
        color: COLORS.white,
        ...FONTS.body3,
    },
    addButton: {
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
    skipButton: {
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    skipButtonText: {
        color: COLORS.lightGray,
        ...FONTS.body4,
        textDecorationLine: 'underline',
    },
});

export default AddWallet; 