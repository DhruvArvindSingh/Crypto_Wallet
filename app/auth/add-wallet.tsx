import React, { useState } from 'react';
import Moralis from 'moralis';
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
    { id: 'USDT(polygon)', name: 'USDT(polygon)' },
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
        console.log("selectedBlockchain", selectedBlockchain);
        const chain = selectedBlockchain.id === 'USDT(polygon)' ? '0x89' : '0x1';
        console.log("chain", chain);
        let response;

        setLoading(true);
        try {

            try {
                await Moralis.start({
                    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjczMjEyNzVjLTM4ZDQtNGVmMy1iZTcxLTRiZjE2MDZhMmE5YSIsIm9yZ0lkIjoiNDA4MDcyIiwidXNlcklkIjoiNDE5MzEyIiwidHlwZUlkIjoiNDFmZGQ2MGEtYWM3My00ZThiLWIyZWUtODE4MWU2ZGJlMjQ2IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MjYwNzk3NTcsImV4cCI6NDg4MTgzOTc1N30.jRtk5QKQTuyO2YNgqYJ39iIPk2TkMW8vL92HVS9-Ljc"
                });

                response = await Moralis.EvmApi.token.getWalletTokenBalances({
                    "chain": chain,
                    "address": publicKey
                });
                response = response.raw[0];
                console.log("response", response);

            } catch (e) {
                console.error(e);
            }
            // Get existing wallets if any
            const existingWalletsJSON = await AsyncStorage.getItem('wallets');
            let wallets = existingWalletsJSON ? JSON.parse(existingWalletsJSON) : [];

            // Create new wallet
            const newWallet = {
                id: selectedBlockchain.id === 'USDT(polygon)' ? 'tether' : selectedBlockchain.id,
                publicKey,
                blockchainType: selectedBlockchain.id,
                balance: response?.balance ? parseFloat(response.balance) * Math.pow(10, -response.decimals) : 0,
                blockchainName: selectedBlockchain.name,
                createdAt: new Date().toISOString()
            };
            console.log("newWallet", newWallet);

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