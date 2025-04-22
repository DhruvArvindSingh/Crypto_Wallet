import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { setTradeModalVisibility } from '@/stores/tab/tabActions';

import Home from './home'
import Profile from "./profile";
import Trade from "./trade";
import Portfolio from "./portfolio";
import Market from "./market";

import icons from '@/constants/icons.js';
import { useColorScheme } from '@/hooks/useColorScheme';
import { COLORS } from "@/constants"
import { TabIcon } from '@/components';

const TabBarButton = ({ children, onPress }: any) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </TouchableOpacity>
  );
};

const Tab = createBottomTabNavigator();

function TabLayout({ setTradeModalVisibility, isTradeModalVisible }: any) {
  const colorScheme = useColorScheme();

  function tradeTabButtonOnClickHandler() {
    console.log("tradeTabButtonOnClickHandler")
    setTradeModalVisibility(!isTradeModalVisible)
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.primary,
          borderTopColor: "transparent",
          height: 84,
          justifyContent: "center",
          // alignItems: "center",
        }
      }}
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => {
            if (!isTradeModalVisible) {
              return (
                <TabIcon
                  focused={focused}
                  icon={icons.home}
                  label="Home"
                />
              )
            }
          }
        }}
        listeners={{
          tabPress: (e) => {
            if (isTradeModalVisible) {
              e.preventDefault()
            }
          }
        }}
      />
      <Tab.Screen
        name="portfolio"
        component={Portfolio}
        options={{
          tabBarIcon: ({ focused }) => {
            if (!isTradeModalVisible) {
              return (
                <TabIcon
                  focused={focused}
                  icon={icons.briefcase}
                  label="Porfolio"
                />
              )
            }
          }
        }}
        listeners={{
          tabPress: (e) => {
            if (isTradeModalVisible) {
              e.preventDefault()
            }
          }
        }}
      />
      <Tab.Screen
        name="trade"
        component={Trade}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <TabIcon
                focused={focused}
                icon={isTradeModalVisible ? icons.close : icons.trade}
                iconStyle={isTradeModalVisible ? {
                  width: 15,
                  height: 15,
                } : {
                  width: 25,
                  height: 25,
                }}
                label="Trade"
                isTrade={true}
              />
            )
          },
          tabBarButton: (props) => (
            <TabBarButton
              {...props}
              onPress={() => tradeTabButtonOnClickHandler()}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Market"
        component={Market}
        options={{
          tabBarIcon: ({ focused }) => {
            if (!isTradeModalVisible) {
              return (
                <TabIcon
                  focused={focused}
                  icon={icons.market}
                  label="Market"
                />
              )
            }
          }
        }}
        listeners={{
          tabPress: (e) => {
            if (isTradeModalVisible) {
              e.preventDefault()
            }
          }
        }}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => {
            if (!isTradeModalVisible) {
              return (
                <TabIcon
                  focused={focused}
                  icon={icons.profile}
                  label="Profile"
                />
              )
            }
          }
        }}
        listeners={{
          tabPress: (e) => {
            if (isTradeModalVisible) {
              e.preventDefault()
            }
          }
        }}
      />
    </Tab.Navigator>
  );
}

function mapStateToProps(state: any) {
  return {
    isTradeModalVisible: state.tabReducer.isTradeModalVisible
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    setTradeModalVisibility: (isVisible: boolean) => dispatch(setTradeModalVisibility(isVisible))
  }
}

const ConnectedTabLayout = connect(mapStateToProps, mapDispatchToProps)(TabLayout);

export default function Layout() {
  return <ConnectedTabLayout />;
}
