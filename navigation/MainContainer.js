
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';

import Home from './screens/Home';
import Search from './screens/Search';
import Profile from './screens/Profile';
import Login from './screens/Login';
import Register from './screens/Register';
import AddRecipe from './screens/AddRecipe';
import RecipeDetails from './screens/RecipeDetails';
import Profile2 from './screens/Profile2';
import Comments from './screens/Comments';
import Rate from './screens/Rate';
import Filter from './screens/Filter';
import ChangePassword from './screens/ChangePassword';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const MainTabs =  () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
        >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
            tabBarLabel: '',
            tabBarIcon: ({ focused, size }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} color={focused ? 'tomato' : 'gray'} size={size} />
            ),
            tabBarStyle: {
              backgroundColor: 'rgba(250, 250, 250, 0.95)',
              height: 85,
              paddingTop:10
            },
          }}
        />
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            headerShown: false,
            tabBarLabel: '',
            tabBarIcon: ({focused, size }) => (
              <Ionicons name="search-outline" color={focused ? 'tomato' : 'gray'} size={size} />
            ),
            tabBarStyle: {
              backgroundColor: 'rgba(250, 250, 250, 0.95)',
              height: 85,
              paddingTop:10
            },
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: false,
            tabBarLabel: '',
            tabBarIcon: ({ focused, size }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} color={focused ? 'tomato' : 'gray'} size={size} />
            ),
            tabBarStyle: {
              backgroundColor: 'rgba(250, 250, 250, 0.95)',
              height: 85,
              paddingTop:10
            },
          }}
        />
         
      </Tab.Navigator>
    </View>
  );
};

const MainContainer = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        <Stack.Screen
          name="Back"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" options={{ headerShown: false }} component={Login} />
        <Stack.Screen name='Register'options={{ headerShown: false }} component={Register} />
        <Stack.Screen name="AddRecipe" options={{ headerShown: false }} component={AddRecipe} />
        <Stack.Screen name="RecipeDetails" options={{ headerShown: false }} component={RecipeDetails} />
        <Stack.Screen name="Profile2" options={{ headerShown: false }} component={Profile2} />
        <Stack.Screen name="Comments" options={{ headerShown: false }} component={Comments} />
        <Stack.Screen name="Rate" options={{ headerShown: false }} component={Rate} />
        <Stack.Screen name="Filter" options={{ headerShown: false }} component={Filter} />
        <Stack.Screen name="ChangePassword" options={{ headerShown: false }} component={ChangePassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainContainer;

