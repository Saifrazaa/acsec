import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';

// I M P O R T  S C R E E N S
import Login from '../pages/auth/login';

import Onboarding from '../pages/onboarding/onboarding';

import Home from '../pages/home/home';
import Logout from '../pages/auth/logout';
import Signup from '../pages/auth/signup';
import AddActivity from '../pages/activity/add-activity';
import Graph from '../pages/graph/graph';
import Calendar from '../pages/calender/calendar';
import CalendarSchedule from '../pages/calender/calendar';
import Settings from '../pages/settings/settings';

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
            <AuthStack.Screen
                name="Signup"
                component={Signup}
                options={{
                    headerShown: false,
                }}
            />
        </AuthStack.Navigator>
    );
}

export function AppRoute({}) {
    return (
        <Drawer.Navigator
            initialRouteName="Home"
            screenOptions={{
                unmountOnBlur: true,
            }}>
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Calendar" component={CalendarSchedule} />
            <Drawer.Screen name="Settings" component={Settings} />
            <Drawer.Screen name="AddActivity" component={AddActivity} />
            <Drawer.Screen name="Graph" component={Graph} />
            <Drawer.Screen name="Logout" component={Logout} />
        </Drawer.Navigator>
    );
}
