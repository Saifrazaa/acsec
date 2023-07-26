import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';

// I M P O R T  S C R E E N S
import Login from '../pages/auth/login';

import Onboarding from '../pages/onboarding/onboarding';

import Home from '../pages/home/home';

// stack for non-logged in users
const AuthStack = createStackNavigator();
const Drawer = createDrawerNavigator();

export function Auth({isNew}) {
    return (
        <AuthStack.Navigator initialRouteName={isNew ? 'Onboarding' : 'Login'}>
            <AuthStack.Screen
                name="Onboarding"
                component={Onboarding}
                options={{
                    headerShown: false,
                }}
            />
            <AuthStack.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown: false,
                }}
            />
        </AuthStack.Navigator>
    );
}

export function AppRoute({}) {
    return (
        <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Settings" component={Home} />
            <Drawer.Screen name="Logout" component={Home} />
        </Drawer.Navigator>
    );
}
