import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Switch } from 'react-native';
import MainLayout from './_mainLayout';
import { HeaderBar } from '../../components';
import { COLORS, FONTS, SIZES, icons } from '../../constants';
import ProfileDisplay from '@/components/ProfileDisplay';

const SectionTitle = ({ title }: { title: string }) => {
    return (
        <View style={{
            marginTop: SIZES.padding,
        }}>
            <Text style={{ ...FONTS.h4, color: COLORS.lightGray3 }}>{title}</Text>
        </View>
    );
};

const Setting = ({
    title,
    value,
    type,
    onPress
}: {
    title: string,
    value: string | boolean,
    type: 'button' | 'switch',
    onPress: (value?: boolean) => void
}) => {
    if (type === "button") {
        return (
            <TouchableOpacity style={{
                flexDirection: 'row',
                height: 50,
                alignItems: 'center',
            }}
                onPress={() => onPress()}
            >
                <Text style={{ flex: 1, ...FONTS.h3, color: COLORS.white }}>{title}</Text>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Text style={{ marginRight: SIZES.radius, ...FONTS.h3, color: COLORS.lightGray3 }}>{value as string}</Text>
                    <Image
                        source={icons.rightArrow}
                        style={{ width: 15, height: 15, tintColor: COLORS.white }}
                    />
                </View>
            </TouchableOpacity>
        );
    } else {
        return (
            <View style={{
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <Text style={{ flex: 1, ...FONTS.h3, color: COLORS.white }}>{title}</Text>
                <Switch
                    value={value as boolean}
                    onValueChange={onPress}
                />
            </View>
        );
    }
};
const Profile = () => {
    const [faceId, setFaceId] = useState(false);
    const [touchId, setTouchId] = useState(false);
    return (
        <MainLayout>
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: SIZES.padding,
                    backgroundColor: COLORS.black,
                }}
            >
                {/* Header */}
                <HeaderBar
                    title="Profile"
                />

                {/* Details */}
                <ScrollView>
                    {/* User Profile Info */}
                    <ProfileDisplay />

                    {/* App Version */}
                    <SectionTitle
                        title="App"
                    />

                    <Setting
                        title="Launch Screen"
                        value="Home"
                        type="button"
                        onPress={() => console.log("Launch Screen")}
                    />
                    <Setting
                        title="Appearance"
                        value="Dark"
                        type="button"
                        onPress={() => console.log("Appearance")}
                    />

                    <SectionTitle
                        title="ACCOUNT"
                    />

                    <Setting
                        title="Payment Currency"
                        value="USD"
                        type="button"
                        onPress={() => console.log("Payment Currency")}
                    />
                    <Setting
                        title="Language"
                        value="English"
                        type="button"
                        onPress={() => console.log("Language")}
                    />

                    <SectionTitle
                        title="SECURITY"
                    />

                    <Setting
                        title="Face ID"
                        value={faceId}
                        type="switch"
                        onPress={(value) => setFaceId(value ?? false)}
                    />
                    <Setting
                        title="Touch ID"
                        value={touchId}
                        type="switch"
                        onPress={(value) => setTouchId(value ?? false)}
                    />
                </ScrollView>
            </View>
        </MainLayout>
    );
}

const styles = StyleSheet.create({})

export default Profile;
