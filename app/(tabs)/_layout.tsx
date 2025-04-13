import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import React from 'react';
import { Platform } from 'react-native';

import Home from './home'
import Profile from "./profile";
import Trade from "./trade";
import Portfolio from "./portfolio";
import Market from "./market";


import icons from '@/constants/icons.js';
import { useColorScheme } from '@/hooks/useColorScheme';
import { COLORS } from "@/constants"
import { TabIcon } from '@/components';

const Tab = createBottomTabNavigator()
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.primary,
          borderTopColor: "transparent",
        }
      }}
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.home}
              label="Home"
            />
          )
        }}
      />
      <Tab.Screen
        name="portfolio"
        component={Portfolio}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.briefcase}
              label="Porfolio"
            />
          ),
        }}
      />
      <Tab.Screen
        name="trade"
        component={Trade}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.trade}
              label="Trade"
              isTrade={true}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Market"
        component={Market}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.market}
              label="Market"
            />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.profile}
              label="Profile"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
